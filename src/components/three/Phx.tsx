import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { vertex as VERTEX_SHADER } from "./gpgpu/shaders/vertex";
import { fragment as FRAGMENT_SHADER } from "./gpgpu/shaders/fragment";

import GPGPU from "./gpgpu/GPGPU";

import PostProcessing from "./postprocessing/index.js";

type PhxProps = {
    rotation?: [number, number, number];
    size?: number;
};

export default function Phx({
    rotation = [Math.PI / 2, 0, 0],
    size = 1100,
}: PhxProps) {
    const pointsRef = useRef<THREE.Points | null>(null);
    const gpgpuRef = useRef<any>(null);
    const { camera, gl, scene } = useThree();
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    const { nodes } = useGLTF("/phx_project.glb") as unknown as {
        nodes: { Curve002: THREE.Mesh };
    };

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;
            setMouse({ x, y });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    useEffect(() => {
        if (!nodes?.Curve002) return;

        const gpgpu = new (GPGPU as any)({
            size,
            camera,
            renderer: gl,
            mouse: { cursorPosition: new THREE.Vector2(0, 0) },
            scene,
            model: nodes.Curve002,
            sizes: { width: size, height: size },
        });

        const positions = (gpgpu.utils?.getPositions?.() ?? new Float32Array()) as Float32Array;
        const uvs = (gpgpu.utils?.getUVs?.() ?? new Float32Array()) as Float32Array;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

        const posRT = (gpgpu.gpgpuCompute?.getCurrentRenderTarget(gpgpu.positionVariable)?.texture ??
            new THREE.Texture()) as THREE.Texture;
        const velRT = (gpgpu.gpgpuCompute?.getCurrentRenderTarget(gpgpu.velocityVariable)?.texture ??
            new THREE.Texture()) as THREE.Texture;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uPositionTexture: { value: posRT },
                uVelocityTexture: { value: velRT },
                uResolution: { value: new THREE.Vector2(size, size) },
                uParticleSize: { value: 2.0 },
            },
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        const points = new THREE.Points(geometry, material);
        pointsRef.current = points;
        scene.add(points);

        gpgpuRef.current = gpgpu;

        return () => {
            scene.remove(points);
            geometry.dispose();
            material.dispose();
            gpgpuRef.current = null;
        };
    }, [nodes, camera, gl, scene, size]);

    useFrame((state) => {
        const g = gpgpuRef.current;
        if (!g) return;

        const t = state.clock.getElapsedTime();

        if (g.uniforms?.velocityUniforms) {
            const mouseVec = (g.uniforms.velocityUniforms.uMouse?.value ??
                new THREE.Vector2()) as THREE.Vector2;
            mouseVec.set(mouse.x, mouse.y);
            g.uniforms.velocityUniforms.uTime.value = t;
        }

        g.compute();

        const points = pointsRef.current;
        if (points) {
            const mat = points.material as THREE.ShaderMaterial;
            mat.uniforms.uPositionTexture.value = g.gpgpuCompute.getCurrentRenderTarget(g.positionVariable)
                .texture as THREE.Texture;
            mat.uniforms.uVelocityTexture.value = g.gpgpuCompute.getCurrentRenderTarget(g.velocityVariable)
                .texture as THREE.Texture;

            points.rotation.x = THREE.MathUtils.lerp(
                points.rotation.x,
                rotation[0] + mouse.y * 0.3,
                0.1
            );
            points.rotation.z = THREE.MathUtils.lerp(points.rotation.z, mouse.x * -0.3, 0.1);
        }
    });

    return null;
}

useGLTF.preload("/phx_project.glb");
