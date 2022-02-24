const STIMULI_START_TIME = 5000
const MAX_TIME = 10000 //the max time after the stimuli starts

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
	chrome.storage.local.get(["test", "test2", "blackBoxStimuli"], (result) => {
		console.log(result)
		if (result.test) {
			console.log("Test was defined")
		}
		if (result.test2) {
			test2()
		}
		if(result.blackBoxStimuli){
			blackBoxStimuli()
		} else {
			resetBlackBoxStimuli()
		}
	})
}

function test2() {
	console.log("Test2 was defined")
}

//Black box stimuli stuff -------------------------------------------------------------------------------------
let blackBoxElement = document.createElement('div')
blackBoxElement.className = 'blackBox-element'
function blackBoxStimuli(){
	//After 5 seconds do something
	const el = document.getElementsByClassName('blackBox-element')
	if(el.length == 0){
		document.body.appendChild(blackBoxElement)
	}

	if(timeOnPage > STIMULI_START_TIME){
		const blackBoxPercent = Math.min(((timeOnPage-STIMULI_START_TIME) / MAX_TIME) * 100, 100)
		blackBoxElement.style = `z-index: 16777271;
			top:0px;
			left:0px;
			position: absolute;
			width:100vw;
			height:100vh;
			background: rgba(0,0,0,${blackBoxPercent/100});
			pointer-events: none`
	} else {
		resetBlackBoxStimuli()
	}
}

function resetBlackBoxStimuli(){
	blackBoxElement.style = `z-index: 16777271;top:0px;left:0px;position: absolute;width:0%;height:0%;background: rgba(0,0,0,0);`
}