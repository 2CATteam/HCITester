const STIMULI_START_TIME = 1000 * 60 * 5
const MAX_TIME = 1000 * 60 * 5 //the max time after the stimuli starts

let timeOnPage = 0
let lastChecked = new Date()
var lastScrollPosition = window.scrollY
var scrollMultiplier = 1
let doBlur = false

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
	document.addEventListener('scroll', interceptScroll)
}

function onLoadRepeat() {
	if (!document?.body || !(document.body instanceof Node)) {
		setTimeout(onLoadRepeat, 1)
		return
	}
	
	let addedCSS = document.createElement("style")
	
	addedCSS.innerHTML = `
		.hciAffectedElement {
			color: transparent !important;
		}
	`
	
	document.head.appendChild(addedCSS)
}

function updateTime() {
	let obj = {}
	obj[window.location.hostname] = timeOnPage
	chrome.storage.local.set(obj, function() {
		console.log(timeOnPage)
	})
}

setInterval(updateTime, 1000)

onLoad()

onLoadRepeat()

function runStimuli() {
	timeOnPage += (new Date().valueOf()) - lastChecked.valueOf()
	lastChecked = new Date()
	chrome.storage.local.get(["blackBoxStimuli", "closeButtonStimuli", "scrollStimuli", "blurStimuli", "popupStimuli"], (result) => {
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
		if (result.scrollStimuli) {
			setScrollMultiplier()
		} else {
			resetScrollMultiplier()
		}
		if(result.popupStimuli){
			checkPopupStimuli()
		} else {
			resetPopupStimuli()
		}
		doBlur = result.blurStimuli
	})
	requestAnimationFrame(runStimuli)
}
requestAnimationFrame(runStimuli)
function runBlur() {
	blurText()
}
setInterval(runBlur, 1000)

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
			pointer-events: none;`
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
			buttonElement.onclick = closeTab
			
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
			position: fixed;
			padding: 4px;
			`
			buttonX = newX
			buttonY = newY
		}
	}
}

// Updates the stored position of the mouse
function mouseMoved(event){
	mouseX = event.clientX
	mouseY = event.clientY
}

// Closes the current tab when the button is pressed
function closeTab(){
	close()
}

// Removes the button
function resetCloseButtonStimuli(){
	if (document.body.contains(buttonElement)) {
		document.body.removeChild(buttonElement)
	}
}
// End Button Close stuff -----------------------------------------

function setScrollMultiplier() {
	if (timeOnPage < STIMULI_START_TIME) {
		resetScrollMultiplier()
	} else {
		scrollMultiplier = Math.max(0, 1 - ((timeOnPage - STIMULI_START_TIME) / MAX_TIME))
	}
}

function interceptScroll(event) {
	if (window.scrollY == Math.round(lastScrollPosition)) {
		return
	}
	lastScrollPosition = lastScrollPosition + (window.scrollY - lastScrollPosition) * scrollMultiplier
	scrollTo(window.scrollX, Math.round(lastScrollPosition))
}

function resetScrollMultiplier(event) {
	lastScrollPosition = window.scrollY
	scrollMultiplier = 1
}

function blurText() {
	let nodeList = document.querySelectorAll("a, h1, h2, h3, h4, h5, h6, p, span, strong, em, i, b, div")
	nodeList.forEach(addTransparency)
}

function addTransparency(node) {
	if (!node) return
	if (!(node instanceof HTMLElement)) return
	if (node?.classList?.contains("hciAffectedElement")) {
		//${((timeOnPage - STIMULI_START_TIME) / MAX_TIME) * 10}
		let text = node.style.getPropertyValue("text-shadow")
		let color = text.match(/rgba?\([^)]+\)/)[0]
		node.style.setProperty("text-shadow", `0 0 ${Math.min(Math.max((timeOnPage - STIMULI_START_TIME) / MAX_TIME, 0) * 10, 10) * (doBlur ? 1 : 0)}px ${color}`, "important")
	} else {		
		let style = window.getComputedStyle(node)
		if (style.color == "rgba(0, 0, 0, 0)") {
			return
		}
		node.style.setProperty("text-shadow", `0 0 ${Math.min(Math.max((timeOnPage - STIMULI_START_TIME) / MAX_TIME, 0) * 10, 10) * (doBlur ? 1 : 0)}px ${style.color}`, "important")
		node.classList.add("hciAffectedElement")
	}
}

// Begin Popup stuff ---------------------------------------------------

//There is a known issue with having the browser on the second monitor and the popups showing on the first
//I don't currently know how to fix that

const popupFactor = 5 * 1000 //The amount of time that gets decreased per loop
const startCounter = 10 //this is what actually decrements to decrease the time

let bShouldPopup = false
let bLoopIsRunning = false
let currentTimer = null

//Temporary list of url's to test with
const urlList = [
	"https://www.mcleanhospital.org/essential/it-or-not-social-medias-affecting-your-mental-health",
	"https://www.piedmont.org/living-better/how-the-internet-affects-your-mental-health",
	"https://etactics.com/blog/social-media-and-mental-health-statistics",
	"https://www.karger.com/Article/FullText/491997"
]

function checkPopupStimuli(){
	if(timeOnPage > STIMULI_START_TIME){
		if(bLoopIsRunning) return
		bLoopIsRunning = true
		bShouldPopup = true

		popupLoop(startCounter, popupFactor)
	} else {
		resetPopupStimuli()
	}
}

function resetPopupStimuli(){
	bShouldPopup = false
	bLoopIsRunning = false
	if(currentTimer != null) clearTimeout(currentTimer)
}

function popupLoop(counter, factor){
	const leftR = Math.floor(Math.random() * getWidth())
	const topR = Math.floor(Math.random() * getHeight() - 400)
	const randUrl = Math.floor(Math.random() * urlList.length)
	chrome.runtime.sendMessage({url: urlList[randUrl], topRand: topR, leftRand: leftR}, function(response) {
		console.log(response.success);
	  });

	//If we should still be doing the loop or not
	if(bShouldPopup){
		// 1 * factor is the shortest amount of time allowed
		if(counter > 1){
			counter--
		}

		delay = counter * factor

		//Call this same function after the given delay
		currentTimer = setTimeout(popupLoop, delay, counter, factor)
	}
}

// https://stackoverflow.com/questions/1038727/how-to-get-browser-width-using-javascript-code
// Comes from jQuery's implementation
function getWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }
  
  function getHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    );
  }

  //End Popup Stuff ------------------------------------------------