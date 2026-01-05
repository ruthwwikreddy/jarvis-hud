import { motion, AnimatePresence } from 'framer-motion'
import './AlertChannel.css'

export default function AlertChannel({ config }) {
    const alerts = config.list;
    const title = config.title;



    return (
        <motion.div
            className="alert-channel"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
        >
            <div className="alert-header">{title}</div>

            <div className="alert-list">
                <AnimatePresence>
                    {alerts.length === 0 ? (
                        <motion.div
                            key="no-alerts"
                            className="alert-item alert-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            • NONE
                        </motion.div>
                    ) : (
                        alerts.map(alert => (
                            <motion.div
                                key={alert.id}
                                className={`alert-item alert-${alert.type}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                {alert.type === 'warning' && '⚠ '}
                                {alert.type === 'error' && '⛔ '}
                                {alert.message}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
