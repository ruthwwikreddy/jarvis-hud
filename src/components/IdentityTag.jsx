import { motion } from 'framer-motion'
import './IdentityTag.css'

export default function IdentityTag({ config }) {
    const systemInfo = window.electronAPI ? window.electronAPI.getSystemMetrics() : null;

    return (
        <motion.div
            className="identity-tag"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
        >
            <div className="id-main">HUD ID: {config.id}</div>
            <div className="id-sub">
                SYSTEM: {systemInfo ? `${systemInfo.platform.toUpperCase()} [${systemInfo.arch}]` : config.system}
            </div>
        </motion.div>
    )
}
