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

	var camera, scene, renderer;

	var buttonW = false, buttonA = false, buttonS = false, buttonD = false;

	var solarSystem_Width = 15;
	var solarSystem_Length = 15;
	
	class Planet {
		constructor(vectorPos, radius, speed, semiminor, semimajor, planet) {
			this.vectorPos = vectorPos;
			this.radius = radius;
			this.speed = speed;
			this.semiminor = semiminor;
			this.semimajor = semimajor;
			this.planet = planet;
		}

		getSpeed() {
			return this.speed;
		}
		
		getSemiminor() {
			return this.semiminor;
		}
		
		getSemimajor() {
			return this.semimajor;
		}

		update() {
			this.planet.position.set(this.vectorPos.x + this.semiminor * Math.cos(performance.now()*this.speed), this.vectorPos.z, this.vectorPos.y + this.semimajor * Math.sin(performance.now()*this.speed));
		}
	}

	class SolarSystem {
		// Arguments:
		// vectorPos			-> Position of center (Sun).
		// numPlanets			-> Number of planets.
		// arrayPlanets			-> Array with info about planets [radius, rotationSpeed, semiminor, semimajor, ...] with a size of numPlanets * 4.
		// sunRadius			-> value that is used as the Sun's radius.

		constructor(vectorPos, numPlanets, infoPlanets, sunRadius) {
			this.pos = vectorPos;
			this.numPlanets = numPlanets;
			this.infoPlanets = infoPlanets;
			this.sunRadius = sunRadius;
			this.arrayPlanets = [];
			this.sun = null;
		}
		  
		spawn() {
			this.sun = new THREE.Mesh( new THREE.SphereGeometry( this.sunRadius, 16, 16 ), new THREE.MeshToonMaterial( {color: "rgb(255,222, 0)"} ) );
			this.sun.position.set(this.pos.x, this.pos.z, this.pos.y);
			scene.add(this.sun);

			for (var i = 0; i < this.numPlanets; i++) {
				var planet = new THREE.Mesh( new THREE.SphereGeometry(this.infoPlanets[i*4], 16, 16), new THREE.MeshToonMaterial(  {color: "rgb(255,0, 255)"} ));
				this.arrayPlanets.push(new Planet(this.pos, this.infoPlanets[i*4], this.infoPlanets[i*4+1], this.infoPlanets[i*4+2], this.infoPlanets[i*4+3], planet));
				scene.add(planet);
			}

		}

		update() {
			for (var i = 0; i < this.numPlanets; i++) {
				this.arrayPlanets[i].update();
			}
		}
	
	}

	// [Pointer Lock part.]
	// Determine if browser supports it.
	var hasPointerLock = 'pointerLockElement' in document;

	if ( hasPointerLock ) {
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

	// [Mouse Movement part.]

	// Initializes yaw and pitch values.
	// Yaw rotates camera's head to the left or right - Equivalent to SMH.
	// Pitch tilts camera's head up or down - Equivalent to noding your head.
	var yaw = 0;
	var pitch = 0;

	// Create auxiliary matrices responsible for spaceship control.
	var yawMatrix = new THREE.Matrix4();
	var pitchMatrix = new THREE.Matrix4();
	var rotateMatrix = new THREE.Matrix4();

	// Mouse actuator.
	function mouseMovement(e) {
		// Updates yaw and pitch values according to mouse movement.
		yaw = yaw + e.movementX * -0.002;

		pitch = pitch + e.movementY * -0.002;

		// Creates identity matrices.
		pitchMatrix.identity();
		yawMatrix.identity();

		// Performs rotation on specific axis to pitch and yaw matrices.
		yawMatrix.makeRotationY(yaw);
		pitchMatrix.makeRotationX(pitch);

		// Multiplies yaw and pitch matrices.
		rotateMatrix.multiplyMatrices(yawMatrix, pitchMatrix);

		// Rotates the camera.
		camera.setRotationFromMatrix(rotateMatrix);
		
	}

	// Keyboard key actuators.
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

	// Create camera.
	camera = new THREE.PerspectiveCamera( 90, window.innerWidth/window.innerHeight, 0.1, 10000 );
	scene.add( camera );
	camera.position.z = 5;

	// Create renderer.
	renderer = new THREE.WebGLRenderer();
	// renderer.shadowMap.enabled = true; --> ACTIVATE SHADOWS. TO DECIDE.
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	// Lock Mouse.
	document.body.requestPointerLock();

	// Create ambient light, that illuminates everything uniformly.
	var ambientLight = new THREE.AmbientLight( 0x404040, 2 ); // Soft white light.
	scene.add( ambientLight );

	// Create Solar Systems.
	var solarSystems = [];
	var randomizer = new MersenneTwister(42);
	var planetas = 0;

	// Arguments:
		// vectorPos			-> Position of center (Sun).
		// numPlanets			-> Number of planets.
		// arrayPlanets			-> Array with info about planets [radius, rotationSpeed, semiminor, semimajor, ...] with a size of numPlanets * 4.
		// sunRadius			-> value that is used as the Sun's radius.

	for (var i = 0; i < solarSystem_Width; i++) {
		for (var j = 0; j < solarSystem_Length; j++) {
			var semiminor = 10, semimajor = 10;
			var numPlanets = 1 + (randomizer.genrand_int31() % 10);
			var infoPlanets = [];
			for (var k = 0; k < numPlanets; k++) {
				infoPlanets.push(0.1 + (randomizer.genrand_int31() % 5));
				infoPlanets.push(0.0001 + (randomizer.genrand_real1() * 0.009));
				infoPlanets.push(semiminor + semiminor * (randomizer.genrand_real1() * k));
				infoPlanets.push(semimajor + semimajor * (randomizer.genrand_real1() * k));
				semiminor += 20;
				semimajor += 20;
			}
			solarSystems.push(new SolarSystem( new THREE.Vector3(i*100 + (randomizer.genrand_int31() % 10), j*100 + (randomizer.genrand_int31() % 10), ((i+j)%4) * (randomizer.genrand_int31() % 100) ), numPlanets, infoPlanets, 1 + (randomizer.genrand_int31() % 10) ));
			console.log(infoPlanets);
		}
	}

	for (var i = 0; i < (solarSystem_Width * solarSystem_Length); i++)
		solarSystems[i].spawn();
		



	// Create ship.
	var ship = new THREE.Mesh( new THREE.BoxGeometry( 0.2, 0.001, 0.1 ), new THREE.MeshStandardMaterial( { color: 0xcc0000 } ) );
	var shipOscilation = 0;
	var shipFrontSpeed = 0;
	var shipLeftSpeed = 0;
	var shipBackSpeed = 0;
	var shipRightSpeed = 0;
	ship.castShadow = true;
	scene.add( ship );

	var shipPointPlace = new THREE.Mesh( new THREE.SphereGeometry( 0.02, 4, 4 ) );
	shipPointPlace.position.set(0,-0.075,-0.275);
	shipPointPlace.visible = false;
	camera.add( shipPointPlace );

	var shipPointLook = new THREE.Mesh( new THREE.SphereGeometry( 0.01, 4, 4 ), new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
	shipPointLook.visible = false;
	shipPointLook.position.set(0,-0.075,-2.5);
	camera.add( shipPointLook );


	// Set background dark blue.
	scene.background = new THREE.Color("rgb(2, 0, 15)");

	// var oi = new SolarSystem(new THREE.Vector3(0,0,1), 1, [1, 0.001, 100, 200], 3);
	// oi.spawn();
	
	
	var animate = function () {
		requestAnimationFrame( animate );
		shipOscilation += 0.05 + (shipFrontSpeed + shipBackSpeed) * 1000 + (shipLeftSpeed + shipRightSpeed) * 500;

		// oi.update();

		for (var i = 0; i < (solarSystem_Width * solarSystem_Length); i++)
			solarSystems[i].update();

		// Camera Movement.
		if (buttonW == true) {
			if (shipFrontSpeed > -0.1)
				shipFrontSpeed = shipFrontSpeed * 1.01 - 0.0010;
		} else {
			if (shipFrontSpeed < 0)
				shipFrontSpeed /= 1.05;
		}
		if (buttonA == true) {
			if (shipLeftSpeed > -0.05)
				shipLeftSpeed = shipLeftSpeed * 1.01 - 0.0010;
		} else {
			if (shipLeftSpeed < 0)
				shipLeftSpeed /= 1.05;
		}
		if (buttonS == true) {
			if (shipBackSpeed < 0.05)
				shipBackSpeed = shipBackSpeed * 1.01 + 0.001;
				
		} else {
			if (shipBackSpeed > 0)
				shipBackSpeed /= 1.05;
				
		}
		if (buttonD == true) {
			if (shipRightSpeed < 0.05)
				shipRightSpeed = shipRightSpeed * 1.01 + 0.0010;
		} else {
			if (shipRightSpeed > 0)
				shipRightSpeed /= 1.05;
		}

		// Apply Speeds.
		camera.translateZ(shipFrontSpeed); // Front.
		camera.translateX(shipLeftSpeed); // Left.
		camera.translateZ(shipBackSpeed); // Back.
		camera.translateX(shipRightSpeed); // Right.
		
		// Ship following Part.
		var shipVector = shipPointPlace.getWorldPosition( new THREE.Vector3());
		ship.position.x = (0.01 * ship.position.x + 0.99 * shipVector.x) + Math.cos(shipOscilation)/(500 + (shipFrontSpeed*2000));
		ship.position.y = (0.01 * ship.position.y + 0.99 * shipVector.y) + Math.sin(shipOscilation)/(500 + (shipFrontSpeed*2000));
		ship.position.z = (0.01 * ship.position.z + 0.99 * shipVector.z) ;

		ship.lookAt(shipPointLook.getWorldPosition( new THREE.Vector3()))
		
		renderer.render(scene, camera);
	};

	animate();
}



