"use strict";

(function()
{
	window.addEventListener( "load", main );
}());

function main() {
	// Event Listener for clicks in Reset Video button.
	var resetBtn = document.getElementById("resetBtn");
	resetBtn.addEventListener("click", resetVideo);

	// Event Listener for clicks in Settings button.
	var settingsBtn = document.getElementById("settingsBtn");
	settingsBtn.addEventListener("click", openSettings);

}

function resetVideo() {
	// Gets video element.
	var vid = document.getElementById("videoTutorial");

	// Fades video to black and then resets it.
	vid.style.opacity = "0";
	setTimeout(function() {
		vid.currentTime = 0;
		vid.style.opacity = "1";
	}, 200);
	
}

function openSettings() {	
	document.getElementById("gameBtn").style.opacity = "0";
	document.getElementById("loginBtn").style.opacity = "0";
	document.getElementById("editorBtn").style.opacity = "0";
	document.getElementById("settingsBtn").style.opacity = "0";
	document.getElementById("auxB").style.display = "block";
	
	setTimeout(function() {
		document.getElementById("menu").style.width = "90vw";
		document.getElementById("auxA").style.display = "none";
		
		document.getElementById("musicBtn").style.opacity = "1";
		document.getElementById("sndFxBtn").style.opacity = "1";
		document.getElementById("etcBtn").style.opacity = "1";
	}, 200);
	
}