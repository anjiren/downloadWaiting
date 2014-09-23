chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		// Check if message was sent from another content script or the extension
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		// Create quiz popup
		var d = document.createElement('div');
		d.id = "quiz";
		$("body").append(d);
			
		$("#quiz").css('z-index', '1000')
				  .css('overflow', 'auto')
				  .css('position', 'relative');

		var choice1 = document.createElement('div');
		choice1.id = "c1";

		var choice2 = document.createElement('div');
		choice2.id = "c2";

		var clear = document.createElement('div');
		clear.id = "clear";

		$("#quiz").append(choice1);
		$("#quiz").append(choice2);
		$("#quiz").append(clear);

		$("#c1").css('height', '100px').css('width', '40%').css('border', '1px solid')
		.css('color', 'white').html("C1!").css('background-color', 'red').css('float', 'left');
		$("#c2").css('height', '100px').css('width', '40%').css('border', '1px solid')
		.css('color', 'white').html("C2!").css('background-color', 'red').css('float', 'left');
		$("#clear").css('clear', 'both');


		function chooseC1() {
			$("#c1").css('background-color', 'green');
		};

		function exitC1() {
			$("#c1").css('background-color', 'red');
		};

		function chooseC2() {
			$("#c2").css('background-color', 'green');
		};

		function exitC2() {
			$("#c2").css('background-color', 'red');
		};

		$("#c1").mouseenter(chooseC1).mouseleave(exitC1);
		$("#c2").mouseenter(chooseC2).mouseleave(exitC2);

		if (request.greeting == "launchPopup") {
			console.log("Launching popup quiz!");
			$("#quiz").dialog({position: {my: "left top", at: "left bottom", of: window}});
			console.log("Quiz launched!")
		}
	});