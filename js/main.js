"use strict";

(function() {
    window.addEventListener("load", main);
})();

var SCREEN = null;
var GAME = null;
var SHIP = null;
var controller = null;

function main() {
	// Event Listener for clicks in 'Play Game' Button.
	var gameBtn = document.getElementById("gameBtn");
	gameBtn.addEventListener("click", startGame);

	// Insert code here
	// Event Listener for clicks in Reset Video button.
	var resetBtn = document.getElementById("resetBtn");
	resetBtn.addEventListener("click", Screen.resetVideo);
  
	// Event Listener for clicks in Login button.
	var loginBtn = document.getElementById("loginBtn");
	loginBtn.addEventListener("click", Screen.openLogin);
  
	// Event Listener for clicks in Back Button in Login.
	var backLoginBtn = document.getElementById("backLoginBtn");
	backLoginBtn.addEventListener("click", Screen.closeLogin);
  
	// Event Listener for clicks in Settings button.
	var settingsBtn = document.getElementById("settingsBtn");
	settingsBtn.addEventListener("click", Screen.openSettings);
  
	// Event Listener for clicks in Back Button in Settings.
	var backSettingsBtn = document.getElementById("backSettingsBtn");
	backSettingsBtn.addEventListener("click", Screen.closeSettings);

	// Event Listener for Login Button in Login.
	var inLoginBtn = document.getElementById("inLoginBtn");
	inLoginBtn.addEventListener("click", Screen.login);
}

function animate() {
	requestAnimationFrame( animate );
	GAME.animate_loop();
	SCREEN.update();
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function startGame() {
	// Avoid invalid names.
	var nickname = document.getElementById("loginTextBox");
	if (nickname.value.length > 15) {
		SCREEN = new Screen();
		SCREEN.errorScreen(nickname.value + "?! What a silly name! It's too long!" )
		return;
	}

	SHIP = new Ship(nickname.value);
	SHIP.load_model();
	console.log(SHIP);

	SCREEN = new Screen();
	SCREEN.fadeToBlack();
	SCREEN.displayHUD();
	GAME = new Technium();
	controller = GAME.controller;
	SHIP.refToScene(GAME.scene, GAME.camera)
	GAME.addShip(SHIP);
	
	

	animate();
}
