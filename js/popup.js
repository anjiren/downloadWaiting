//alert("Download started!");

//var w = window.open('height=200,width=150');

// Listeners for when to launch a popup

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		if (request.greeting == "launchPopup")
			console.log("popup launched");
	});