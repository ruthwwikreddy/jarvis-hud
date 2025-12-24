import { motion } from 'framer-motion'
import './ModeIndicator.css'

export default function ModeIndicator({ config }) {
    return (
        <motion.div
            className="mode-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
        >
            MODE: <span className="mode-value">{config.mode}</span>
        </motion.div>
    )
}


