const { app, BrowserWindow } = require('electron')
const DiscordRPC = require('discord-rpc')

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
    clientId: '1320075367356170358'
})

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})