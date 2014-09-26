Parse.initialize("TbO2JRJP6Z5JR7SzcP0BZ08Kx7bViSFqsdsG7VxA", "TYzfDGZzEP8F5U4YDXujM5zPRbAxy1YHMei1T6CG");


function triggerLearning(reason) {
  // Send a message to the active tab to launch a popup
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "launchPopup" },
    function(response) {});
  });
}

/* Checks for downloads. Currently triggers learning only on large downloads. */
chrome.downloads.onCreated.addListener(function(downloadItem) {

  console.log("DownloadWaiting Extension: Downloading...");
  var downloadSize = downloadItem.fileSize;
  console.log("DownloadWaiting Extension: Download size: " + downloadSize + "b"); 
  //triggerLearning("download");

  var DownloadData = Parse.Object.extend("DownloadData");
  var dataChunk = new DownloadData();
 
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    dataChunk.set("tabID", tabs[0].id);
  });

  dataChunk.set("size", downloadSize);
  dataChunk.set("downloadStartTime", downloadItem.startTime);
  dataChunk.set("downloadEstimatedEndTime", downloadItem.estimatedEndTime);


  // while (downloadItem.state === "in_progress") {
  // }

  // if (downloadItem.state === "complete") {
    dataChunk.set("downloadEndTime", downloadItem.endTime);
  // }

  dataChunk.save(null, {
  success: function(gameScore) {
    // Execute any logic that should take place after the object is saved.
    //alert('New download data object created with ID: ' + dataChunk.id);
  },
  error: function(gameScore, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    //alert('Failed to create new download data object, with error code: ' + error.message);
  }
  });

  console.log("Data sent to Parse.")

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