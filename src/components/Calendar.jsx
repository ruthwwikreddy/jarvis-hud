import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './Calendar.css'

export default function Calendar({ config }) {
    const [currentDate, setCurrentDate] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentDate(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']

    return (
        <motion.div
            className="calendar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="cal-header">STRATEGIC CALENDAR</div>
            <div className="cal-body">
                <div className="cal-main">
                    <div className="cal-day-name">{dayNames[currentDate.getDay()]}</div>
                    <div className="cal-date glow-text">{currentDate.getDate()}</div>
                    <div className="cal-month">{monthNames[currentDate.getMonth()]}</div>
                </div>
                <div className="cal-sidebar">
                    <div className="cal-year">{currentDate.getFullYear()}</div>
                    <div className="cal-week-status">WEEK {config.week}</div>
                </div>
            </div>
            <div className="cal-footer">
                <div className="event-tag">UPCOMING</div>
                <div className="event-desc">{config.nextEvent}</div>
            </div>
        </motion.div>
    )
}



