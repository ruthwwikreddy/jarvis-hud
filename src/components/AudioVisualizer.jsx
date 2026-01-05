import { useState, useEffect, useRef } from 'react'
import './AudioVisualizer.css'

export default function AudioVisualizer({ onAudioLevel, onLabelChange }) {
    const canvasRef = useRef(null)
    const audioContextRef = useRef(null)
    const analyserRef = useRef(null)
    const sourceRef = useRef(null)
    const streamRef = useRef(null)
    const [isLinked, setIsLinked] = useState(false)
    const [sourceName, setSourceName] = useState('OFFLINE')

    const initAudio = async () => {
        // Microphone access removed per user request
        setSourceName('CHROME MEDIA LINK');
        onLabelChange('BROWSER PROCESS');
        setIsLinked(true);

        // Start simulated visualizer data
        drawSimulated();
    }


    useEffect(() => {
        initAudio();
        return () => {
            if (audioContextRef.current) audioContextRef.current.close()
        }
    }, [])


    // startSystemLink is no longer needed as initAudio is called on load
    // const startSystemLink = () => initAudio()



    const drawSimulated = () => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const bufferLength = 64
        const dataArray = new Uint8Array(bufferLength)

        const renderFrame = () => {
            requestAnimationFrame(renderFrame)

            // Create some fake "pulsing" data so it looks active
            const time = Date.now() * 0.002
            for (let i = 0; i < bufferLength; i++) {
                dataArray[i] = 20 + Math.sin(time + i * 0.1) * 15 + Math.random() * 5
            }

            onAudioLevel(0.05 + Math.sin(time) * 0.02)

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const barWidth = (canvas.width / bufferLength) * 2.5
            let x = 0

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i] / 2
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight)
                gradient.addColorStop(0, 'rgba(0, 255, 255, 0.05)')
                gradient.addColorStop(1, 'rgba(0, 255, 255, 0.4)')

                ctx.fillStyle = gradient
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
                x += barWidth + 1
            }
        }
        renderFrame()
    }

    return (
        <div className="audio-vis-container">
            <div className="vis-controls">
                <span className="vis-label">{sourceName}</span>
            </div>
            <canvas ref={canvasRef} width={300} height={40} className="audio-canvas" />
        </div>
    )
}


