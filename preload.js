const {ipcRenderer} = require('electron');
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
	var nodePads = document.querySelectorAll('.channelNotePad');

	for (let i = 0; i < nodePads.length; i++) {
		nodePads[i].addEventListener('click', (e) => {
			if (e.target.dataset.note !== undefined && e.target.dataset.channel !== undefined) {
				var noteNum = parseInt(e.target.dataset.note);
				var channelNum = parseInt(e.target.dataset.channel);
				ipcRenderer.invoke('some-name', [noteNum, channelNum]).then((result) => {
					console.log('cliecked... ' + result);
				  })
			}
		})
	}

	var ccKnobs = document.querySelectorAll('.cc-knob');
	for (let i = 0; i < ccKnobs.length; i++) {
		ccKnobs[i].addEventListener('input', (e) => {
			if (e.target.dataset.cc !== undefined && e.target.dataset.channel !== undefined) {
				var ccNum = parseInt(e.target.dataset.cc);
				var channelNum = parseInt(e.target.dataset.channel);
				var value = parseInt(e.detail.value);
				ipcRenderer.invoke('some-name-cc', [ccNum, channelNum, value]).then((result) => {
					console.log('cced... ' + result);
				  })
			}
		})
	}
})


