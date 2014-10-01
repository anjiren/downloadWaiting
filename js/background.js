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

var pendingDownloads = [];
/* Checks for downloads. Triggers on all downloads and logs user ID, download start time
and end time, and download size to Parse. */

chrome.downloads.onCreated.addListener(function(downloadItem) {
  //chrome.storage.sync.get('USER_ID', function(obj) {
    //console.log(obj) 
  //});

  // Add to pending downloads queue.
  pendingDownloads.push(downloadItem);
  var downloadSize = downloadItem.downloadSize;
  console.log("DownloadWaiting Extension: Downloading item ID " + downloadItem.id + ".");

  //triggerLearning("download");

  var waitForDownloadComplete = setInterval(function() {
          if (pendingDownloads.length > 0) {
            for (var i = pendingDownloads.length - 1; i >= 0; i--) {
              if (pendingDownloads[i].state === "complete") {
                console.log("Download ID " + pendingDownloads[i].id + " completed.");
                var DownloadData = Parse.Object.extend("DownloadData");
                var dataChunk = new DownloadData();
                var userID = randomID;
                // chrome.storage.sync.get('USER_ID', function(obj) {
                //   console.log("Found user ID: "+ obj.USER_ID);
                //   userID = obj.USER_ID;
                // });
                dataChunk.set("userID", userID);
                dataChunk.set("downloadStartTime", pendingDownloads[i].startTime);
                dataChunk.set("downloadEndTime", pendingDownloads[i].endTime)
                dataChunk.save(null, {
                  success: function(gameScore) {
                    console.log("DownloadWaiting: Data sent to Parse.")
                  },
                  error: function(gameScore, error) {
                    console.log("DownloadWaiting: Parse save error.");
                  }
                });
                pendingDownloads.splice(i, 1); // Remove from list.
              } else if (pendingDownloads[i].state === "interrupted") {
                pendingDownloads.splice(i, 1);
              } else if (pendingDownloads[i].state === "in_progress") {
                chrome.downloads.search({'id': pendingDownloads[i].id}, function(items) {
                  items.forEach(function(item){
                      pendingDownloads.splice(i, 1, item);
                  })
                });
              }
          }        
        } else { // Pending downloads is empty.
            clearInterval(waitForDownloadComplete);
        }
    }, 2000)
});


/* Checks for slow page loads. Logs load time if greater than a certain value. */

// keys = request ids, values = time this key was inserted
var requests = {};
var responses = {};

chrome.webRequest.onSendHeaders.addListener(function(info) {
  var timenow = Date.now();
  requests[info.requestId] = timenow;

  setTimeout(function(){
    if(!(info.requestId in responses)){
      console.error("PageWaiting: SLOW LOAD.");

      // Trigger learning if page is loading slowly
      // triggerlearning("slowpageload");
    }
  }, 1000);

}, {types: ["main_frame"], urls: ["*://*/*"]});


chrome.webRequest.onCompleted.addListener(function(info){
    if(responses[info.requestId] == undefined){

      var timenow = Date.now();
      var timediff = timenow - requests[info.requestId];
      responses[info.requestId] = timenow;
      //console.log("Page load request: " + info.requestID + "loaded in: " + timediff + "ms");
      // Save to Parse if loading took more than 1 second.
      //if (timediff > 1000) {
        var SlowPageData = Parse.Object.extend("SlowPageData");
        var dataChunk = new SlowPageData();
        var userID = randomID;
        // chrome.storage.sync.get('USER_ID', function(obj) {
        //   dataChunk.set("userID", obj.USER_ID);
        // });
        dataChunk.set("userID", userID);
        dataChunk.set("loadTime", timediff);
        dataChunk.save(null, {
          success: function(gameScore) {
            console.log("PageWaiting: Data sent to Parse.")
          },
          error: function(gameScore, error) {
            console.log("PageWaiting: Parse save error.");
          }
        });
      //}

    }
}, {types: ["main_frame"], urls: ["*://*/*"]});