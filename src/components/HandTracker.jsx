import { useEffect, useRef } from 'react'

export default function HandTracker({ onHandPosition, onGesture }) {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const lastGestureRef = useRef(null)
    const lastGestureTimeRef = useRef(0)

    useEffect(() => {
        if (!window.Hands || !window.Camera) {
            console.warn('Waiting for MediaPipe to load...');
            return;
        }

        const hands = new window.Hands({

            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        })

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
        })

        hands.onResults(onResults)

        if (videoRef.current) {
            const camera = new window.Camera(videoRef.current, {
                onFrame: async () => {

                    await hands.send({ image: videoRef.current })
                },
                width: 640,
                height: 480
            })
            camera.start()
        }

        return () => {
            hands.close()
        }
    }, [])

    const onResults = (results) => {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            onHandPosition(null)
            return
        }

        const landmarks = results.multiHandLandmarks[0]
        const width = window.innerWidth
        const height = window.innerHeight

        // Index finger tip (ID 8)
        const indexTip = landmarks[8]
        const screenX = (1 - indexTip.x) * width
        const screenY = indexTip.y * height

        onHandPosition({ x: screenX, y: screenY })

        // Gesture Detection
        detectGesture(landmarks, screenX, screenY)
    }

    const detectGesture = (landmarks, x, y) => {
        const now = Date.now()
        if (now - lastGestureTimeRef.current < 300) return // Cooldown

        // Pinch Detection (Thumb 4 + Index 8)
        const thumbTip = landmarks[4]
        const indexTip = landmarks[8]
        const distance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y)

        // Fist Detection (Tips below PIP joints)
        const isFist =
            landmarks[8].y > landmarks[6].y &&
            landmarks[12].y > landmarks[10].y &&
            landmarks[16].y > landmarks[14].y &&
            landmarks[20].y > landmarks[18].y

        let currentGesture = null
        let element = null

        // Determine which element is under the cursor
        const elements = ['jarvis', 'pico', 'calendar', 'todo', 'sun', 'clock']
        // Simple hit testing based on known areas or center points would go here
        // For now, we return specific gestures based on hand state

        // Check if hovering over an element (simplified logic, ideally check rects)
        // We'll trust the parent to handle the "which element" part if we pass coordinates,
        // or we can detect "close enough" here. For now, we emulate "Grab" logic globally.

        if (isFist) {
            currentGesture = { type: 'move', position: { x, y } }
            // In a real app, you'd check which element bounds (x,y) is inside
            const el = getElementAt(x, y)
            if (el) currentGesture.element = el
        } else if (distance < 0.05) {
            currentGesture = { type: 'zoom', scale: distance * 10 } // Simplified
            const el = getElementAt(x, y)
            if (el) currentGesture.element = el
        }

        if (currentGesture) {
            onGesture(currentGesture)
            lastGestureRef.current = currentGesture
            lastGestureTimeRef.current = now
        }
    }

    // Helper to find element at position (simplified hardcoded regions for demo)
    const getElementAt = (x, y) => {
        // This would ideally access the bounds from the parent state, 
        // but for this self-contained demo we can estimate or use window elements
        const el = document.elementFromPoint(x, y)
        if (el) {
            const draggable = el.closest('.draggable')
            if (draggable) {
                // Map class to ID
                if (draggable.classList.contains('jarvis-core')) return 'jarvis'
                if (draggable.classList.contains('calendar')) return 'calendar'
                if (draggable.classList.contains('objectives-list')) return 'todo'
                if (draggable.classList.contains('sun-phase')) return 'sun'
                if (draggable.classList.contains('pico-assistant')) return 'pico'
                return null
            }
        }
        return null
    }

    return (
        <div className="hand-tracker-debug" style={{ position: 'fixed', top: 0, left: 0, opacity: 0, pointerEvents: 'none' }}>
            <video ref={videoRef} style={{ width: 640, height: 480 }} />
            <canvas ref={canvasRef} style={{ width: 640, height: 480 }} />
        </div>
    )
}
