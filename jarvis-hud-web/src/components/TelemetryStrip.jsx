import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './TelemetryStrip.css'

export default function TelemetryStrip() {
    const [telemetry, setTelemetry] = useState({
        cpu: 0,
        ram: 0,
        network: 'OK',
        temp: 0
    })

    useEffect(() => {
        // Simulate system telemetry (in production, connect to actual system APIs)
        const updateTelemetry = () => {
            setTelemetry({
                cpu: Math.floor(Math.random() * 40 + 30), // 30-70%
                ram: Math.floor(Math.random() * 30 + 50), // 50-80%
                network: Math.random() > 0.1 ? 'OK' : 'SLOW',
                temp: Math.floor(Math.random() * 15 + 35) // 35-50°C
            })
        }

        updateTelemetry()
        const interval = setInterval(updateTelemetry, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <motion.div
            className="telemetry-strip"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
        >
            <div className="telemetry-item">
                <span className="telemetry-label">CPU</span>
                <span className="telemetry-value">{telemetry.cpu}%</span>
            </div>
            <div className="telemetry-divider">|</div>
            <div className="telemetry-item">
                <span className="telemetry-label">RAM</span>
                <span className="telemetry-value">{telemetry.ram}%</span>
            </div>
            <div className="telemetry-divider">|</div>
            <div className="telemetry-item">
                <span className="telemetry-label">NET</span>
                <span className={`telemetry-value ${telemetry.network === 'OK' ? 'status-ok' : 'status-warn'}`}>
                    {telemetry.network}
                </span>
            </div>
            <div className="telemetry-divider">|</div>
            <div className="telemetry-item">
                <span className="telemetry-label">TEMP</span>
                <span className="telemetry-value">{telemetry.temp}°C</span>
            </div>
        </motion.div>
    )
}
