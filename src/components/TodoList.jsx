import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './TodoList.css'

export default function TodoList({ config }) {
    const objectives = config.list;
    const title = config.title;
    const progress = config.progress;



    const getStatusColor = (status) => {
        const colors = config.colors || {};
        if (status.includes('DEPLOY')) return colors.DEPLOYING || '#ffffffff';
        if (status.includes('PROTOTYPE')) return colors.PROTOTYPE || '#ffffffff';
        if (status.includes('DEV')) return colors.DEV || '#ffffffff';
        if (status.includes('TEST')) return colors.TESTING || '#ffffffff';
        if (status.includes('SCALING')) return colors.SCALING || '#ffffffff';
        return '#cccccc';
    }



    return (
        <motion.div
            className="objectives-list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="obj-header">{title}</div>
            <div className="obj-items">
                {objectives.map((obj, index) => (
                    <motion.div
                        key={index}
                        className="obj-item"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="obj-indicator" style={{ background: getStatusColor(obj.status) }}></div>
                        <span className="obj-label">{obj.label}</span>
                        <span className="obj-status" style={{ color: getStatusColor(obj.status) }}>
                            {obj.status}
                        </span>
                    </motion.div>
                ))}
            </div>
            <div className="obj-footer">
                TOTAL PROGRESS: {progress}%
            </div>

        </motion.div>
    )
}

