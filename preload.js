const {ipcRenderer} = require('electron');
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
	let nodePads = document.querySelectorAll('.channelNotePad');

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

	let pads = document.querySelectorAll('.pad');
	for (let i = 0; i < pads.length; i++) {
		pads[i].addEventListener('click', (e) => {
			if (e.target.dataset.note !== undefined && e.target.dataset.channel !== undefined) {
				var noteNum = parseInt(e.target.dataset.note);
				var channelNum = parseInt(e.target.dataset.channel);
				ipcRenderer.invoke('some-name', [noteNum, channelNum]).then((result) => {
					console.log('cliecked... ' + result);
				  })
			}
		})
	}

	let ccKnobs = document.querySelectorAll('.cc-knob');
	for (let i = 0; i < ccKnobs.length; i++) {
		ccKnobs[i].addEventListener('input', (e) => {
			triggerCCevent(e);
		})
	}

	let sliders = document.querySelectorAll('.slider');
	for (let i = 0; i < sliders.length; i++) {
		sliders[i].addEventListener('input', (e) => {
			triggerCCevent(e);
		})
	}
})

function triggerCCevent(e) {
	if (e.target.dataset.cc !== undefined && e.target.dataset.channel !== undefined) {
		var ccNum = parseInt(e.target.dataset.cc);
		var channelNum = parseInt(e.target.dataset.channel);
		var value = parseInt(e.detail.value);
		ipcRenderer.invoke('some-name-cc', [ccNum, channelNum, value]).then((result) => {
			console.log('cced... ' + result);
		});
	}
}

