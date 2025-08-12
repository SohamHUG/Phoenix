import React, { useRef, useEffect, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function Phx({ rotation = [Math.PI / 2, 0, 0], ...props }) {
    const ref = useRef<THREE.Mesh>(null)
    const { nodes } = useGLTF("/phx_project.glb")

    const [mouse, setMouse] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const x = (event.clientX / window.innerWidth) * 2 - 1
            const y = (event.clientY / window.innerHeight) * 2 - 1
            setMouse({ x, y })
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.x = THREE.MathUtils.lerp(
                ref.current.rotation.x,
                rotation[0] + mouse.y * 0.3,
                0.1
            )

            ref.current.rotation.z = THREE.MathUtils.lerp(
                ref.current.rotation.z,
                mouse.x * -0.3,
                0.1
            )
        }
    })

    if (!nodes?.Curve002) return null

    return (
        <group {...props}>
            <mesh
                ref={ref}
                geometry={nodes.Curve002.geometry}
                scale={1.4}
                castShadow
                receiveShadow
            >
                <meshPhysicalMaterial
                    color="#ffffff"
                    metalness={0.9}
                    roughness={0.2}
                    clearcoat={10}
                    clearcoatRoughness={0.1}
                    envMapIntensity={2}
                    iridescence={1}
                    iridescenceIOR={1.3}
                    iridescenceThicknessRange={[100, 1400]}
                    side={2}
                />
            </mesh>
        </group>
    )
}

useGLTF.preload("/phx_project.glb")
