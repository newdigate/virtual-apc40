const {ipcRenderer} = require('electron');
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
	document.querySelector('#note1').addEventListener('click', () => {

		ipcRenderer.invoke('some-name', 10).then((result) => {
			// ...
			console.log('cliecked... ' + result);
		  })

	})
})


