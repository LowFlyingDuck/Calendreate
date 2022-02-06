const { app, BrowserWindow } = require('electron');
const { writeSync } = require('original-fs');
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      devTools: true
    }
  });
  win.loadFile('public/index.html');
}
app.whenReady().then(() => {
  createWindow()
});