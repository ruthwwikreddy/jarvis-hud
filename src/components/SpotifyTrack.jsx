import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './SpotifyTrack.css'

export default function SpotifyTrack({ activeLabel, token }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(80)
    const [trackInfo, setTrackInfo] = useState({
        title: 'AWAITING CONNECTION...',
        artist: 'SYSTEM AUDIO LINK',
        albumArt: null,
        progress: 0,
        duration: 0
    })

    const handleFallback = useCallback(() => {
        setIsPlaying(false)
        const displaySource = activeLabel && activeLabel !== 'SECURE MODE' ? activeLabel : 'OFFLINE'
        setTrackInfo(prev => ({
            ...prev,
            title: displaySource,
            artist: 'ACTIVE MEDIA SOURCE',
            albumArt: null
        }))

        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new window.MediaMetadata({
                title: displaySource,
                artist: 'JARVIS HUD',
                album: 'SYSTEM FEED'
            })
        }
    }, [activeLabel])

    const fetchPlayback = useCallback(async () => {
        if (!token) {
            handleFallback();
            return;
        }
        try {
            const res = await fetch('https://api.spotify.com/v1/me/player', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.status === 200) {
                const data = await res.json()
                setIsPlaying(data.is_playing)
                setVolume(data.device.volume_percent)
                const info = {
                    title: data.item.name,
                    artist: data.item.artists.map(a => a.name).join(', '),
                    albumArt: data.item.album.images[0]?.url,
                    progress: data.progress_ms,
                    duration: data.item.duration_ms
                }
                setTrackInfo(info)

                if ('mediaSession' in navigator) {
                    navigator.mediaSession.metadata = new window.MediaMetadata({
                        title: info.title,
                        artist: info.artist,
                        artwork: info.albumArt ? [{ src: info.albumArt }] : []
                    })
                }
            } else if (res.status === 401) {
                // Token Expired
                setIsPlaying(false)
                setTrackInfo(prev => ({
                    ...prev,
                    title: 'TOKEN EXPIRED',
                    artist: 'RE-AUTHENTICATE',
                    albumArt: null
                }))
            } else {
                handleFallback();
            }
        } catch (err) {
            console.error('Spotify Fetch Error:', err)
            handleFallback();
        }
    }, [token, handleFallback])

    useEffect(() => {
        fetchPlayback()
        const interval = setInterval(fetchPlayback, 4000)
        return () => clearInterval(interval)
    }, [fetchPlayback])

    const handleAction = async (action, method = 'POST') => {
        if (!token) return
        try {
            await fetch(`https://api.spotify.com/v1/me/player/${action}`, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setTimeout(fetchPlayback, 500)
        } catch (err) {
            console.error(`Spotify ${action} Error:`, err)
        }
    }

    const handleVolume = async (newVol) => {
        const volumeInt = parseInt(newVol, 10);
        setVolume(volumeInt)
        if (!token) return
        try {
            await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volumeInt}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            })
        } catch (err) {
            console.error('Spotify Volume Error:', err)
        }
    }

    return (
        <motion.div
            className="spotify-track-container"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="spotify-track">
                <div className="track-icon-wrapper">
                    <AnimatePresence mode='wait'>
                        {trackInfo.albumArt ? (
                            <motion.img
                                key="art"
                                src={trackInfo.albumArt}
                                alt="Album Art"
                                className="album-art"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            />
                        ) : (
                            <motion.div
                                key="icon"
                                className="track-icon"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <span className={`sc-icon ${isPlaying ? 'pulse' : ''}`}>📡</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="track-info">
                    <div className="track-label">{trackInfo.artist.toUpperCase()}</div>
                    <div className="track-title-scroll">
                        <span className="track-text">
                            {trackInfo.title}
                        </span>
                    </div>
                </div>
            </div>

            <div className="spotify-controls">
                <div className="playback-buttons">
                    <button className="ctrl-btn" onClick={() => handleAction('previous')} title="Previous">⏮</button>
                    <button
                        className="ctrl-btn primary"
                        onClick={() => handleAction(isPlaying ? 'pause' : 'play', 'PUT')}
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    <button className="ctrl-btn" onClick={() => handleAction('next')} title="Next">⏭</button>
                </div>

                <div className="volume-control">
                    <span className="vol-icon">🔊</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => handleVolume(e.target.value)}
                        className="vol-slider"
                    />
                    <span className="vol-value">{volume}%</span>
                </div>
            </div>
        </motion.div>
    )
}
