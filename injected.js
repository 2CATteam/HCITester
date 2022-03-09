const STIMULI_START_TIME = 1000 * 60 * 5
const MAX_TIME = 1000 * 60 * 5 //the max time after the stimuli starts

let timeOnPage = 0
let lastChecked = new Date()
let port
let portOpen = false
let encoder = new TextEncoderStream()
let outputDone
let outputStream

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
	chrome.storage.local.get(["test", "test2", "blackBoxStimuli", "closeButtonStimuli"], (result) => {
		console.log(result)
		if(result.blackBoxStimuli){
			blackBoxStimuli()
		} else {
			resetBlackBoxStimuli()
		}
		if(result.closeButtonStimuli){
			closeButtonStimuli()
		}
		else{
			resetCloseButtonStimuli()
		}
	})
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
			position: fixed;
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


// Begin Button Close stuff -----------------------------------------

// The button element
let buttonElement = document.createElement('button')
buttonElement.className = 'button-element'

// Variables for finding where to put the button
let buttonX = 0
let buttonY = 0
let mouseX = 0
let mouseY = 0
let maxDistance = 5000
const buttonHeight = 20
const buttonWidth = 50

function closeButtonStimuli(){
	// Adds the button to the page if it's not there
	const b = document.getElementsByClassName('button-element')
		if(b.length == 0){
			document.body.appendChild(buttonElement)
			document.onmousemove = mouseMoved
			buttonElement.innerHTML = "Close"
			buttonElement.onclick = closeTab()
			
			maxDistance = document.documentElement.clientWidth
		}
	
	if(timeOnPage > STIMULI_START_TIME){
		const percent = Math.min(((timeOnPage-STIMULI_START_TIME) / MAX_TIME), 1)
		
		const maxDist = maxDistance - (maxDistance * percent)
		const xDiff = buttonX - mouseX
		const yDiff = buttonY - mouseY
		const dist = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))
		
		console.log(`Max distance: ${maxDist}`)
		console.log(`X: ${xDiff}=${buttonX}-${mouseX}`)
		console.log(`Y: ${yDiff}=${buttonY}-${mouseY}`)
		console.log(`Difference: (${xDiff},${yDiff})`)
		
		if(dist > maxDist){
			const angle = Math.atan2(yDiff, xDiff)
			console.log(`Angle: ${angle * 180 / Math.PI}`)
			
			var newX = mouseX + maxDist * Math.cos(angle)
			var newY = mouseY + maxDist * Math.sin(angle)
			
			console.log(`New: (${newX},${newY})`)
			
			buttonElement.style = 
			`
			z-index: 16777271;
			top:${newY - buttonHeight/2}px;
			left:${newX - buttonWidth/2}px;
			position: absolute;
			width:${buttonWidth}px;
			height:${buttonHeight}px;
			`
			buttonX = newX
			buttonY = newY
		}
	}
}

// Updates the stored position of the mouse
function mouseMoved(event){
	mouseX = event.pageX
	mouseY = event.pageY
}

// Closes the current tab when the button is pressed
function closeTab(){
	close()
}

// Removes the button
function resetCloseButtonStimuli(){
	document.body.removeChild(buttonElement)
}
// End Button Close stuff -----------------------------------------