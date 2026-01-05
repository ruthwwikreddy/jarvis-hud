# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

JARVIS HUD is an Electron-based desktop application with a React frontend that creates an immersive heads-up display interface inspired by Iron Man's JARVIS. The app features real-time 3D visualization, hand gesture tracking via MediaPipe, audio visualization, and system telemetry monitoring.

## Development Commands

### Core Commands
```bash
# Start Vite dev server (web-only)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run as Electron desktop app (requires dev server running)
npm run desktop

# Package Electron app for distribution
npm run package
```

### Development Workflow
1. Run `npm run dev` to start the Vite dev server on port 3000
2. In a separate terminal, run `npm run desktop` to launch the Electron app
3. The Electron window will load from `http://localhost:3000` in development mode
4. DevTools are automatically opened in development (see `electron-main.cjs:27`)

## Architecture

### Application Layers
The app is structured in three visual layers (see `App.jsx:140-207`):

1. **Background Layer**: Grid background, particle field, scanlines, and vignette effects
2. **System Grid Layout**: 9-zone CSS Grid containing all HUD components (top-left, top-center, top-right, mid-left, center, mid-right, bottom-left, bottom-center, bottom-right)
3. **UI Feedback Layer**: Settings panel and custom cursor overlay

### Key Architectural Patterns

#### State Management
- Central configuration state managed in `App.jsx` via `hudData.js`
- Real-time system metrics update every 5 seconds using Browser APIs (Battery, Network, Storage, Memory)
- Settings are session-only; persistent changes require editing `src/hudData.js`

#### Electron Integration
- **Main Process** (`electron-main.cjs`): Creates borderless, always-on-top window; conditionally loads from Vite dev server or built files
- **Preload Script** (`preload.cjs`): Exposes system metrics (CPU, RAM, uptime) via `window.electronAPI.getSystemMetrics()`
- **Renderer Process** (`src/`): React app with conditional Electron API usage

#### 3D Rendering
- **JarvisCore Component**: React Three Fiber canvas with animated 3D orb
- **JarvisOrb**: Spherical mesh with wireframe, inner core, and particle system (1000 particles)
- **Dynamic Behavior**: Orb rotation speed scales with system load; scale pulses with audio level

#### Hand Gesture Tracking
- **MediaPipe Hands**: Loaded via CDN in `index.html`
- **HandTracker Component**: Detects pinch and fist gestures for UI interaction
- Hidden video/canvas elements capture webcam feed for processing
- Gesture cooldown of 300ms prevents rapid-fire triggers

### Data Flow

1. **Initialization**: `hudData.js` → `App.jsx` state → distributed to child components via props
2. **System Metrics**: Browser APIs → `App.jsx` useEffect (5s interval) → updates config alerts
3. **Audio**: `AudioVisualizer` → simulated waveform → `onAudioLevel` callback → `JarvisCore` orb animation
4. **Settings**: User changes `SettingsPanel` → `onUpdate` callback → `App.jsx` state (session-only)

### Component Organization

All components follow this structure:
- Component file: `src/components/ComponentName.jsx`
- Styles: `src/components/ComponentName.css`
- No shared component library; each component is self-contained

#### Critical Components
- **JarvisCore**: Central 3D orb visualization (React Three Fiber + Three.js)
- **HandTracker**: MediaPipe Hands integration for gesture control
- **AudioVisualizer**: Canvas-based waveform (currently simulated, microphone disabled)
- **TelemetryStrip**: System metrics display
- **SettingsPanel**: Runtime configuration editor (Framer Motion animations)

### External Dependencies
- **MediaPipe Hands**: Loaded from CDN (`https://cdn.jsdelivr.net/npm/@mediapipe/hands/`)
- **Google Fonts**: Orbitron font family for sci-fi aesthetic
- **Three.js**: 3D rendering via React Three Fiber
- **Framer Motion**: UI animations and transitions

### Platform-Specific Behavior
- **macOS**: Window set to `visibleOnAllWorkspaces` and positioned below all windows (see `electron-main.cjs:35-43`)
- **Click-through mode**: Optional via `setIgnoreMouseEvents(true)` (currently commented out)

## Important Notes

### Keyboard Shortcuts
- **F**: Toggle fullscreen mode

### Browser API Requirements
The app relies on these browser APIs (with fallbacks):
- Battery Status API (`navigator.getBattery()`)
- Network Information API (`navigator.connection`)
- Storage API (`navigator.storage.estimate()`)
- Performance Memory API (`performance.memory`) - Chrome/Edge only

### Known Limitations
- Microphone access disabled in `AudioVisualizer` (simulated waveform only)
- Settings changes are session-only; edit `src/hudData.js` for persistence
- Hand tracking requires MediaPipe CDN availability
- Fullscreen mode uses standard browser API (no custom macOS fullscreen)

### Build Artifacts
- `dist/`: Vite production build output
- Electron packaging creates DMG and ZIP for macOS (via electron-builder)
