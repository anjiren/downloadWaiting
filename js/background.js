function triggerlearning(reason) {
  // Send a message to the active tab to launch a popup
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "launchPopup"},
    function(response) {});
  });
}

/* Checks for downloads. Currently triggers learning only on large downloads. */
chrome.downloads.onCreated.addListener(function(downloadItem) {
  console.log("Downloading...");
  var downloadSize = downloadItem.fileSize;
  console.log("Download size: " + downloadSize);
  triggerlearning("download");

    // trigger learning if download is large
    

    // Incrementally checks progress of download
   /* setInterval(function(){
      chrome.downloads.search({}, function(items){
        items.forEach(function(item){
          if(item.state == "in_progress"){
            console.log("% downloaded: " + item.bytesReceived + " " + item.bytesReceived/item.totalBytes);
            console.log("estimated end time: " + item.estimatedEndTime);
          }
        })
      });
    },2000);*/
  });


// Listen for any changes to the URL of any tab.
//chrome.tabs.onUpdated.addListener(getBgColors);