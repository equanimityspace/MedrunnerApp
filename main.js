const { app, BrowserWindow } = require('electron')
const DiscordRPC = require('discord-rpc')
require('dotenv').config()

const clientId = process.env.CLIENT_ID

const rpc = new DiscordRPC.Client({
    transport: 'ipc'
})

function createWindow () {
    const win = new BrowserWindow({
        width: 1600,
        height: 1000
    })

    win.loadURL('https://staff.medrunner.space')
};

rpc.on('ready', () => {
    rpc.setActivity({

    details: "Protect. Stabilize. Evacuate.",
    state: "Star Citizen",
    startTimestamp: new Date(),
    largeimage: 'medrunnerlogo', 
    buttons: [
        {
        label: 'Call Us',
        url: 'https://portal.medrunner.space'
        }
    ]
    });
});

rpc.login({
    clientId: clientId
})

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})