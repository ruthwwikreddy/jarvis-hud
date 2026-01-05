# HUD Setup Guide

## New Features Added

### 1. ChatGPT Integration (JARVIS AI Chat)
A fully integrated chat interface powered by OpenAI's GPT models.

**Setup:**
1. Open `src/hudData.js`
2. Add your OpenAI API key:
   ```javascript
   openai: {
       apiKey: "sk-your-api-key-here"
   }
   ```
3. Get your API key from: https://platform.openai.com/api-keys

**Usage:**
- Click the "💬 JARVIS AI" button in the bottom-right corner
- Type your message and press Enter or click the send button
- Chat uses GPT-4o-mini for fast, intelligent responses
- Click the 🗑 button to clear chat history
- Streaming responses appear in real-time

**Features:**
- Real-time streaming responses
- Message history maintained during session
- Syntax-highlighted messages
- Error handling with clear feedback
- Keyboard shortcut: Enter to send, Shift+Enter for new line

---

### 2. 2FA Authenticator
A Time-based One-Time Password (TOTP) authenticator for managing 2FA codes.

**Setup:**
1. Open `src/hudData.js`
2. Add your accounts:
   ```javascript
   authenticator: {
       accounts: [
           { 
               name: "GitHub", 
               issuer: "GitHub", 
               secret: "YOUR_SECRET_KEY_HERE" 
           },
           { 
               name: "Google", 
               issuer: "Google", 
               secret: "YOUR_SECRET_KEY_HERE" 
           }
       ]
   }
   ```

**Getting Secret Keys:**
- When setting up 2FA on any service, they provide a QR code
- Most services also show the secret key (usually labeled "manual entry" or "can't scan")
- Copy that alphanumeric secret key into the `secret` field
- Format: Remove any spaces, use uppercase letters and numbers only

**Usage:**
- Codes appear in the mid-right section of the HUD
- Click any code to copy it to clipboard
- Codes automatically refresh every 30 seconds
- Timer ring shows time remaining until next refresh
- Green highlight indicates successful codes

**Features:**
- Auto-generating 6-digit TOTP codes
- 30-second refresh cycle with visual countdown
- One-click copy to clipboard
- Support for multiple accounts
- Real-time synchronization

---

## Component Locations

### HUD Layout:
```
┌─────────────┬─────────────┬─────────────┐
│  Identity   │    Clock    │   Alerts    │
│  Sun Phase  │    Mode     │  Calendar   │
├─────────────┼─────────────┼─────────────┤
│   TodoList  │   JARVIS    │ Authenticator│
│             │    Core     │             │
├─────────────┼─────────────┼─────────────┤
│   Spotify   │ Telemetry   │    Pico     │
│    Audio    │    Strip    │ Instructions│
└─────────────┴─────────────┴─────────────┘
```

### Overlay Elements:
- **Chat Interface**: Slides in from right when clicked (bottom-right toggle)
- **Custom Cursor**: Follows mouse movement
- **Background**: Grid, particles, scanlines, vignette

---

## Removed Features
- ❌ Settings Panel (CONFIG button) - removed as requested
- ✅ All configuration now done via `src/hudData.js`

---

## Development

Start the dev server:
```bash
npm run dev
```

Run as Electron app:
```bash
npm run desktop
```

Build for production:
```bash
npm run build
```

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit your `hudData.js` with real API keys or secrets to version control
- Add `src/hudData.js` to `.gitignore` if storing sensitive data
- The OpenAI API key allows browser usage (dangerouslyAllowBrowser: true)
- For production, consider using a backend proxy instead

---

## Troubleshooting

**Chat not working:**
- Verify API key is correctly set in `src/hudData.js`
- Check browser console for error messages
- Ensure you have OpenAI API credits available

**Authenticator showing "ERROR":**
- Verify secret key format (no spaces, uppercase)
- Secret should be base32 encoded (A-Z, 2-7)
- Try removing and re-adding the secret

**Build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear dist folder: `rm -rf dist`
- Rebuild: `npm run build`
