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
        frame: true, // Temporarily show frame for debugging
        transparent: false, // Temporarily disable transparency to see the window
        hasShadow: true,
        resizable: true,
        movable: true,
        alwaysOnTop: true, // Make sure it pops up
        skipTaskbar: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        }
    });

    win.webContents.openDevTools(); // Open DevTools to see any errors in the console

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

    // Load the UI
    if (app.isPackaged) {
        // PRODUCTION: Load from the local dist folder
        const indexPath = path.join(app.getAppPath(), 'dist/index.html');
        win.loadFile(indexPath).catch(err => {
            console.error("Failed to load index.html:", err);
        });
    } else {
        // DEVELOPMENT: Load from the Vite dev server
        win.loadURL('http://localhost:3000');
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
