import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'

function Particles() {
    const count = 2000
    const mesh = useRef()
    const dummy = useRef(new THREE.Object3D())
    const particles = useRef(new Float32Array(count * 3))
    const speeds = useRef(new Float32Array(count))

    useEffect(() => {
        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            particles.current[i3] = (Math.random() - 0.5) * 20
            particles.current[i3 + 1] = (Math.random() - 0.5) * 20
            particles.current[i3 + 2] = (Math.random() - 0.5) * 20
            speeds.current[i] = Math.random() * 0.02
        }
    }, [])

    useFrame((state) => {
        if (!mesh.current) return

        for (let i = 0; i < count; i++) {
            const i3 = i * 3
            particles.current[i3 + 2] += speeds.current[i]
            if (particles.current[i3 + 2] > 10) {
                particles.current[i3 + 2] = -10
            }

            dummy.current.position.set(
                particles.current[i3],
                particles.current[i3 + 1],
                particles.current[i3 + 2]
            )
            dummy.current.updateMatrix()
            mesh.current.setMatrixAt(i, dummy.current.matrix)
        }
        mesh.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <sphereGeometry args={[0.01, 16, 16]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.4} />
        </instancedMesh>
    )
}

export default function ParticleField() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Particles />
            </Canvas>
        </div>
    )
}
