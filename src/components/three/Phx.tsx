import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { vertex as VERTEX_SHADER } from "./gpgpu/shaders/vertex";
import { fragment as FRAGMENT_SHADER } from "./gpgpu/shaders/fragment";

import GPGPU from "./gpgpu/GPGPU";
import GPGPUEvents from './gpgpu/GPGPUEvents'

import PostProcessing from "./postprocessing/index.js";
import gsap from "gsap";

type PhxProps = {
    rotation?: [number, number, number];
    size?: number;
};

export default function Phx({
    rotation = [Math.PI / 2, 0, 0],
    size = 800,
}: PhxProps) {
    const pointsRef = useRef<THREE.Points | null>(null);
    const gpgpuRef = useRef<any>(null);
    const { camera, gl, scene } = useThree();
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    const is4K = window.innerWidth > 2000;
    const sizeParticle = is4K ? 5.0 : 2.0;

    const { nodes } = useGLTF("/phx_project.glb") as unknown as {
        nodes: { Curve002: THREE.Mesh };
    };

    const mouseRef = useRef(Object.assign(new THREE.EventDispatcher(), {
        cursorPosition: new THREE.Vector2(0, 0),
    }));

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouseRef.current.cursorPosition.set(x, y);

            (mouseRef.current as any).dispatchEvent({
                type: "mousemove",
                ...mouseRef.current.cursorPosition.clone(),
            });
        };

        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    useEffect(() => {
        if (!nodes?.Curve002) return;


        const model = nodes.Curve002;
        const rotatedGeom = model.geometry.clone();
        rotatedGeom.rotateX(Math.PI / 2);
        model.geometry = rotatedGeom;
        model.updateMatrixWorld(true);

        const gpgpu = new (GPGPU as any)({
            size,
            camera,
            renderer: gl,
            // mouse: { cursorPosition: new THREE.Vector2(0, 0) },
            mouse: mouseRef.current,
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
                uParticleSize: { value: sizeParticle },
                // uOpacity: { value: 0 },
            },
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        // gsap.to(material.uniforms.uOpacity, {
        //     value: 1,
        //     duration: 2,
        //     ease: "power2.out",
        //     delay: 0.5
        // });

        const points = new THREE.Points(geometry, material);
        pointsRef.current = points;
        scene.add(points);

        points.rotation.set(Math.PI / 5, 0, 0) // ou une rotation plus exagérée
        points.scale.set(0.5, 0.5, 0.5)

        // anim gsap
        gsap.to(points.rotation, {
            // opacity: 1,
            x: 0,
            y: 0,
            z: 0,
            duration: 2,
            ease: "power2.out",
        })

        gsap.to(points.scale, {
            // opacity: 1,
            x: 1,
            y: 1,
            z: 1,
            duration: 2,
            ease: "power2.out",
        })

        const events = new GPGPUEvents(mouseRef.current, camera, nodes.Curve002, gpgpu.uniforms);
        gpgpu.events = events;

        gpgpuRef.current = gpgpu;

        return () => {
            scene.remove(points);
            geometry.dispose();
            material.dispose();
            gpgpuRef.current = null;
        };
    }, [nodes, camera, gl, scene, size]);


    let lastTime = 0;

    useFrame((state) => {
        const g = gpgpuRef.current;
        if (!g) return;

        const t = state.clock.getElapsedTime();



        const now = state.clock.elapsedTime;
        if (now - lastTime < 1 / 60) return; // 60 FPS max
        lastTime = now;

        g.compute(now);
        // g.compute(t);

        if (g.events) g.events.update();

        const points = pointsRef.current;
        if (points) {
            const mat = points.material as THREE.ShaderMaterial;
            mat.uniforms.uPositionTexture.value = g.gpgpuCompute.getCurrentRenderTarget(g.positionVariable)
                .texture as THREE.Texture;
            mat.uniforms.uVelocityTexture.value = g.gpgpuCompute.getCurrentRenderTarget(g.velocityVariable)
                .texture as THREE.Texture;

            const cursor = mouseRef.current.cursorPosition;
            const targetRotationX = cursor.y * -0.3;   // front/back
            const targetRotationZ = cursor.x * 0.3; // left/right

            // (lerp)
            points.rotation.x += (targetRotationX - points.rotation.x) * 0.1;
            points.rotation.y += (targetRotationZ - points.rotation.y) * 0.1;
        }
    });



    return null;
}

useGLTF.preload("/phx_project.glb");
