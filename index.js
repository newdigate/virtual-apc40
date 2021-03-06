'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain } = require('electron');
/// const {autoUpdater} = require('electron-updater');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const config = require('./config.js');
const menu = require('./menu.js');
const packageJson = require('./package.json');
const midi = require('midi');

unhandled();
debug();
contextMenu();

//app.setAppUserModelId(packageJson.build.appId);

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;
const output = new midi.Output();
output.openVirtualPort("virtual APC40");

ipcMain.handle('note-down', async (event, someArgument) => {
	const result = someArgument;
	const noteNum = someArgument[0];
	const channelNum = someArgument[1];

	output.sendMessage([0x90 + channelNum, noteNum, 90 ]);
	return result
  })

ipcMain.handle('note-up', async (event, someArgument) => {
	const result = someArgument;
	const noteNum = someArgument[0];
	const channelNum = someArgument[1];

	output.sendMessage([0x80 + channelNum, noteNum, 0]);
	return result
})

ipcMain.handle('some-name-cc', async (event, someArgument) => {
	const result = someArgument;
	const ccNum = someArgument[0];
	const channelNum = someArgument[1];
	const value = someArgument[2];

	output.sendMessage([0xB0 + channelNum, ccNum, value]);
	return result
})

const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: app.name,
		show: false,
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	win.on('ready-to-show', () => {
		win.show();

		setInterval(() => {
			//output.sendMessage([176,22,1]);
		}, 1000);
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
		output.closePort();
	});

	await win.loadFile(path.join(__dirname, 'index.html'));

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

(async () => {
	await app.whenReady();
	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();

	//remote.nativeTheme.themeSource = 'system';

	//const favoriteAnimal = config.get('favoriteAnimal');
	//mainWindow.webContents.executeJavaScript(`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`);
})();
