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

	// Event Listener for clicks in Back Button in Settings.
	var backSettingsBtn = document.getElementById("backSettingsBtn");
	backSettingsBtn.addEventListener("click", closeSettings);

	// Event Listener for clicks in Play Game Button.
	var gameBtn = document.getElementById("gameBtn");
	gameBtn.addEventListener("click", startGame);

}

function resetVideo() {
	// Fades video to black and then resets it.
	var vid = document.getElementById("videoTutorial");
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
	document.getElementById("resetBtn").style.opacity = "0";
	
	
	setTimeout(function() {
		document.getElementById("aux").style.display = "none";
		document.getElementById("menu").style.width = "90vw";
		
		document.getElementById("auxSettings").style.display = "block";
		document.getElementById("musicBtn").style.opacity = "1";
		document.getElementById("sndFxBtn").style.opacity = "1";
		document.getElementById("etcBtn").style.opacity = "1";
		document.getElementById("backSettingsBtn").style.opacity = "1";
	}, 200);
}

function closeSettings() {	
	document.getElementById("musicBtn").style.opacity = "0";
	document.getElementById("sndFxBtn").style.opacity = "0";
	document.getElementById("etcBtn").style.opacity = "0";
	document.getElementById("backSettingsBtn").style.opacity = "0";
	document.getElementById("menu").style.width = "25vw";
	
	setTimeout(function() {
		document.getElementById("auxSettings").style.display = "none";

		document.getElementById("aux").style.display = "block";
		document.getElementById("gameBtn").style.opacity = "1";
		document.getElementById("loginBtn").style.opacity = "1";
		document.getElementById("editorBtn").style.opacity = "1";
		document.getElementById("settingsBtn").style.opacity = "1";
		document.getElementById("resetBtn").style.opacity = "1";
	}, 200);
}

function startGame() {

	// Fade to black.
	document.getElementById("menu").style.opacity = "0";
	document.getElementById("menu").style.width = "0vw";

	setTimeout(function() {
		document.getElementById("menu").style.display = "none";
		document.getElementById("videoTutorial").style.opacity = "0";

		setTimeout(function() {
			document.getElementById("videoTutorial").style.display = "none";
		}, 200);

	}, 200);

	// Game Script goes here.

	var camera, scene, renderer, controls;

	var buttonW = false, buttonA = false, buttonS = false, buttonD = false;

	// Pointer Lock Part.
	// Determine if browser supports it.
	var havePointerLock = 'pointerLockElement' in document;

	if ( havePointerLock ) {
		console.log("Your browser seems to support Pointer Lock API");
	} else {
		console.log("Your browser doesn't seem to support Pointer Lock API");
		return;
	}

	document.addEventListener('pointerlockchange', lockChange, false);

	// Detect mouse locks or unlocks.
	function lockChange() {
		if (document.pointerLockElement === document.body) {
		  	console.log('The pointer lock status is now locked');
			document.addEventListener("mousemove", mouseMovement, false);
		  	document.addEventListener("keydown", keyboardControlDown);
		  	document.addEventListener("keyup", keyboardControlUp);
		} else {
		  	console.log('The pointer lock status is now unlocked');  
			document.removeEventListener("mousemove", mouseMovement, false);
		  	document.removeEventListener("keydown", keyboardControlDown);
		  	document.removeEventListener("keyup", keyboardControlUp);
		}
	}

	// Mouse movement actuator.
	function mouseMovement(e) {

		// TODO: MUDAR ROTAÇAO PRA LOCAL.

		camera.rotateX(e.movementY * -0.001);
		camera.rotation.y += (e.movementX * -0.001);
	}

	// Keyboard key actuator.
	function keyboardControlDown(e) {
		if (e.keyCode == 87) {
			buttonW = true;
		}
		if (e.keyCode == 65) {
			buttonA = true;
		}
		if (e.keyCode == 83) {
			buttonS = true;
		}
		if (e.keyCode == 68) {
			buttonD = true;
		}
	}
	
	function keyboardControlUp(e) {
		if (e.keyCode == 87) {
			buttonW = false;
		}
		if (e.keyCode == 65) {
			buttonA = false;
		}
		if (e.keyCode == 83) {
			buttonS = false;
		}
		if (e.keyCode == 68) {
			buttonD = false;
		}
	}

	// Initial creation of the universe.

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 10000 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	scene.add( new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) ) );

	scene.background = new THREE.Color("rgb(2, 0, 15)");

	camera.position.z = 5;



	// Lock Mouse.
	document.body.requestPointerLock();

	var animate = function () {
		requestAnimationFrame( animate );

		// cube.rotation.x += 0.1;
		// cube.rotation.y += 0.1;


		// Camera Movement.
		if (buttonW == true) {
			camera.translateZ(-0.1);
		}
		if (buttonA == true) {
			camera.translateX(-0.1);
		}
		if (buttonS == true) {
			camera.translateZ(0.1);
		}
		if (buttonD == true) {
			camera.translateX(0.1);
		}

		

		renderer.render(scene, camera);
	};

	animate();
}



