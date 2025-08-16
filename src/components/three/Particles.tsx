import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type ParticlesProps = {
    count?: number
}

export function Particles({ count = 800 }: ParticlesProps) {
    const mesh = useRef<THREE.InstancedMesh>(null)
    const dummy = new THREE.Object3D()

    const colors = ["#ffffff", "#f38415", "#e82929", "#ff9072", "#f49311", "#970b0c"]

    const { particles, opacities } = useMemo(() => {
        const particles: {
            x: number
            y: number
            z: number
            speed: number
            offset: number
            color: THREE.Color
        }[] = []
        const opacities: number[] = []

        for (let i = 0; i < count; i++) {
            particles.push({
                x: (Math.random() - 0.5) * 50,
                y: (Math.random() - 0.5) * 50,
                z: (Math.random() - 0.5) * 50,
                speed: 0.001 + Math.random() * 0.002,
                offset: Math.random() * Math.PI * 2,
                color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
            })

            // Random opacity between 0.2 and 0.5
            opacities.push(0.2 + Math.random() * 0.3)
        }

        return { particles, opacities }
    }, [count])

    const geometry = useMemo(() => {
        const geo = new THREE.InstancedBufferGeometry()
        const baseGeo = new THREE.SphereGeometry(0.03, 6, 6)

        geo.index = baseGeo.index
        geo.attributes = baseGeo.attributes

        // instanced attribute opacity
        geo.setAttribute("aOpacity", new THREE.InstancedBufferAttribute(new Float32Array(opacities), 1))

        return geo
    }, [opacities])

    // Shader custom
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: `
        attribute float aOpacity;
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          vOpacity = aOpacity;
          vColor = instanceColor;

          vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
            fragmentShader: `
        varying float vOpacity;
        varying vec3 vColor;

        void main() {
          gl_FragColor = vec4(vColor, vOpacity);
        }
      `,
            transparent: true,
        })
    }, [])

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
        <instancedMesh ref={mesh} args={[geometry, material, count]} />
    )
}
