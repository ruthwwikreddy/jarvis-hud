import { useState } from 'react'
import { motion } from 'framer-motion'
import './Calculator.css'

export default function Calculator() {
    const [display, setDisplay] = useState('0')
    const [equation, setEquation] = useState('')

    const handleNumber = (n) => {
        if (display === '0') {
            setDisplay(n)
        } else {
            setDisplay(display + n)
        }
    }

    const handleOperator = (op) => {
        setEquation(display + ' ' + op + ' ')
        setDisplay('0')
    }

    const calculate = () => {
        try {
            const result = eval(equation + display)
            setDisplay(String(result))
            setEquation('')
        } catch (e) {
            setDisplay('ERROR')
        }
    }

    const clear = () => {
        setDisplay('0')
        setEquation('')
    }

    return (
        <motion.div
            className="calculator-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="calc-header">TACTICAL CALCULATOR</div>
            <div className="calc-screen">
                <div className="calc-equation">{equation}</div>
                <div className="calc-display">{display}</div>
            </div>
            <div className="calc-grid">
                <button onClick={clear} className="calc-btn clear">AC</button>
                <button onClick={() => handleOperator('/')} className="calc-btn op">/</button>
                <button onClick={() => handleOperator('*')} className="calc-btn op">×</button>

                <button onClick={() => handleNumber('7')} className="calc-btn">7</button>
                <button onClick={() => handleNumber('8')} className="calc-btn">8</button>
                <button onClick={() => handleNumber('9')} className="calc-btn">9</button>
                <button onClick={() => handleOperator('-')} className="calc-btn op">-</button>

                <button onClick={() => handleNumber('4')} className="calc-btn">4</button>
                <button onClick={() => handleNumber('5')} className="calc-btn">5</button>
                <button onClick={() => handleNumber('6')} className="calc-btn">6</button>
                <button onClick={() => handleOperator('+')} className="calc-btn op">+</button>

                <button onClick={() => handleNumber('1')} className="calc-btn">1</button>
                <button onClick={() => handleNumber('2')} className="calc-btn">2</button>
                <button onClick={() => handleNumber('3')} className="calc-btn">3</button>
                <button onClick={calculate} className="calc-btn equal">=</button>

                <button onClick={() => handleNumber('0')} className="calc-btn zero">0</button>
                <button onClick={() => handleNumber('.')} className="calc-btn">.</button>
            </div>
        </motion.div>
    )
}
