const { app, BrowserWindow, session, webContents, ipcMain, WebContentsView, dialog } = require('electron')
const DiscordRPC = require('discord-rpc')
const path = require('path')
const { URL } = require('url')
require('dotenv').config()

const clientId = process.env.CLIENT_ID

// TODO limit webpage navigation (once we figure out what to nav to)

// Added security -- prevents app from interacting with other applications or "sensitive" system resources
app.enableSandbox()

let mainWindow
let medrunnerButton
let medTools

function createWindow () {
    mainWindow = new BrowserWindow({
        show: false,
        width: 1600,
        height: 1000,
    webPreferences: {
        preload: path.join(app.getAppPath(), 'preload.js'),
        contextIsolation: true,
        nodeIntegration: false,
        nodeIntegrationInWorker: false
    }
    })
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    // Load med-tools first,
    medTools = new WebContentsView()
    mainWindow.contentView.addChildView(medTools)
    medTools.webContents.loadURL('https://med-tools.space')
    medTools.setBounds({x: 0, y: 40, width: 1600, height: 960})

    // then load medrunner staff portal as start page
    medrunnerView = new WebContentsView()
    mainWindow.contentView.addChildView(medrunnerView)
    medrunnerView.webContents.loadURL('https://staff.medrunner.space')
    medrunnerView.setBounds({x: 0, y: 40, width: 1600, height: 960})

    mainWindow.on('resize', () => {
        const [newWidth, newHeight] = mainWindow.getSize()
        const viewHeight = newHeight - 40
      
        // Update bounds for both views
        medrunnerView.setBounds({ x: 0, y: 40, width: newWidth, height: viewHeight })
        medTools.setBounds({ x: 0, y: 40, width: newWidth, height: viewHeight })
    })

    // set discord rich presence
    rpc.on('ready', () => {
        setActivity()

        setInterval(() => {
            setActivity()
        }, 15e3)
    })
};

ipcMain.on('show-view', (event, viewID) => {
    if (viewID === 1) {
        mainWindow.contentView.addChildView(medrunnerView)
    } else if (viewID === 2) {
        mainWindow.contentView.addChildView(medTools)
    }
})

const rpc = new DiscordRPC.Client({
    transport: 'ipc'
})

rpc.login({
    clientId: clientId
})

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
    
    // lift off!!
    createWindow()
    
    // load custom html
    mainWindow.loadFile('assets/index.html')
})

// includes support for mac, just in case...
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})