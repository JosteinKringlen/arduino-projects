const {app, Tray, BrowserWindow, Menu} = require('electron');

// Module to control application life.
// Module to create native browser window.
const path = require('path');
const url = require('url');
const axios = require('axios');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = undefined;
let tray = undefined;
app.dock.hide();

const onChangeLight = id => {
    axios({
        method: 'post',
        url: `http://localhost:8080/${id}`,
    }).then(res => console.log(res))
        .catch(err => console.error(err));
};

const onQuit = () => {
    axios({
        method: 'post',
        url: `http://localhost:8080/quit`,
    }).then(res => console.log(res))
        .then(() =>  app.quit() )
        .catch(err => console.error(err));
};

const createTray = () => {
    tray = new Tray(path.join(__dirname, 'gislefoss.png'));
    const contextMenu = Menu.buildFromTemplate([
        {label: 'Lights Off', type: 'radio', click: () => { onChangeLight(0)}},
        {label: 'Rainbow', type: 'radio', checked: true, click: () => { onChangeLight(1)}},
        {label: 'Static', type: 'radio', click: () => { onChangeLight(2)}},
        {label: 'Reverse Rainbow', type: 'radio', click: () => { onChangeLight(3)}},
        {label: 'Epileptic Glory', type: 'radio', click: () => { onChangeLight('z')}},
        {type: 'separator'},
        {label: 'Quit Lights and Stuff', click: () => { onQuit(); app.quit(); }},
        {label: 'Quit and Lights Off', click: () => { onChangeLight(0); onQuit();}}
    ]);
    tray.setContextMenu(contextMenu);
    tray.on('click', function (event) {
        toggleWindow();
    })
};

const toggleWindow = () => {
    mainWindow.isVisible() ? mainWindow.hide() : showWindow();
};

const showWindow = () => {
    const position = getWindowPosition();
    mainWindow.setPosition(position.x, position.y, false);
    mainWindow.show();
};

const getWindowPosition = () => {
    const windowBounds = mainWindow.getBounds();
    const trayBounds = tray.getBounds();

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4);

    return {x: x, y: y}
};

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 320,
        height: 450,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
    });

    // and load the index.html of the app.
    // mainWindow.loadURL('http://localhost:3000');
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    mainWindow.on('blur', () => {
        if (!mainWindow.webContents.isDevToolsOpened()) {
            mainWindow.hide();
        }
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createTray();
    createWindow();
    axios({
        method: 'post',
        url: 'http://localhost:8080/startup'
    }).then(res => console.log(res))
        .catch(err => console.error(err))
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
