import { motion } from 'framer-motion'
import './SpotifyTrack.css'

export default function SpotifyTrack({ activeLabel }) {
    return (
        <motion.div
            className="spotify-track"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="track-icon">
                <span className="sc-icon">📡</span>
            </div>
            <div className="track-info">
                <div className="track-label">SYSTEM AUDIO LINK</div>
                <div className="track-title-scroll">
                    <span className="track-text">
                        {activeLabel || 'AWAITING CONNECTION...'}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}


