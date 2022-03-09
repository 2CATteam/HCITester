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

chrome.storage.local.get(["test", "test2", "blackBoxStimuli", "closeButtonStimuli"], (result) => {
	if (result.test) {
		document.getElementById("test").checked = true
	}
	if (result.test2) {
		document.getElementById("test2").checked = true
	}
	if(result.blackBoxStimuli){
		document.getElementById("blackBoxStimuli").checked = true
	}
	if(result.closeButtonStimuli){
		document.getElementById("closeButtonStimuli").checked = true
	}
})

//https://stackoverflow.com/questions/6358673/javascript-checkbox-onchange
let checkbox = document.getElementById('test')

checkbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
	 chrome.storage.local.set({test: true}, () => {
		console.log("Change successful")
	 })
  } else {
	 chrome.storage.local.set({test: false}, () => {
		console.log("Change successful")
	 })
  }
})

checkbox = document.getElementById('test2')

checkbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
	 chrome.storage.local.set({test2: true}, () => {
		console.log("Change successful")
	 })
  } else {
	 chrome.storage.local.set({test2: false}, () => {
		console.log("Change successful")
	 })
  }
})

checkBox = document.getElementById('blackBoxStimuli')

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

document.getElementById("clearTime").onclick = clearTime