// src/components/three/PhxParticles.tsx
"use client";

import React, { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
// three helpers
import { GPUComputationRenderer } from "three/examples/jsm/Addons.js";
import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js";

type Props = {
    texSize?: number;        // texture size (texSize^2 = number of particles)
    particleSize?: number;   // size of each point in pixels base
    color?: string;          // particle color hex
};

export default function PhxParticles({
    texSize = 128,
    particleSize = 2,
    color = "#FF5304",
    ...props
}: Props) {
    const pointsRef = useRef<THREE.Points | null>(null);
    const invisibleMeshRef = useRef<THREE.Mesh | null>(null);
    const gpuRef = useRef<any>(null); // GPUComputationRenderer instance
    const posVariableRef = useRef<any>(null);
    const velVariableRef = useRef<any>(null);
    const velUniformsRef = useRef<any>(null);
    const materialRef = useRef<any>(null);
    const mousePos = useRef(new THREE.Vector3(0, 0, 0));
    const mouseForce = useRef(0);

    // load your glb (place phx_project.glb in /public)
    const gltf = useGLTF("/phx_project.glb") as any;
    // try to find the mesh inside the gltf (adapte si nécessaire)
    const modelMesh = gltf?.nodes?.Curve002 || gltf?.scene?.children?.[0];

    const { gl, camera, size: viewSize } = useThree();

    // --- Shader strings for GPGPU ---
    const simVelocityFragment = useMemo(() => {
        return `
    precision highp float;
    uniform sampler2D uOriginalPosition;
    uniform vec3 uMouse;
    uniform float uMouseForce;
    uniform float uTime;
    void main() {
    vec2 vUv = (gl_FragCoord.xy + vec2(0.5)) / resolution.xy;
    vec3 pos = texture2D(texturePosition, vUv).xyz;
    vec3 orig = texture2D(uOriginalPosition, vUv).xyz;
    vec3 vel = texture2D(textureVelocity, vUv).xyz;

    // spring to original (restoring)
    vec3 toOrig = (orig - pos);
    vel += toOrig * 0.02;

    // mouse force (repel)
    vec3 diff = pos - uMouse;
    float dist = length(diff);
    float radius = 0.45;
    if(dist < radius){
        float f = (1.0 - dist / radius) * uMouseForce;
        vel += normalize(diff) * f * 0.5;
    }

    // small noise to keep motion dreamy
    vel += 0.001 * vec3(
        sin(uTime + pos.x * 10.0),
        cos(uTime + pos.y * 10.0),
        sin(uTime + pos.z * 10.0)
    );

    // damping
    vel *= 0.96;

    gl_FragColor = vec4(vel, 1.0);
    
    }`;
    }, []);

    const simPositionFragment = useMemo(() => {
        return `
    precision highp float;
    void main() {
        vec2 vUv = (gl_FragCoord.xy + vec2(0.5)) / resolution.xy;
        vec3 pos = texture2D(texturePosition, vUv).xyz;
        vec3 vel = texture2D(textureVelocity, vUv).xyz;
        pos += vel;
        gl_FragColor = vec4(pos, 1.0);
    }`;
    }, []);

    // particle shaders (vertex + fragment)
    const particleVertex = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform sampler2D uPositionTexture;
    uniform float uParticleSize;
    void main(){
      vUv = uv;
      vec3 pos = texture2D(uPositionTexture, vUv).xyz;
      vPosition = pos;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = uParticleSize / -mvPosition.z;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

    const particleFragment = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform sampler2D uVelocityTexture;
    uniform vec3 uColor;
    void main(){
      float center = length(gl_PointCoord - vec2(0.5));
      if(center > 0.5) discard;
      vec3 velocity = texture2D(uVelocityTexture, vUv).xyz;
      float alpha = clamp(length(velocity) * 40.0, 0.03, 0.95);
      // soft edge
      float fall = smoothstep(0.5, 0.25, center);
      gl_FragColor = vec4(uColor * 1.0, alpha * fall);
    }
  `;

    // --- Build data textures (sample model surface) ---
    const { geometry, uvsBufferAttr, positionsBuffer } = useMemo(() => {
        if (!modelMesh || !modelMesh.geometry) return { geometry: null, uvsBufferAttr: null, positionsBuffer: null };
        // const texSize = texSize;
        const number = texSize * texSize;
        const data = new Float32Array(4 * number);
        const positions = new Float32Array(3 * number);
        const uvs = new Float32Array(2 * number);

        // use MeshSurfaceSampler to pick points from the mesh surface
        const sampler = new MeshSurfaceSampler(modelMesh).build();
        const _temp = new THREE.Vector3();

        let index = 0;
        for (let i = 0; i < texSize; i++) {
            for (let j = 0; j < texSize; j++) {
                const idx = i * texSize + j;
                sampler.sample(_temp);
                data[4 * idx] = _temp.x;
                data[4 * idx + 1] = _temp.y;
                data[4 * idx + 2] = _temp.z;
                data[4 * idx + 3] = 1.0;

                positions[3 * idx] = _temp.x;
                positions[3 * idx + 1] = _temp.y;
                positions[3 * idx + 2] = _temp.z;

                uvs[2 * idx] = j / (texSize - 1);
                uvs[2 * idx + 1] = i / (texSize - 1);
            }
        }

        return {
            geometry: new THREE.BufferGeometry(),
            uvsBufferAttr: new THREE.BufferAttribute(uvs, 2),
            positionsBuffer: positions,
            initialDataTexture: data,
        };
    }, [modelMesh, texSize]);

    // init GPGPU + geometry + material once model is ready
    useEffect(() => {
        if (!modelMesh || !geometry || !uvsBufferAttr || !positionsBuffer) return;

        // safety: need WebGL2 or float texture support
        if (!gl.capabilities.isWebGL2 && !gl.getContext().getExtension('OES_texture_float')) {
            console.warn("Votre navigateur ne supporte pas les textures flottantes nécessaires au GPGPU.");
            return;
        }

        // build DataTextures
        const number = texSize * texSize;
        // build initial position data again (recreate to be sure)
        const posArray = new Float32Array(4 * number);
        const velArray = new Float32Array(4 * number);
        // fill posArray from positionsBuffer
        for (let i = 0; i < number; i++) {
            posArray[4 * i] = positionsBuffer[3 * i];
            posArray[4 * i + 1] = positionsBuffer[3 * i + 1];
            posArray[4 * i + 2] = positionsBuffer[3 * i + 2];
            posArray[4 * i + 3] = 1;
            velArray[4 * i + 0] = 0;
            velArray[4 * i + 1] = 0;
            velArray[4 * i + 2] = 0;
            velArray[4 * i + 3] = 1;
        }

        const positionTexture = new THREE.DataTexture(posArray, texSize, texSize, THREE.RGBAFormat, THREE.FloatType);
        positionTexture.needsUpdate = true;
        positionTexture.minFilter = THREE.NearestFilter;
        positionTexture.magFilter = THREE.NearestFilter;
        positionTexture.wrapS = THREE.ClampToEdgeWrapping;
        positionTexture.wrapT = THREE.ClampToEdgeWrapping;

        const velocityTexture = new THREE.DataTexture(velArray, texSize, texSize, THREE.RGBAFormat, THREE.FloatType);
        velocityTexture.needsUpdate = true;
        velocityTexture.minFilter = THREE.NearestFilter;
        velocityTexture.magFilter = THREE.NearestFilter;
        velocityTexture.wrapS = THREE.ClampToEdgeWrapping;
        velocityTexture.wrapT = THREE.ClampToEdgeWrapping;

        // GPUComputationRenderer (size x size)
        const gpuCompute = new GPUComputationRenderer(texSize, texSize, gl);
        gpuRef.current = gpuCompute;

        // add variables
        const posVar = gpuCompute.addVariable("texturePosition", simPositionFragment, positionTexture);
        const velVar = gpuCompute.addVariable("textureVelocity", simVelocityFragment, velocityTexture);

        gpuCompute.setVariableDependencies(posVar, [posVar, velVar]);
        gpuCompute.setVariableDependencies(velVar, [posVar, velVar]);

        // uniforms for velocity shader
        velVar.material.uniforms.uOriginalPosition = { value: positionTexture };
        velVar.material.uniforms.uMouse = { value: new THREE.Vector3(0, 0, 0) };
        velVar.material.uniforms.uMouseForce = { value: 0.0 };
        velVar.material.uniforms.uTime = { value: 0.0 };

        // init compute renderer
        const error = gpuCompute.init();
        if (error !== null) {
            console.error("GPUComputationRenderer init error:", error);
            return;
        }

        posVariableRef.current = posVar;
        velVariableRef.current = velVar;
        velUniformsRef.current = velVar.material.uniforms;

        // Build geometry for Points
        const geom = geometry;
        geom.setAttribute("position", new THREE.BufferAttribute(positionsBuffer, 3));
        geom.setAttribute("uv", uvsBufferAttr);
        geom.computeBoundingBox();

        // Build shader material using textures from gpu
        const mat = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uPositionTexture: { value: gpuCompute.getCurrentRenderTarget(posVar).texture },
                uVelocityTexture: { value: gpuCompute.getCurrentRenderTarget(velVar).texture },
                uParticleSize: { value: particleSize },
                uColor: { value: new THREE.Color(color) },
            },
            vertexShader: particleVertex,
            fragmentShader: particleFragment,
        });

        // create points
        const points = new THREE.Points(geom, mat);
        points.frustumCulled = false;

        // attach to ref for useFrame updates
        (pointsRef as any).current = points;
        materialRef.current = mat;

        // Add points to a holder object in scene: we'll create a Group in JSX and add this points to it
        // But since we are inside useEffect (no direct mount), we simply rely on the JSX Points to use same geometry/material.
        // compute once to initialize
        gpuCompute.compute();

        return () => {
            // cleanup
            try {
                gpuCompute.dispose();
            } catch (e) { }
            geom.dispose();
            mat.dispose();
        };
    }, [modelMesh, geometry, uvsBufferAttr, positionsBuffer, gl, texSize, particleSize, color]);

    // pointer handlers on the invisible mesh
    function handlePointerMove(e: any) {
        // e.point = world coords where the ray hit the (invisible) mesh
        mousePos.current.copy(e.point);
        mouseForce.current = 2.2; // hit impulse
        if (velUniformsRef.current) {
            velUniformsRef.current.uMouse.value.copy(mousePos.current);
            velUniformsRef.current.uMouseForce.value = mouseForce.current;
        }
    }
    function handlePointerEnter() {
        // small boost when entering
        mouseForce.current = Math.max(mouseForce.current, 1.0);
        if (velUniformsRef.current) velUniformsRef.current.uMouseForce.value = mouseForce.current;
    }
    function handlePointerLeave() {
        // let decay
    }

    // main loop
    useFrame((state, delta) => {
        const gpuCompute = gpuRef.current;
        if (!gpuCompute || !posVariableRef.current || !velVariableRef.current) return;

        // update time & decay mouse force
        if (velUniformsRef.current) {
            velUniformsRef.current.uTime.value += delta;
            // decay mouseForce
            mouseForce.current *= Math.exp(-delta * 4.0);
            velUniformsRef.current.uMouseForce.value = mouseForce.current;
            velUniformsRef.current.uMouse.value.copy(mousePos.current);
        }

        // run compute
        gpuCompute.compute();

        // update particles material textures to the current render targets
        if (materialRef.current && posVariableRef.current && velVariableRef.current) {
            materialRef.current.uniforms.uPositionTexture.value = gpuCompute.getCurrentRenderTarget(posVariableRef.current).texture;
            materialRef.current.uniforms.uVelocityTexture.value = gpuCompute.getCurrentRenderTarget(velVariableRef.current).texture;
        }
    });

    // JSX: we render an invisible mesh (for pointer events) and actual Points using the geometry + material created earlier
    // NOTE: we recreate a Points in JSX using the same geometry & shaderMaterial instance (materialRef is set async).
    return (
        <group {...props}>
            {/* invisible mesh for raycast events (same geometry as model) */}
            {modelMesh && (
                <mesh
                    ref={invisibleMeshRef}
                    geometry={modelMesh.geometry}
                    position={modelMesh.position}
                    rotation={modelMesh.rotation}
                    scale={modelMesh.scale}
                    onPointerMove={handlePointerMove}
                    onPointerEnter={handlePointerEnter}
                    onPointerLeave={handlePointerLeave}
                >
                    {/* invisible material just for raycast */}
                    <meshBasicMaterial visible={false} />
                </mesh>
            )}

            {/* Points - geometry & material are created in effect, but we reuse them by reading refs.
          We'll render a placeholder points that will pick up the actual geometry/material by ref in effect above.
      */}
            {/* <primitive object={pointsRef.current || new THREE.Points()} /> */}
            {pointsRef.current && <primitive object={pointsRef.current} />}
        </group>
    );
}
