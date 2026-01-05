import { useState, useEffect } from 'react'
import { TOTP } from 'otpauth'
import './Authenticator.css'

export default function Authenticator({ accounts }) {
    const [codes, setCodes] = useState({})
    const [timeRemaining, setTimeRemaining] = useState(30)
    const [isAddingAccount, setIsAddingAccount] = useState(false)
    const [newAccount, setNewAccount] = useState({ name: '', secret: '' })

    useEffect(() => {
        const generateCodes = () => {
            const newCodes = {}
            accounts.forEach(account => {
                try {
                    const totp = new TOTP({
                        issuer: account.issuer || 'Service',
                        label: account.name,
                        algorithm: 'SHA1',
                        digits: 6,
                        period: 30,
                        secret: account.secret
                    })
                    newCodes[account.name] = totp.generate()
                } catch (error) {
                    console.error(`Error generating code for ${account.name}:`, error)
                    newCodes[account.name] = 'ERROR'
                }
            })
            setCodes(newCodes)
        }

        generateCodes()
        const interval = setInterval(generateCodes, 1000)
        return () => clearInterval(interval)
    }, [accounts])

    useEffect(() => {
        const updateTimer = () => {
            const now = Math.floor(Date.now() / 1000)
            const remaining = 30 - (now % 30)
            setTimeRemaining(remaining)
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)
        return () => clearInterval(interval)
    }, [])

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code)
    }

    const progressPercent = (timeRemaining / 30) * 100

    return (
        <div className="authenticator glass">
            <div className="auth-header">
                <h3>2FA AUTHENTICATOR</h3>
                <div className="auth-timer">
                    <svg className="timer-ring" width="40" height="40">
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke="rgba(0, 150, 255, 0.2)"
                            strokeWidth="3"
                        />
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            fill="none"
                            stroke="#00d4ff"
                            strokeWidth="3"
                            strokeDasharray={`${2 * Math.PI * 16}`}
                            strokeDashoffset={`${2 * Math.PI * 16 * (1 - progressPercent / 100)}`}
                            transform="rotate(-90 20 20)"
                            className="timer-progress"
                        />
                    </svg>
                    <span className="timer-text">{timeRemaining}s</span>
                </div>
            </div>

            <div className="auth-accounts">
                {accounts.length === 0 ? (
                    <div className="no-accounts">
                        <p>NO ACCOUNTS CONFIGURED</p>
                        <p className="hint">Add accounts in hudData.js</p>
                    </div>
                ) : (
                    accounts.map((account, idx) => (
                        <div key={idx} className="auth-account">
                            <div className="account-info">
                                <div className="account-name">{account.name}</div>
                                {account.issuer && (
                                    <div className="account-issuer">{account.issuer}</div>
                                )}
                            </div>
                            <div 
                                className="account-code" 
                                onClick={() => copyToClipboard(codes[account.name])}
                                title="Click to copy"
                            >
                                {codes[account.name] ? (
                                    <>
                                        <span className="code-group">
                                            {codes[account.name].substring(0, 3)}
                                        </span>
                                        <span className="code-separator">·</span>
                                        <span className="code-group">
                                            {codes[account.name].substring(3, 6)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="code-loading">...</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="auth-footer">
                <div className="auth-instructions">
                    <p>🔒 CLICK CODE TO COPY</p>
                    <p>🔄 AUTO-REFRESH: {timeRemaining}s</p>
                </div>
            </div>
        </div>
    )
}
