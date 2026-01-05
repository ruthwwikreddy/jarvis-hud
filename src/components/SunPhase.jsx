import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './SunPhase.css'

export default function SunPhase() {
    const [currentPhase, setCurrentPhase] = useState('sun')

    useEffect(() => {
        const updatePhase = () => {
            const hour = new Date().getHours()
            if (hour >= 5 && hour < 11) {
                setCurrentPhase('sunrise')
            } else if (hour >= 11 && hour < 17) {
                setCurrentPhase('sun')
            } else {
                setCurrentPhase('sunset')
            }
        }

        updatePhase()
        const interval = setInterval(updatePhase, 60000) // Update every minute

        return () => clearInterval(interval)
    }, [])

    const phaseEmojis = {
        sunrise: '🌅',
        sun: '☀️',
        sunset: '🌇'
    }

    const phaseLabels = {
        sunrise: 'MORNING',
        sun: 'MIDDAY',
        sunset: 'EVENING'
    }

    return (
        <motion.div
            className="sun-phase"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            <motion.div
                className="sun-icon"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
                <div className="sun-viz">
                    <div className="sun-ring"></div>
                    <div className="sun-center"></div>
                </div>
            </motion.div>
            <div className="sun-info">
                <div className="sun-label glow-text">{phaseLabels[currentPhase]}</div>
                <div className="sun-status">SOLAR PHASE: NOMINAL</div>
            </div>
        </motion.div>
    )
}

