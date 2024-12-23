const { app, BrowserWindow, session, webContents } = require('electron')
const DiscordRPC = require('discord-rpc')
const path = require('path')
const { URL } = require('url')
require('dotenv').config()

const clientId = process.env.CLIENT_ID

// TODO limit webpage navigation (once we figure out what to nav to)

// Added security -- prevents app from interacting with other applications or "sensitive" system resources
app.enableSandbox()

const rpc = new DiscordRPC.Client({
    transport: 'ipc'
})

function createWindow () {
    const win = new BrowserWindow({
        width: 1600,
        height: 1000,
    webPreferences: {
        preload: path.join(app.getAppPath(), 'preload.js')
    }
    })

    rpc.on('ready', () => {
        setActivity()

        setInterval(() => {
            setActivity()
        }, 15e3)
    })

    win.loadURL('https://staff.medrunner.space')
};

async function setActivity() {
    rpc.setActivity({

    details: "Protect. Stabilize. Evacuate.",
    state: "Star Citizen",
    buttons: [
        {
        label: 'Call Us!',
        url: 'https://portal.medrunner.space'
        }
    ]
    });
}

rpc.login({
    clientId: clientId
})

app.whenReady().then(() => {
    // only enable notifications if final URL matches medrunner staff portal
    session
    .fromPartition('some-partition')
    .setPermissionRequestHandler((webContents, permission, callback) => {
        const parsedUrl = new URL(webContents.getURL())

        if (permission === 'notifications') {
            callback(true)
        }

        if (parsedUrl !== 'https:' || parsedUrl.host !== 'staff.medrunner.space') {
            return callback(false)
        }
    });
    
    createWindow()    
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})