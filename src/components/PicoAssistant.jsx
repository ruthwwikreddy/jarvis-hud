import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { hudData } from '../hudData'
import './PicoAssistant.css'

export default function PicoAssistant() {
    return (
        <motion.div
            className="pico-assistant glass"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="pico-header">
                <div className="pico-title">{hudData.pico.title}</div>
                <div className="pico-version">{hudData.pico.version}</div>
            </div>

            <div className="pico-stats">
                {hudData.pico.stats.map((stat, index) => (
                    <div className="pico-stat" key={index}>
                        <span className={`status-indicator ${stat.status === 'active' ? 'active' : ''}`}></span>
                        {stat.label}: {stat.value}
                    </div>
                ))}
            </div>
            <div className="pico-terminal">
                {hudData.pico.terminal.map((line, index) => (
                    <div className="terminal-line" key={index}>{line}</div>
                ))}
            </div>
        </motion.div>
    )
}



