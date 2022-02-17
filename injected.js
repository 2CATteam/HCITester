let timeOnPage = 0
let lastChecked = new Date()

function onLoad() {
	chrome.storage.local.get([window.location.hostname], (result) => {
		console.log("Result is:")
		console.log(result[window.location.hostname])
		if (result[window.location.hostname]) {
			timeOnPage += result[window.location.hostname]
		}
	})
	//https://developer.chrome.com/docs/extensions/reference/storage/#synchronous-response-to-storage-updates
	chrome.storage.onChanged.addListener(function (changes, namespace) {
		for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
			if (key === window.location.hostname && newValue == 0) {
				timeOnPage = 0
				lastChecked = new Date()
			}
		}
	})
}

function updateTime() {
	timeOnPage += (new Date().valueOf()) - lastChecked.valueOf()
	lastChecked = new Date()
	let obj = {}
	obj[window.location.hostname] = timeOnPage
	chrome.storage.local.set(obj, function() {
		console.log(timeOnPage)
	})
	runStimuli()
}

setInterval(updateTime, 1000)

onLoad()

function runStimuli() {
	chrome.storage.local.get(["test", "test2"], (result) => {
		console.log(result)
		if (result.test) {
			console.log("Test was defined")
		}
		if (result.test2) {
			test2()
		}
	})
}

function test2() {
	console.log("Test2 was defined")
}