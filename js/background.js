Parse.initialize("TbO2JRJP6Z5JR7SzcP0BZ08Kx7bViSFqsdsG7VxA", "TYzfDGZzEP8F5U4YDXujM5zPRbAxy1YHMei1T6CG");
// Helper function for generating alphanumeric string.
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
var randomID = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

chrome.storage.sync.set({'USER_ID': randomID}, function() {
          // Notify that we saved.
          console.log("User ID " + randomID + " generated and saved.");
        });
function triggerLearning(reason) {
  // Send a message to the active tab to launch a popup.
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "launchPopup" },
    function(response) {});
  });
}

/* Checks for downloads. Currently triggers learning only on large downloads. */
chrome.downloads.onCreated.addListener(function(downloadItem) {
  //chrome.storage.sync.get('USER_ID', function(obj) {
    //console.log(obj) 
  //});
  console.log("DownloadWaiting Extension: Downloading...");
  var downloadSize = downloadItem.fileSize;
  console.log("DownloadWaiting Extension: Download size: " + downloadSize + "b"); 
  //triggerLearning("download");

  var DownloadData = Parse.Object.extend("DownloadData");
  var dataChunk = new DownloadData();
 
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    dataChunk.set("tabID", tabs[0].id);
  });

  chrome.storage.sync.get('USER_ID', function(obj) {
    dataChunk.set("userID", obj.USER_ID);
  })
  dataChunk.set("size", downloadSize);
  dataChunk.set("downloadStartTime", downloadItem.startTime);
  // trigglerLearning("download");

 var waitForDownloadComplete = setInterval(function(){
      chrome.downloads.search({}, function(items){
          var item = items[items.length - 1];
          if (item.state == "in_progress") {
            console.log("% Downloaded: " + item.bytesReceived + " " + item.bytesReceived/item.totalBytes);
            console.log("Estimated end time: " + item.estimatedEndTime);
          } else if (item.state == "complete") {
            clearInterval(waitForDownloadComplete);
            console.log("DownloadWaiting: Download complete!");
            console.log("DownloadWaiting: Download end time: " + item.endTime);
            dataChunk.set("downloadEndTime", item.endTime)
            console.log(item.id);
              dataChunk.save(null, {
              success: function(gameScore) {
                console.log("DownloadWaiting: Data sent to Parse.")
              },
              error: function(gameScore, error) {
                console.log("DownloadWaiting: Parse save error.");
              }
              });
          } else {
            // Download was interrupted.
            clearInterval(waitForDownloadComplete);
          }
      });
    }, 2000);


 // var waitForDownloadComplete = setInterval(function(){
 //      chrome.downloads.search({}, function(items){
 //        items.forEach(function(item){
 //          if (item.state == "in_progress") {
 //            console.log("% Downloaded: " + item.bytesReceived + " " + item.bytesReceived/item.totalBytes);
 //            console.log("Estimated end time: " + item.estimatedEndTime);
 //          } else if (item.state == "complete") {
 //            clearInterval(waitForDownloadComplete);
 //            console.log("Download complete!");
 //            dataChunk.set("downloadEndTime", downloadItem.endTime)
 //            console.log(item.id);
 //              dataChunk.save(null, {
 //              success: function(gameScore) {
 //                console.log("Data sent to Parse.")
 //              },
 //              error: function(gameScore, error) {
 //                console.log("Parse save error.");
 //              }
 //              });
 //          }
 //        })
 //      });
 //    }, 2000);

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