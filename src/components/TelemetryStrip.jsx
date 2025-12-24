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
        const updateTelemetry = () => {
            if (window.electronAPI) {
                // REAL ELECTRON METRICS
                const metrics = window.electronAPI.getSystemMetrics();
                setTelemetry({
                    cpu: metrics.cpu,
                    ram: metrics.ram,
                    network: navigator.onLine ? 'ONLINE' : 'OFFLINE',
                    temp: 35 + Math.floor(metrics.cpu / 10) // Est temperature based on load
                });
            } else {
                // WEB ESTIMATES (FALLBACK)
                setTelemetry({
                    cpu: Math.floor(Math.random() * 20 + 10),
                    ram: performance.memory ? Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100) : 45,
                    network: navigator.onLine ? 'ONLINE' : 'OFFLINE',
                    temp: 42
                });
            }
        }

        updateTelemetry()
        const interval = setInterval(updateTelemetry, 2500)

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
