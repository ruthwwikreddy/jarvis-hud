import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './App.css'
import JarvisCore from './components/JarvisCore'
import Clock from './components/Clock'
import Calendar from './components/Calendar'
import TodoList from './components/TodoList'
import SunPhase from './components/SunPhase'
import AudioVisualizer from './components/AudioVisualizer'
import SpotifyTrack from './components/SpotifyTrack'
import PicoAssistant from './components/PicoAssistant'
import CustomCursor from './components/CustomCursor'
import ParticleField from './components/ParticleField'
import TelemetryStrip from './components/TelemetryStrip'
import AlertChannel from './components/AlertChannel'
import ModeIndicator from './components/ModeIndicator'
import IdentityTag from './components/IdentityTag'
import SettingsPanel from './components/SettingsPanel'
import { hudData as initialData } from './hudData'


function App() {
    const [config, setConfig] = useState(initialData)
    const [audioLevel, setAudioLevel] = useState(0)
    const [audioLabel, setAudioLabel] = useState('')
    const [isFullscreen, setIsFullscreen] = useState(false)

    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

    // Auto-update System Metrics from real Computer APIs
    useEffect(() => {
        const updateMetrics = async () => {
            // Use functional update to ensure we always get the latest config state
            setConfig(prevConfig => {
                const newConfig = { ...prevConfig }
                const newAlerts = []

                try {
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
                            newConfig.objectives.progress = percentUsed // Use storage % as mission progress link
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

    return (
        <div className="app">
            {/* 1. LAYER: BACKGROUND */}
            <div className="grid-background" />
            <ParticleField />
            <div className="scanlines" />
            <div className="vignette" />

            {/* 2. LAYER: SYSTEM GRID LAYOUT */}
            <div className="hud-layout-grid">
                <div className="top-left">
                    <IdentityTag config={config.identity} />
                    <SunPhase />
                </div>

                <div className="top-center">
                    <Clock />
                    <ModeIndicator config={config.identity} />
                </div>

                <div className="top-right">
                    <AlertChannel config={config.alerts} />
                    <Calendar config={config.calendar} />
                </div>

                <div className="mid-left">
                    <TodoList config={config.objectives} />
                </div>

                <div className="center">
                    <JarvisCore audioLevel={audioLevel} config={{ projectName: config.projectName }} />
                </div>

                <div className="mid-right">
                    {/* Future components path: mid-right */}
                </div>

                <div className="bottom-left">
                    <SpotifyTrack activeLabel={audioLabel} />
                    <AudioVisualizer
                        onAudioLevel={setAudioLevel}
                        onLabelChange={setAudioLabel}
                    />
                </div>


                <div className="bottom-center">
                    <TelemetryStrip />
                </div>

                <div className="bottom-right">
                    <PicoAssistant config={config.pico} />
                    <div className="instructions-container">
                        <div className="instructions">
                            <p>[F] FULLSCREEN</p>
                            <p>SYSTEM LOCKED</p>
                            <p>HUD V2.0 ACTIVE</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. LAYER: UI FEEDBACK & SETTINGS */}
            <SettingsPanel config={config} onUpdate={setConfig} />
            <CustomCursor position={cursorPos} />
        </div>
    )
}




export default App
