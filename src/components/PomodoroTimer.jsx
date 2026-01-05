import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './PomodoroTimer.css'

export default function PomodoroTimer() {
    const [minutes, setMinutes] = useState(25)
    const [seconds, setSeconds] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [isBreak, setIsBreak] = useState(false)

    useEffect(() => {
        let interval = null
        if (isActive) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(seconds - 1)
                } else if (minutes > 0) {
                    setMinutes(minutes - 1)
                    setSeconds(59)
                } else {
                    // Timer finished
                    setIsActive(false)
                    setIsBreak(!isBreak)
                    setMinutes(isBreak ? 25 : 5)
                    setSeconds(0)
                    new Audio('https://assets.mixkit.com/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3').play().catch(() => {})
                }
            }, 1000)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [isActive, minutes, seconds, isBreak])

    const toggleTimer = () => setIsActive(!isActive)
    
    const resetTimer = () => {
        setIsActive(false)
        setIsBreak(false)
        setMinutes(25)
        setSeconds(0)
    }

    return (
        <motion.div 
            className="pomodoro-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="pomo-header">
                <span className="pomo-title">{isBreak ? 'BREAK MODE' : 'FOCUS PHASE'}</span>
                <div className={`pomo-status ${isActive ? 'active' : ''}`} />
            </div>
            
            <div className="pomo-display">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div className="pomo-controls">
                <button onClick={toggleTimer} className="pomo-btn main">
                    {isActive ? 'PAUSE' : 'START'}
                </button>
                <button onClick={resetTimer} className="pomo-btn">RESET</button>
            </div>
        </motion.div>
    )
}
