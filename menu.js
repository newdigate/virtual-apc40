'use strict';
const path = require('path');
const {app, Menu, shell, remote} = require('electron');

const {
	is,
	appMenu,
	aboutMenuItem,
	openUrlMenuItem,
	openNewGitHubIssue,
	debugInfo
} = require('electron-util');
const config = require('./config.js');

const showPreferences = () => {
	// Show the app's preferences here
};

const helpSubmenu = [
	openUrlMenuItem({
		label: 'Website',
		url: 'https://github.com/newdigate/undefined'
	}),
	openUrlMenuItem({
		label: 'Source Code',
		url: 'https://github.com/newdigate/undefined'
	}),
	{
		label: 'Report an Issue…',
		click() {
			const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->


---

${debugInfo()}`;

			openNewGitHubIssue({
				user: 'newdigate',
				repo: 'mymidi',
				body
			});
		}
	}
];

if (!is.macos) {
	helpSubmenu.push(
		{
			type: 'separator'
		},
		aboutMenuItem({
			icon: path.join(__dirname, 'static', 'icon.png'),
			text: 'Created by Newdigate'
		})
	);
}

const debugSubmenu = [
	{
		label: 'Show Settings',
		click() {
			config.openInEditor();
		}
	},
	{
		label: 'Show App Data',
		click() {
			shell.openItem(app.getPath('userData'));
		}
	},
	{
		type: 'separator'
	},
	{
		label: 'Delete Settings',
		click() {
			config.clear();
			app.relaunch();
			app.quit();
		}
	},
	{
		label: 'Delete App Data',
		click() {
			shell.moveItemToTrash(app.getPath('userData'));
			app.relaunch();
			app.quit();
		}
	},
	{
		label: 'Toggle dark mode',
		click() {
			const nativeTheme = remote.nativeTheme;
			if (nativeTheme.themeSource === 'dark') {
				nativeTheme.themeSource = 'light';
			} else {
				nativeTheme.themeSource = 'dark';
			}
		}
	}
];

const macosTemplate = [
	appMenu([
		{
			label: 'Preferences…',
			accelerator: 'Command+,',
			click() {
				showPreferences();
			}
		}
	]),
	{
		role: 'fileMenu',
		submenu: [
			{
				label: 'Custom'
			},
			{
				type: 'separator'
			},
			{
				role: 'close'
			}
		]
	},
	{
		role: 'editMenu'
	},
	{
		role: 'viewMenu'
	},
	{
		role: 'windowMenu'
	},
	{
		role: 'help',
		submenu: helpSubmenu
	}
];

// Linux and Windows
const otherTemplate = [
	{
		role: 'fileMenu',
		submenu: [
			{
				label: 'Custom'
			},
			{
				type: 'separator'
			},
			{
				label: 'Settings',
				accelerator: 'Control+,',
				click() {
					showPreferences();
				}
			},
			{
				type: 'separator'
			},
			{
				role: 'quit'
			}
		]
	},
	{
		role: 'editMenu'
	},
	{
		role: 'viewMenu'
	},
	{
		role: 'help',
		submenu: helpSubmenu
	}
];

const template = process.platform === 'darwin' ? macosTemplate : otherTemplate;

if (is.development) {
	template.push({
		label: 'Debug',
		submenu: debugSubmenu
	});
}

module.exports = Menu.buildFromTemplate(template);