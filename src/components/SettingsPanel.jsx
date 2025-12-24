import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './SettingsPanel.css'

export default function SettingsPanel({ config, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false)

    // Helper to update nested objects
    const handleChange = (path, value) => {
        const newConfig = { ...config }
        const keys = path.split('.')
        let current = newConfig
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value
        onUpdate(newConfig)
    }

    return (
        <>
            <div className="settings-toggle" onClick={() => setIsOpen(!isOpen)}>
                <span className="toggle-icon">⚙</span>
                <span className="toggle-label">CONFIG</span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="settings-panel glass"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 20 }}
                    >
                        <div className="settings-header">
                            <h3>SYSTEM CONFIGURATION</h3>
                            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                        </div>

                        <div className="settings-content">
                            <div className="settings-section">
                                <label>PROJECT NAME</label>
                                <input
                                    type="text"
                                    value={config.projectName}
                                    onChange={(e) => handleChange('projectName', e.target.value)}
                                />
                            </div>

                            <div className="settings-section">
                                <label>IDENTITY ID</label>
                                <input
                                    type="text"
                                    value={config.identity.id}
                                    onChange={(e) => handleChange('identity.id', e.target.value.toUpperCase())}
                                />
                            </div>

                            <div className="settings-section">
                                <label>SYSTEM VERSION</label>
                                <input
                                    type="text"
                                    value={config.identity.system}
                                    onChange={(e) => handleChange('identity.system', e.target.value.toUpperCase())}
                                />
                            </div>

                            <div className="settings-section">
                                <label>PICO PROJECT TITLE</label>
                                <input
                                    type="text"
                                    value={config.pico.title}
                                    onChange={(e) => handleChange('pico.title', e.target.value.toUpperCase())}
                                />
                            </div>

                            <div className="settings-section">
                                <label>OBJECTIVES TITLE</label>
                                <input
                                    type="text"
                                    value={config.objectives.title}
                                    onChange={(e) => handleChange('objectives.title', e.target.value.toUpperCase())}
                                />
                            </div>

                            <div className="settings-section">
                                <label>MISSION PROGRESS (%)</label>
                                <input
                                    type="number"
                                    value={config.objectives.progress}
                                    onChange={(e) => handleChange('objectives.progress', parseInt(e.target.value))}
                                />
                            </div>

                            <div className="settings-section">
                                <h3>MISSION COLORS</h3>
                                {['DEPLOYING', 'PROTOTYPE', 'DEV', 'TESTING', 'SCALING'].map(status => (
                                    <div key={status} className="input-group">
                                        <label>{status}</label>
                                        <input
                                            type="color"
                                            value={config.objectives.colors[status]}
                                            onChange={(e) => handleChange(`objectives.colors.${status}`, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="settings-footer">
                            <p>NOTE: Changes are session-only.</p>
                            <p>To persist, edit <code>src/hudData.js</code></p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
