import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OpenAI from 'openai'
import './ChatInterface.css'

export default function ChatInterface({ apiKey }) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('jarvis_chat_history')
        return saved ? JSON.parse(saved) : []
    })
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [ttsEnabled, setTtsEnabled] = useState(true)
    const [persona, setPersona] = useState('concise') // concise, detailed, sarcastic

    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)
    const recognitionRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
        localStorage.setItem('jarvis_chat_history', JSON.stringify(messages))
    }, [messages])

    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus()
        }
    }, [isOpen, isMinimized])

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript
                setInput(transcript)
                setIsListening(false)
            }

            recognitionRef.current.onerror = () => setIsListening(false)
            recognitionRef.current.onend = () => setIsListening(false)
        }
    }, [])

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setIsListening(true)
            recognitionRef.current.start()
        } else if (isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        }
    }

    const speak = (text) => {
        if (!ttsEnabled) return
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 1.1
        utterance.pitch = 0.9
        window.speechSynthesis.speak(utterance)
    }

    const getSystemPrompt = () => {
        const base = "You are JARVIS, an advanced AI assistant inspired by Iron Man's AI. Format code blocks with proper syntax highlighting using markdown."
        if (persona === 'sarcastic') return base + " Be witty, slightly arrogant, and use a lot of dry humor."
        if (persona === 'detailed') return base + " Provide very detailed, technical explanations and thorough analysis."
        return base + " Be concise, intelligent, and efficient."
    }

    const sendMessage = async () => {
        if (!input.trim() || !apiKey) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const openai = new OpenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true
            })

            const response = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: getSystemPrompt() },
                    ...messages,
                    userMessage
                ],
                stream: true,
                temperature: 0.7,
            })

            let assistantMessage = { role: 'assistant', content: '' }
            setMessages(prev => [...prev, assistantMessage])

            let fullResponse = ''
            for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content || ''
                if (content) {
                    fullResponse += content
                    setMessages(prev => {
                        const newMessages = [...prev]
                        newMessages[newMessages.length - 1] = { ...assistantMessage, content: fullResponse }
                        return newMessages
                    })
                }
            }

            if (ttsEnabled) speak(fullResponse)

        } catch (error) {
            console.error('OpenAI API Error:', error)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'ERROR: ' + (error.message || 'Failed to connect to OpenAI')
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const clearChat = () => {
        if (confirm('Clear all chat history?')) {
            setMessages([])
            localStorage.removeItem('jarvis_chat_history')
        }
    }

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized)
    }

    const formatMessage = (content) => {
        const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g)
        return parts.map((part, idx) => {
            if (part.startsWith('```')) {
                const code = part.replace(/```\w*\n?|```/g, '')
                return <pre key={idx} className="code-block"><code>{code}</code></pre>
            } else if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={idx} className="inline-code">{part.slice(1, -1)}</code>
            }
            return <span key={idx}>{part}</span>
        })
    }

    return (
        <>
            <motion.div
                className="chat-toggle"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="status-dot" />
                <span>JARVIS AI</span>
            </motion.div>


            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`chat-interface ${isMinimized ? 'minimized' : ''}`}
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="chat-header">
                            <div className="header-left">
                                <div className={`status-indicator ${isLoading ? 'typing' : 'online'}`} />
                                <h3>J.A.R.V.I.S</h3>
                            </div>
                            <div className="chat-controls">
                                <select
                                    className="persona-select"
                                    value={persona}
                                    onChange={(e) => setPersona(e.target.value)}
                                    title="AI Persona"
                                >
                                    <option value="concise">CONCISE</option>
                                    <option value="detailed">DETAILED</option>
                                    <option value="sarcastic">SARCASTIC</option>
                                </select>
                                <button
                                    className={`tts-toggle ${ttsEnabled ? 'active' : ''}`}
                                    onClick={() => setTtsEnabled(!ttsEnabled)}
                                    title="Text to Speech"
                                >
                                    {ttsEnabled ? '🔊' : '🔇'}
                                </button>
                                <button
                                    className="minimize-btn"
                                    onClick={toggleMinimize}
                                    title={isMinimized ? "Expand" : "Minimize"}
                                >
                                    {isMinimized ? '▢' : '−'}
                                </button>
                                <button className="clear-btn" onClick={clearChat} title="Clear Chat">🗑</button>
                                <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                <div className="chat-messages">
                                    {!apiKey && (
                                        <motion.div
                                            className="chat-message system"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="message-content">
                                                <span className="system-icon">⚠️</span>
                                                <div>
                                                    <strong>NO API KEY CONFIGURED</strong><br />
                                                    <small>Set your OpenAI API key in <code>hudData.js</code></small>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    {messages.length === 0 && apiKey && (
                                        <motion.div
                                            className="chat-welcome"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="welcome-icon">🤖</div>
                                            <h4>JARVIS AI ONLINE</h4>
                                            <p>How may I assist you today, sir?</p>
                                        </motion.div>
                                    )}
                                    {messages.map((msg, idx) => (
                                        <motion.div
                                            key={idx}
                                            className={`chat-message ${msg.role}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <div className="message-wrapper">
                                                <div className="message-bubble">
                                                    <div className="message-role">
                                                        {msg.role === 'user' ? 'YOU' : 'JARVIS'}
                                                    </div>
                                                    <div className="message-content">
                                                        {formatMessage(msg.content)}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isLoading && (
                                        <motion.div
                                            className="chat-message assistant"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            <div className="message-wrapper">
                                                <div className="message-bubble">
                                                    <div className="message-role">JARVIS</div>
                                                    <div className="message-content typing">
                                                        <span></span><span></span><span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="chat-input-container">
                                    <div className="input-wrapper">
                                        <button
                                            className={`voice-btn ${isListening ? 'active' : ''}`}
                                            onClick={startListening}
                                            title="Voice Input"
                                        >
                                            {isListening ? '🎙️' : '🎤'}
                                        </button>
                                        <textarea
                                            ref={inputRef}
                                            className="chat-input"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder={apiKey ? "Type your message..." : "⚠️ API KEY REQUIRED"}
                                            disabled={!apiKey || isLoading}
                                            rows={1}
                                        />
                                        <motion.button
                                            className="send-btn"
                                            onClick={sendMessage}
                                            disabled={!apiKey || !input.trim() || isLoading}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {isLoading ? '⏳' : '▶'}
                                        </motion.button>
                                    </div>
                                    <div className="input-hint">
                                        <span>Press <kbd>Enter</kbd> to send • <kbd>Shift + Enter</kbd> for new line</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

