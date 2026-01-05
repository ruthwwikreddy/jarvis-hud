import { useState } from 'react'
import { motion } from 'framer-motion'
import './UnitConverter.css'

const units = {
    length: {
        meters: 1,
        kilometers: 0.001,
        miles: 0.000621371,
        feet: 3.28084
    },
    weight: {
        kilograms: 1,
        grams: 1000,
        pounds: 2.20462,
        ounces: 35.274
    },
    temp: {
        celsius: 'C',
        fahrenheit: 'F',
        kelvin: 'K'
    }
}

export default function UnitConverter() {
    const [category, setCategory] = useState('length')
    const [value, setValue] = useState(1)
    const [fromUnit, setFromUnit] = useState('meters')
    const [toUnit, setToUnit] = useState('kilometers')

    const convert = () => {
        if (category === 'temp') {
            let celsius = value
            if (fromUnit === 'fahrenheit') celsius = (value - 32) * 5 / 9
            if (fromUnit === 'kelvin') celsius = value - 273.15

            if (toUnit === 'fahrenheit') return (celsius * 9 / 5 + 32).toFixed(2)
            if (toUnit === 'kelvin') return (celsius + 273.15).toFixed(2)
            return celsius.toFixed(2)
        }

        const inBase = value / units[category][fromUnit]
        const result = inBase * units[category][toUnit]
        return result.toFixed(4)
    }

    return (
        <motion.div
            className="unit-converter"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <div className="uc-header">UNIT CONVERTER</div>
            <div className="uc-tabs">
                {Object.keys(units).map(cat => (
                    <button
                        key={cat}
                        className={category === cat ? 'active' : ''}
                        onClick={() => {
                            setCategory(cat)
                            setFromUnit(Object.keys(units[cat])[0])
                            setToUnit(Object.keys(units[cat])[1])
                        }}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="uc-body">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="uc-input"
                />
                <div className="uc-selects">
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                        {Object.keys(units[category]).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <span className="arrow">→</span>
                    <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                        {Object.keys(units[category]).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
                <div className="uc-result">
                    <span className="res-val">{convert()}</span>
                    <span className="res-unit">{toUnit}</span>
                </div>
            </div>
        </motion.div>
    )
}
