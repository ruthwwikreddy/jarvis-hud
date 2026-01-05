import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import JarvisCore from './components/JarvisCore'
import Clock from './components/Clock'
import Calendar from './components/Calendar'
import TodoList from './components/TodoList'
import SunPhase from './components/SunPhase'
import AudioVisualizer from './components/AudioVisualizer'
import SpotifyTrack from './components/SpotifyTrack'
import PicoAssistant from './components/PicoAssistant'
import PomodoroTimer from './components/PomodoroTimer'
import UnitConverter from './components/UnitConverter'
import Calculator from './components/Calculator'
import CustomCursor from './components/CustomCursor'
import ParticleField from './components/ParticleField'
import TelemetryStrip from './components/TelemetryStrip'
import AlertChannel from './components/AlertChannel'
import ModeIndicator from './components/ModeIndicator'
import IdentityTag from './components/IdentityTag'
import ChatInterface from './components/ChatInterface'
import Authenticator from './components/Authenticator'
import { hudData as initialData } from './hudData'


function App() {
    const [config, setConfig] = useState(initialData)
    const [audioLevel, setAudioLevel] = useState(0)
    const [audioLabel, setAudioLabel] = useState('')
    const [isFullscreen, setIsFullscreen] = useState(false)

    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    const [systemLoad, setSystemLoad] = useState(0)

    // Auto-update System Metrics from real Computer APIs
    useEffect(() => {
        const updateMetrics = async () => {
            // Use functional update to ensure we always get the latest config state
            setConfig(prevConfig => {
                const newConfig = { ...prevConfig }
                const newAlerts = []

                try {
                    // 0. System Metrics (Electron)
                    if (window.electronAPI) {
                        const metrics = window.electronAPI.getSystemMetrics();
                        setSystemLoad(metrics.cpu);
                    } else {
                        setSystemLoad(Math.floor(Math.random() * 20 + 10));
                    }

                    // 1. Battery Status
                    if ('getBattery' in navigator) {
                        navigator.getBattery().then(battery => {
                            if (battery.level < 0.2) {
                                newAlerts.push({ id: Date.now() + 1, type: 'error', message: `CRITICAL BATTERY: ${Math.round(battery.level * 100)}%` })
                            } else if (battery.charging) {
                                newAlerts.push({ id: Date.now() + 2, type: 'info', message: 'POWER SOURCE DETECTED' })
                            }
                            // Update alerts after async battery check
                            newConfig.alerts.list = newAlerts
                            setConfig(newConfig)
                        }).catch(err => console.error("Battery API access failed:", err));
                    }

                    // 2. Network Status
                    if (navigator.connection) {
                        const conn = navigator.connection
                        if (conn.saveData) {
                            newAlerts.push({ id: Date.now() + 3, type: 'warning', message: 'DATA SAVER ACTIVE' })
                        }
                        if (conn.effectiveType === '2g' || conn.effectiveType === '3g') {
                            newAlerts.push({ id: Date.now() + 4, type: 'warning', message: `SLOW NETWORK: ${conn.effectiveType.toUpperCase()}` })
                        }
                    }

                    // 3. Storage Analysis
                    if (navigator.storage && navigator.storage.estimate) {
                        navigator.storage.estimate().then(({ usage, quota }) => {
                            const percentUsed = Math.round((usage / quota) * 100)
                            if (percentUsed > 80) {
                                newAlerts.push({ id: Date.now() + 5, type: 'warning', message: `STORAGE NEAR CAPACITY: ${percentUsed}%` })
                            }

                            // Update alerts after async storage check
                            newConfig.alerts.list = newAlerts
                            setConfig(newConfig)
                        }).catch(err => console.error("Storage API access failed:", err));
                    }

                    // 4. Memory Warning (Experimental Chrome/Edge)
                    if (performance.memory) {
                        const mem = performance.memory
                        const memLimit = mem.jsHeapSizeLimit
                        const memUsed = mem.usedJSHeapSize
                        if (memUsed / memLimit > 0.8) {
                            newAlerts.push({ id: Date.now() + 6, type: 'error', message: 'HIGH MEMORY LOAD' })
                        }
                    }

                    // Update the alerts list with real findings (for sync checks)
                    newConfig.alerts.list = newAlerts
                    return newConfig;

                } catch (err) {
                    console.error("Telemetry access failed:", err)
                    return prevConfig; // Return previous config on error
                }
            })
        }

        updateMetrics()
        const interval = setInterval(updateMetrics, 5000)
        return () => clearInterval(interval)
    }, []) // Removed config.projectName from dependencies to avoid re-running interval on config change


    useEffect(() => {
        const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY })
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.error)
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    // Handle keypresses
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === 'f') toggleFullscreen()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const [activeApp, setActiveApp] = useState(null)

    const toggleApp = (appId) => {
        setActiveApp(prev => prev === appId ? null : appId)
    }

    return (
        <div className="app">
            {/* 1. LAYER: BACKGROUND */}
            <div className="grid-background" />
            <ParticleField />
            <div className="scanlines" />
            <div className="vignette" />

            {/* 2. LAYER: SYSTEM GRID LAYOUT */}
            <div className="hud-layout-grid">

                <div className="top-center">
                    <Clock />
                    <ModeIndicator config={config.identity} />
                </div>

                <div className="lateral-columns">
                    {/* LEFT PILLAR: Primary Status */}
                    <div className="left-pillar">
                        <div className="hud-group">
                            <IdentityTag config={config.identity} />
                            <PicoAssistant config={config.pico} />
                        </div>

                        <div className="hud-group">
                            <TodoList config={config.objectives} />
                        </div>

                        {/* Slide-out App Slot Left */}
                        <AnimatePresence>
                            {activeApp === 'POMO' && (
                                <motion.div
                                    className="hud-group floating-app"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                >
                                    <PomodoroTimer />
                                </motion.div>
                            )}
                            {activeApp === 'MEDIA' && (
                                <motion.div
                                    className="hud-group floating-app"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                >
                                    <SpotifyTrack activeLabel={audioLabel} token={config.spotify.token} />
                                    <AudioVisualizer
                                        onAudioLevel={setAudioLevel}
                                        onLabelChange={setAudioLabel}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT PILLAR: Secondary Status */}
                    <div className="right-pillar">
                        <div className="hud-group">
                            <SunPhase />
                            <AlertChannel config={config.alerts} />
                        </div>

                        <div className="hud-group">
                            <Calendar config={config.calendar} />
                        </div>

                        {/* Slide-out App Slot Right */}
                        <AnimatePresence>
                            {activeApp === 'AUTH' && (
                                <motion.div
                                    className="hud-group floating-app"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                >
                                    <Authenticator accounts={config.authenticator.accounts} />
                                </motion.div>
                            )}
                            {activeApp === 'CALC' && (
                                <motion.div
                                    className="hud-group floating-app"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                >
                                    <Calculator />
                                </motion.div>
                            )}
                            {activeApp === 'UNIT' && (
                                <motion.div
                                    className="hud-group floating-app"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                >
                                    <UnitConverter />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* BOTTOM DOCK */}
                <div className="bottom-bar">
                    <div className="system-dock">
                        <button className={`dock-item ${activeApp === 'POMO' ? 'active' : ''}`} onClick={() => toggleApp('POMO')} title="TIMER">⏱</button>
                        <button className={`dock-item ${activeApp === 'MEDIA' ? 'active' : ''}`} onClick={() => toggleApp('MEDIA')} title="MEDIA">🎵</button>
                        <div className="dock-separator" />
                        <TelemetryStrip />
                        <div className="dock-separator" />
                        <button className={`dock-item ${activeApp === 'AUTH' ? 'active' : ''}`} onClick={() => toggleApp('AUTH')} title="AUTH">🔑</button>
                        <button className={`dock-item ${activeApp === 'CALC' ? 'active' : ''}`} onClick={() => toggleApp('CALC')} title="CALC">🧮</button>
                        <button className={`dock-item ${activeApp === 'UNIT' ? 'active' : ''}`} onClick={() => toggleApp('UNIT')} title="UNIT">📏</button>
                    </div>
                </div>
            </div>

            {/* CENTRAL CORE */}
            <div className="center-core">
                <JarvisCore
                    audioLevel={audioLevel}
                    systemLoad={systemLoad}
                    config={{ projectName: config.projectName }}
                />
            </div>

            {/* 3. LAYER: UI FEEDBACK & CHAT */}
            <ChatInterface apiKey={config.openai.apiKey} />
            <CustomCursor position={cursorPos} />
        </div>
    )
}




export default App
