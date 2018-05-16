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
	var settingsBtn = document.getElementById("loginBtn");
	settingsBtn.addEventListener("click", Screen.openLogin);
  
	// Event Listener for clicks in Back Button in Login.
	var backSettingsBtn = document.getElementById("backLoginBtn");
	backSettingsBtn.addEventListener("click", Screen.closeLogin);
  
	// Event Listener for clicks in Settings button.
	var settingsBtn = document.getElementById("settingsBtn");
	settingsBtn.addEventListener("click", Screen.openSettings);
  
	// Event Listener for clicks in Back Button in Settings.
	var backSettingsBtn = document.getElementById("backSettingsBtn");
	backSettingsBtn.addEventListener("click", Screen.closeSettings);
}

function animate() {
	requestAnimationFrame( animate );
	GAME.animate_loop();
	SCREEN.update();
}

function startGame() {
	SHIP = new Ship();
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
