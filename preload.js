const {ipcRenderer} = require('electron');
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
	document.querySelector('#note1').addEventListener('click', (e) => {
		if (e.target.dataset.note !== undefined) {
			var arg = e.target.dataset.note;
			var noteNum = parseInt(arg);
			ipcRenderer.invoke('some-name', noteNum).then((result) => {
				// ...
				console.log('cliecked... ' + result);
			  })
		}


	})
})


