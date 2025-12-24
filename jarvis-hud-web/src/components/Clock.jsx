import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './Clock.css'

export default function Clock() {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })
    }

    return (
        <motion.div
            className="clock"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="clock-label">SYSTEM TIME</div>
            <div className="clock-time glow-text">{formatTime(time)}</div>
            <div className="clock-status">
                <span className="status-indicator active"></span>
                SYNC: ACTIVE
            </div>
        </motion.div>
    )
}


