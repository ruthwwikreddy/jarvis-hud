const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;

    const win = new BrowserWindow({
        width: width,
        height: height,
        x: 0,
        y: 0,
        frame: false,
        transparent: true, // This allows the desktop to show through
        hasShadow: false,
        resizable: true, // Set to true to allow resizing across screens
        movable: true,   // Set to true so you can drag it
        alwaysOnTop: false,
        type: 'panel', // Helps with macOS background/overlay behavior
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // To move the HUD:
    // Since it has no title bar, you can drag it from the empty spaces
    // once we add a "drag region" to the CSS.


    // macOS specific: Make it behave like a wallpaper
    if (process.platform === 'darwin') {
        win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

        // This makes it stay below all windows like a wallpaper
        win.setAlwaysOnTop(false);

        // Optional: If you want it to be "click-through" so you can click icons behind it
        // win.setIgnoreMouseEvents(true);
    }

    // Load the current dev server (Updated to port 3000)
    win.loadURL('http://localhost:3000');

    // If you ever build the app (npm run build), use this instead:
    // win.loadFile(path.join(__dirname, 'dist/index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
