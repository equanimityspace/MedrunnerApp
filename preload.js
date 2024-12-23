const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setTitle: (title) => ipcRenderer.send('set-title', title),
    webPreferences: {
        preload: path.join(app.getAppPath(), 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        nodeIntegrationInWorker: false
    }
})