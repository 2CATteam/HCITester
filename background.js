chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension")
        console.log(request)
        if (request.url){
            chrome.windows.create({
                focused: true, 
                height: 400, 
                width: 600, 
                top: request.topRand,
                left: request.leftRand,
                url: request.url, 
                type: "popup",
                incognito: true
            })

            sendResponse({success: "Successfully made new tab"})
        }
      }
)