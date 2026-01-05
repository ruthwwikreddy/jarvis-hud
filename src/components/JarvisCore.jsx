import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import './JarvisCore.css'

function JarvisOrb({ audioLevel, systemLoad }) {
    const meshRef = useRef()
    const particlesRef = useRef()

    useEffect(() => {
        // Create particle system
        const particleCount = 1000
        const positions = new Float32Array(particleCount * 3)

        for (let i = 0; i < particleCount * 3; i += 3) {
            const radius = 2 + Math.random() * 2
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI

            positions[i] = radius * Math.sin(phi) * Math.cos(theta)
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
            positions[i + 2] = radius * Math.cos(phi)
        }

        if (particlesRef.current) {
            particlesRef.current.geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            )
        }
    }, [])

    useFrame((state) => {
        if (meshRef.current) {
            // Speed varies by system load
            const speedFactor = 1 + (systemLoad / 50); // High load = faster
            meshRef.current.rotation.y += 0.005 * speedFactor
            meshRef.current.rotation.x += 0.002 * speedFactor

            // Pulse based on audio
            const scale = 1 + audioLevel * 0.3
            meshRef.current.scale.set(scale, scale, scale)
        }

        if (particlesRef.current) {
            particlesRef.current.rotation.y -= 0.001
            particlesRef.current.rotation.x += 0.0005
        }
    })

    return (
        <group>
            {/* Main Orb */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1.5, 64, 64]} />
                <meshStandardMaterial
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={0.5 + audioLevel * 0.5}
                    wireframe={true}
                    transparent={true}
                    opacity={0.6}
                />
            </mesh>

            {/* Inner Core */}
            <mesh>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={1 + audioLevel}
                    transparent={true}
                    opacity={0.8}
                />
            </mesh>

            {/* Particle System */}
            <points ref={particlesRef}>
                <bufferGeometry />
                <pointsMaterial
                    color="#00ffff"
                    size={0.05}
                    transparent={true}
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Ambient Light */}
            <pointLight color="#00ffff" intensity={2 + audioLevel * 2} distance={10} />
        </group>
    )
}

export default function JarvisCore({ audioLevel, systemLoad, config }) {
    return (
        <motion.div
            className="jarvis-core"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
        >
            <div className="canvas-container">
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                    <ambientLight intensity={0.2} />
                    <JarvisOrb audioLevel={audioLevel} systemLoad={systemLoad} />
                </Canvas>
            </div>

            <div className="jarvis-ui">
                <div className="jarvis-label glow-text">{config.projectName}</div>

                <div className="jarvis-core-status">
                    <span className="status-label">CORE STATUS</span>
                    <span className={`status-value pulse ${systemLoad > 80 ? 'status-critical' : ''}`}>
                        {systemLoad > 80 ? 'HIGH LOAD' : 'ONLINE'}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

