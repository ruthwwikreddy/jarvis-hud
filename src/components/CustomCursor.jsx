import { motion } from 'framer-motion'

export default function CustomCursor({ position }) {
    return (
        <motion.div
            className="custom-cursor"
            animate={{
                x: position.x - 10,
                y: position.y - 10
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.5 }}
        >
            <div className="cursor-ring"></div>
            <div className="cursor-crosshair"></div>
        </motion.div>
    )
}

