import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type ParticlesProps = {
    count?: number
}

export function Particles({ count = 1000 }: ParticlesProps) {
    const mesh = useRef<THREE.InstancedMesh>(null)
    const dummy = new THREE.Object3D()

    const colors = ["#ffffff", "#f38415", "#e82929", "#ff9072", "#f49311", "#970b0c"]

    const particles = useMemo(() => {
        const temp: {
            x: number
            y: number
            z: number
            speed: number
            offset: number
            color: THREE.Color
        }[] = []

        for (let i = 0; i < count; i++) {
            temp.push({
                x: (Math.random() - 0.5) * 50,
                y: (Math.random() - 0.5) * 50,
                z: (Math.random() - 0.5) * 50,
                speed: 0.001 + Math.random() * 0.002,
                offset: Math.random() * Math.PI * 2,
                color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
            })
        }
        return temp
    }, [count])

    useFrame(({ clock }) => {
        if (!mesh.current) return
        const t = clock.getElapsedTime()
        particles.forEach((p, i) => {
            dummy.position.set(
                p.x + Math.sin(t * 0.5 + p.offset) * 2,
                p.y + Math.cos(t * 0.3 + p.offset) * 2,
                p.z
            )
            dummy.updateMatrix()
            mesh.current!.setMatrixAt(i, dummy.matrix)
            mesh.current!.setColorAt(i, p.color)
        })
        mesh.current.instanceMatrix.needsUpdate = true
        if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true
    })

    return (
        <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.03, 6, 6]} /> 
            <meshBasicMaterial transparent opacity={0.4} />
        </instancedMesh>
    )
}
