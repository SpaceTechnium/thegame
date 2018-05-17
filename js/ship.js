//================================================
// Ship.js
//================================================
const SHIP_SCALE = 0.02;
class Ship {
    constructor() {
        // Attributes
        this.damage = 1;
        this.score = 0;
        this.oscilation = 0;
        this.frontSpeed = -0.8;
        this.leftSpeed  = 0;
        this.backSpeed  = 0;
        this.rightSpeed = 0;
        this.particles    = [];
        this.bullets    = [];
		this.model = null;
		this.scene = null;
		this.camera = null;

        // Movement Helpers
        this.pointPlace = new THREE.Mesh(new THREE.SphereGeometry(0.02, 4, 4));
        this.pointPlace.position.set(0, -0.075, -0.475);
        this.pointPlace.visible = false;

        this.pointLook = new THREE.Mesh(new THREE.SphereGeometry(0.01, 4, 4), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        this.pointLook.visible = false;
        this.pointLook.position.set(0, -0.075, -2.5);
	}
	
	refToScene (scene, camera) {
        this.scene = scene;
        this.scene.add(this.curveObject);
		this.camera = camera;
		camera.add(this.pointPlace);
		camera.add(this.pointLook);
	}
	
	load_model() {
		var loader = new THREE.GLTFLoader();

        // Load a glTF resource.
        loader.load(
			// Resource URL.
            'resources/models/spaceshipv2.gltf',
            // Called when the resource is loaded.
            function ( gltf ) {
				// Spawn ship.
                SHIP.model = gltf.scene.children[0];
                SHIP.model.scale.set(SHIP_SCALE, SHIP_SCALE, SHIP_SCALE);
                GAME.scene.add(SHIP.model);
                // TODO:
                // Starts generating planets.
            },
            // Called when loading is in progresses.
            function ( percent ) {
                // TODO:
                // Send values to loading Screen.
                console.log( (( percent.loaded / percent.total * 100 ) * 0.9) + '% loaded...' );
            },
            // Called when loading has errors.
            function ( error ) {
                // TODO:
                // This should bring us back to the main menu.
                console.log( 'An error happened while loading resources. ' +  error);
                
            }
        );
	}
    calc_oscilation() {
        this.oscilation += 0.05 + (this.frontSpeed + this.backSpeed) * 1000 + (this.leftSpeed + this.rightSpeed) * 500;
    }

    addMovementParticles() {
        // Adds Rocket Particle
        this.particles.unshift(
            new THREE.Mesh(
                new THREE.SphereGeometry( 0.01, 8, 8 ),
                new THREE.MeshBasicMaterial(
                    {
                        color: 16358912 - (this.frontSpeed * 100),
                        side: THREE.DoubleSide
                    }
                )
            )
        );

        // TODO: por magic values como constantes
        this.particles[0].position.set(this.model.position.x, this.model.position.y, this.model.position.z);
        this.particles[0].rotation.set(this.model.rotation.x, this.model.rotation.y + (this.leftSpeed + this.rightSpeed) * 8, this.model.rotation.z);
        this.particles[0].scale.set(3 + this.frontSpeed * 20, 3 + this.frontSpeed * 20, this.frontSpeed * -150);
        GAME.scene.add(this.particles[0]);
    }

    removeMovementParticles() {
        if ((this.particles.length > 1000) || (this.frontSpeed >= -0.001))
            GAME.scene.remove(this.particles.pop());
    }

    // C -> Controller
    // We need it to see which button is pressed and do the corresponding math to the Ship's attribute
    actuators(c) {
        // Forward movement 'W' key
        if (c.key_w == true) {
            if (this.frontSpeed > -0.3)
                this.frontSpeed  -= 0.001 + this.frontSpeed * 0.005;
            this.addMovementParticles();
        } else {
            if (this.frontSpeed < 0)
                this.frontSpeed /= 1.05;
        }

        // Left movement 'A' Key
        if (c.key_a == true) {
			if (this.leftSpeed > -0.05)
				this.leftSpeed = this.leftSpeed * 1.01 - 0.0010;
		} else {
			if (this.leftSpeed < 0)
				this.leftSpeed /= 1.05;
        }
        
        // Right movement 'D' key
        if (c.key_d == true) {
			if (this.rightSpeed < 0.05)
				this.rightSpeed = this.rightSpeed * 1.01 + 0.0010;
		} else {
			if (this.rightSpeed > 0)
				this.rightSpeed /= 1.05;
        }
        
        // Back movement 'S' key
        if (c.key_s == true) {
			if (this.backSpeed < 0.05)
				this.backSpeed = this.backSpeed * 1.01 + 0.001;
				
		} else {
			if (this.backSpeed > 0)
				this.backSpeed /= 1.05;
        }
    }

    applyMovementToCamera() {
        this.camera.translateZ(this.frontSpeed  + this.backSpeed); // Front and Back.
		this.camera.translateX(this.leftSpeed   + this.rightSpeed); // Left and Right.
		this.camera.fov = 90 + (this.frontSpeed + this.backSpeed) * -150;
		this.camera.updateProjectionMatrix();
    }

    update(shipVector) {
        // FIXME:
        // o 0.80 e o 0.20 sao percentagens de "Sensibilidade" Definem o quao depressa a nave se aproxima do centro do ecra.
        // 500, 200 e 2 e o q? INTUICAO. basicamente ajustam a velocidade de oscilacao. um é baseline e o outro varia com a velocidade (assim quanto + despressa mais oscila)
        this.model.position.x = ((0.80 + this.frontSpeed * 2) * this.model.position.x + (0.2 - this.frontSpeed * 2) * shipVector.x) + Math.cos(this.oscilation)/(500 + (this.frontSpeed*200));
		this.model.position.y = ((0.80 + this.frontSpeed * 2) * this.model.position.y + (0.2 - this.frontSpeed * 2) * shipVector.y) + Math.sin(this.oscilation)/(500 + (this.frontSpeed*200));
		this.model.position.z = ((0.80 + this.frontSpeed * 2) * this.model.position.z + (0.2 - this.frontSpeed * 2) * shipVector.z);

        this.model.up.set((this.leftSpeed + this.rightSpeed) * 30 * Math.cos(GAME.controller.yaw), GAME.controller.shipUp, (this.leftSpeed + this.rightSpeed) * 30 * -Math.sin(GAME.controller.yaw));

        // Make this.model look at the front vector.
        this.model.lookAt(this.pointLook.getWorldPosition( new THREE.Vector3() ));
        
        // Remove Rocket Particles.
        this.removeMovementParticles();
        this.updateBullets();
    }

    fireBullets(event, position = SHIP.model.position, rotation = SHIP.model.rotation) {
        // TODO: Verify that this is fixed

        var pewpew = document.getElementById('pewAudio')
        pewpew.currentTime = 0;
        pewpew.play();
        
        SHIP.bullets.unshift(
            new THREE.Mesh(
                new THREE.SphereGeometry(0.07, 8, 8),
                new THREE.MeshBasicMaterial(
                    {
                        color: 0x11ff11,
                        side: THREE.DoubleSide
                    }
                )
            )
        );

        SHIP.bullets[0].position.set(position.x, position.y, position.z);
        SHIP.bullets[0].rotation.set(rotation.x, rotation.y, rotation.z);


        GAME.scene.add(SHIP.bullets[0]);
        // TODO: check if this works as intended
    }

    updateBullets() {
        for(var i = 0; i < this.bullets.length; i++)
            this.bullets[i].translateZ(1);
    }
}
