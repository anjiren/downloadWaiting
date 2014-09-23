chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		// Check if message was sent from another content script or the extension
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		// Create quiz popup
		var c = document.createElement('div');
		c.id = "quizContainer";
		var d = document.createElement('div');
		d.id = "quiz";
		$("body").append(c);
		$("#quizContainer").append(d).css('background-color', 'transparent');
			
		$("#quiz").css('z-index', '1000')
				  .css('overflow', 'auto')
				  .css('position', 'relative')
				  .css('width', '200px');

		var choice1 = document.createElement('div');
		choice1.id = "c1";

		var choice2 = document.createElement('div');
		choice2.id = "c2";

		var clear = document.createElement('div');
		clear.id = "clear";

		var question = document.createElement('span');
		question.id = "prompt";

		$("#quiz").append(question).append(choice1).append(choice2).append(clear);
		// Entire dialog
		$("#quiz").css('font-family', 'sans-serif').css('font-size', '12px')
		.css('text-align', 'center');

		// Question prompt
		$("#prompt").css('background-color', '#A69F88').css('height', '40px')
		.html("Question?").css('display', 'block').css('border', '1px solid white')
		.css("box-sizing", "border-box").css('padding-top', '5px').css('color', '#5FE6B9')
		.css("letter-spacing", "1px");

		// Choice 1 answer
		$("#c1").css('height', '100px').css('width', '98px').css('border', '1px solid white')
		.css('color', 'white').html("Choice 1").css('background-color', '#D1CCBD').css('float', 'left')
		.css('margin-left', 'auto').css('padding-top', '20px');

		// Choice 2 answer
		$("#c2").css('height', '100px').css('width', '98px').css('border', '1px solid white')
		.css('color', 'white').html("Choice 2").css('background-color', '#D1CCBD').css('float', 'left')
		.css('margin-right', 'auto').css('padding-top', '20px');

		// Keeps choice1 and choice2 adjacent
		$("#clear").css('clear', 'both');

		$(".ui-button-text").html("x");


		function chooseC1() {
			// right answer
			$("#c1").css('background-color', '#8EDD65');
		};

		function exitC1() {
			$("#c1").css('background-color', '#D1CCBD');
		};

		function chooseC2() {
			// wrong answer
			$("#c2").css('background-color', '#FF5C39');
		};

		function exitC2() {
			$("#c2").css('background-color', '#D1CCBD');
		};

		$("#c1").mouseenter(chooseC1).mouseleave(exitC1);
		$("#c2").mouseenter(chooseC2).mouseleave(exitC2);

		if (request.greeting == "launchPopup") {
			console.log("Launching popup quiz!");
			$("#quizContainer").dialog({position: {my: "left top", at: "left bottom", of: window}});
			console.log("Quiz launched!")
		}
	});