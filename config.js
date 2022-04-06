function clearTime() {
	chrome.tabs.query({
		active: true,
		lastFocusedWindow: true
	}, (tabs) => {
		console.log(tabs)
		if (tabs.length > 0) {
			let url = tabs[0].url
			url = url.match(/^https?:\/\/([^\/]+)/i)[1]
			console.log(url)
			let obj = {}
			obj[url] = 0
			chrome.storage.local.set(obj, function() {
				console.log("Cleared time")
			})
		}
	})
	let obj = {}
	console.log(window.location.hostname)
	obj[window.location.hostname] = 0
	chrome.storage.local.set(obj, function() {
		console.log("Cleared time")
	})
}

chrome.storage.local.get(["test", "test2", "blackBoxStimuli", "closeButtonStimuli", "scrollStimuli", "blurStimuli", "popupStimuli"], (result) => {
	if(result.blackBoxStimuli){
		document.getElementById("blackBoxStimuli").checked = true
	}
	if(result.closeButtonStimuli){
		document.getElementById("closeButtonStimuli").checked = true
	}
	if (result.scrollStimuli) {
		document.getElementById("scrollStimuli").checked = true
	}
	if (result.blurStimuli) {
		document.getElementById("blurStimuli").checked = true
	}
	if(result.popupStimuli){
		document.getElementById("popupStimuli").checked = true
	}
})

let checkBox = document.getElementById('blackBoxStimuli')

checkBox.addEventListener('change', (event) => {
	if(event.currentTarget.checked) {
		chrome.storage.local.set({blackBoxStimuli: true}, ()=>{
			console.log("Change successful")
		})
	} else {
		chrome.storage.local.set({blackBoxStimuli: false}, ()=>{
			console.log("Change successful")
		})
	}
})

checkBox = document.getElementById('closeButtonStimuli')

checkBox.addEventListener('change', (event) => {
	if(event.currentTarget.checked) {
		chrome.storage.local.set({closeButtonStimuli: true}, ()=>{
			console.log("Change successful")
		})
	} else {
		chrome.storage.local.set({closeButtonStimuli: false}, ()=>{
			console.log("Change successful")
		})
	}
})

checkBox = document.getElementById('scrollStimuli')

checkBox.addEventListener('change', (event) => {
	if(event.currentTarget.checked) {
		chrome.storage.local.set({scrollStimuli: true}, ()=>{
			console.log("Change successful")
		})
	} else {
		chrome.storage.local.set({scrollStimuli: false}, ()=>{
			console.log("Change successful")
		})
	}
})

checkBox = document.getElementById('blurStimuli')

checkBox.addEventListener('change', (event) => {
	if(event.currentTarget.checked) {
		chrome.storage.local.set({blurStimuli: true}, ()=>{
			console.log("Change successful")
		})
	} else {
		chrome.storage.local.set({blurStimuli: false}, ()=>{
			console.log("Change successful")
		})
	}
})

checkBox = document.getElementById('popupStimuli')

checkBox.addEventListener('change', (event) => {
	if(event.currentTarget.checked) {
		chrome.storage.local.set({popupStimuli: true}, ()=>{
			console.log("Change successful")
		})
	} else {
		chrome.storage.local.set({popupStimuli: false}, ()=>{
			console.log("Change successful")
		})
	}
})

document.getElementById("clearTime").onclick = clearTime