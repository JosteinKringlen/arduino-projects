'use strict';
const {app, Tray, BrowserWindow, Menu} = require('electron');
const path = require('path');
const {callToArduino, connectToPort} = require('./lightsLogic');
const url = require('url');
const subMenu = require('./subMenu');
// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow = undefined;
let tray = undefined;
app.dock.hide();

const createTray = () => {
	tray = new Tray(path.join(__dirname, 'gislefoss.png'));
	const contextMenu = Menu.buildFromTemplate([
		{label: 'Lights Off', type: 'radio', click: () => { callToArduino('0') }},
		{label: 'Rainbow', type: 'radio', checked: true, click: () => callToArduino('a')},
		{label: 'Static', type: 'radio', click: () => callToArduino('b')},
		{label: 'Reverse Rainbow', type: 'radio', click: () => callToArduino('c')},
		{label: 'Epileptic Glory', type: 'radio', click: () => callToArduino('z')},
		{type: 'separator'},
		subMenu,
		{label: 'Quit Lights and Stuff', click: () => app.quit() },
		{label: 'Quit and Lights Off', click: () => { callToArduino(0); app.quit();}}
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
		pathname: path.join(__dirname, '/index.html'),
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

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		createWindow();
	}
});

app.on('ready', () => {
	createTray();
	createWindow();
	// connectToPort();
});
