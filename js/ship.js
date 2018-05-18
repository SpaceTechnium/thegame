//================================================
// Ship.js
//================================================
const SHIP_SCALE   = 0.2;
const SHIP_HEIGHT  = -0.75;
const SHIP_PLACE_Z = -3.75;
const SHIP_LOOK_Z  = -10.5;

const SHIP_OSCILATION_BASEJUMP       = 0.1;
const SHIP_OSCILATION_FRONT_FACTOR   = 10;
const SHIP_OSCILATION_LATERAL_FACTOR = 5;

const ROCKET_ORANGE_COLOR         = 16358912;
const ROCKET_COLOR_CHANGE_FACTOR  = 100;
const ROCKET_PARTICLE_BASE_SCALE  = 0.01;
const ROCKET_PARTICLE_PRECISION   = 8;
const ROCKET_PARTICLE_SCALE       = 30;
const ROCKET_PARTICLE_SCALE_SPEED = 100;
const ROCKET_PARTICLE_MAX         = 100;
const ROCKET_PARTICLE_MIN_SPEED   = 0.001;

const SHIP_BASE_ACCELERATION = 0.001;
const SHIP_ACCELERATION      = 1.01;
const SHIP_FRONT_FRICTION    = 0.005;
const SHIP_RETARDATION       = 1.05;
const SHIP_MAX_FRONT_SPEED   = 0.3;
const SHIP_MAX_ELSE_SPEED    = 0.05;

const CAMERA_BASE_FOV         = 90;
const CAMERA_FOV_SPEED_FACTOR = 150;

const SHIP_FOLLOW_ORIGIN_PERCENT    = 0.97;
const SHIP_FOLLOW_DEST_PERCENT      = 0.03;
const SHIP_FOLLOW_SPEED_FACTOR      = 4;
const SHIP_FOLLOW_OSCILATION_BASE   = 2;
const SHIP_FOLLOW_OSCILATION_FACTOR = 0.001;
const SHIP_FOLLOW_UP_FACTOR         = 30;

const BULLET_SCALE     = 0.7;
const BULLET_PRECISION = 8;
const BULLET_COLOR     = 0x11ff11;

class Ship {
    constructor(name) {
        // Attributes
        this.name       = name;
        this.damage     = 1;
        this.score      = 0;
        this.oscilation = 0;
        this.frontSpeed = -0.8;
        this.leftSpeed  = 0;
        this.backSpeed  = 0;
        this.rightSpeed = 0;
        this.particles  = [];
        this.bullets    = [];
		this.model      = null;
		this.scene      = null;
		this.camera     = null;

        // Movement Helpers
        this.pointPlace = new THREE.Mesh();
        this.pointPlace.position.set(0, SHIP_HEIGHT, SHIP_PLACE_Z);
        this.pointPlace.visible = false;

        this.pointLook = new THREE.Mesh();
        this.pointLook.position.set(0, SHIP_HEIGHT, SHIP_LOOK_Z);
        this.pointLook.visible = false;
    }
    
    setName ( name ) {
        this.name = name;
    }
	
	refToScene (scene, camera) {
        this.scene = scene;
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
            },
            // Called when loading is in progresses.
            function ( percent ) {
                // TODO: Loading Screen.
                console.log( (( percent.loaded / percent.total * 100 )) + '% loaded...' );
            },
            // Called when loading has errors.
            function ( error ) {
                // TODO: This should bring us back to the main menu.
                SCREEN.errorScreen( 'An error happened while loading resources. ' +  error);
            }
        );
	}
    calc_oscilation() {
        this.oscilation += SHIP_OSCILATION_BASEJUMP + (this.frontSpeed + this.backSpeed) * SHIP_OSCILATION_FRONT_FACTOR + (this.leftSpeed + this.rightSpeed) * SHIP_OSCILATION_LATERAL_FACTOR;
    }

    addMovementParticles() {
        // Adds Rocket Particle
        this.particles.unshift(
            new THREE.Mesh(
                new THREE.SphereGeometry( ROCKET_PARTICLE_BASE_SCALE, ROCKET_PARTICLE_PRECISION, ROCKET_PARTICLE_PRECISION ),
                new THREE.MeshBasicMaterial(
                    {
                        color: ROCKET_ORANGE_COLOR - (this.frontSpeed * ROCKET_COLOR_CHANGE_FACTOR),
                    }
                )
            )
        );

        // TODO: por magic values como constantes
        this.particles[0].position.set(this.model.position.x, this.model.position.y, this.model.position.z);
        this.particles[0].rotation.set(this.model.rotation.x, this.model.rotation.y + (this.leftSpeed + this.rightSpeed), this.model.rotation.z);
        this.particles[0].scale.set(ROCKET_PARTICLE_SCALE + this.frontSpeed * ROCKET_PARTICLE_SCALE_SPEED, ROCKET_PARTICLE_SCALE + this.frontSpeed * ROCKET_PARTICLE_SCALE_SPEED, -this.frontSpeed * ROCKET_PARTICLE_SCALE_SPEED);
        GAME.scene.add(this.particles[0]);
    }

    removeMovementParticles() {
        if ((this.particles.length > ROCKET_PARTICLE_MAX) || (this.frontSpeed >= -ROCKET_PARTICLE_MIN_SPEED))
            GAME.scene.remove(this.particles.pop());
    }

    // C -> Controller
    // We need it to see which button is pressed and do the corresponding math to the Ship's attribute
    actuators(c) {
        // Forward movement 'W' key
        if (c.key_w == true) {
            if (this.frontSpeed > -SHIP_MAX_FRONT_SPEED)
                this.frontSpeed  -= SHIP_BASE_ACCELERATION + this.frontSpeed * SHIP_FRONT_FRICTION;
            this.addMovementParticles();
        } else {
            if (this.frontSpeed < 0)
                this.frontSpeed /= SHIP_RETARDATION;
        }

        // Left movement 'A' Key
        if (c.key_a == true) {
			if (this.leftSpeed > -SHIP_MAX_ELSE_SPEED)
				this.leftSpeed = this.leftSpeed * SHIP_ACCELERATION - SHIP_BASE_ACCELERATION;
		} else {
			if (this.leftSpeed < 0)
				this.leftSpeed /= SHIP_RETARDATION;
        }
        
        // Right movement 'D' key
        if (c.key_d == true) {
			if (this.rightSpeed < SHIP_MAX_ELSE_SPEED)
				this.rightSpeed = this.rightSpeed * SHIP_ACCELERATION + SHIP_BASE_ACCELERATION;
		} else {
			if (this.rightSpeed > 0)
				this.rightSpeed /= SHIP_RETARDATION;
        }
        
        // Back movement 'S' key
        if (c.key_s == true) {
			if (this.backSpeed < SHIP_MAX_ELSE_SPEED)
				this.backSpeed = this.backSpeed * SHIP_ACCELERATION + SHIP_BASE_ACCELERATION;
				
		} else {
			if (this.backSpeed > 0)
				this.backSpeed /= SHIP_RETARDATION;
        }
    }

    applyMovementToCamera() {
        this.camera.translateZ(this.frontSpeed  + this.backSpeed); // Front and Back.
		this.camera.translateX(this.leftSpeed   + this.rightSpeed); // Left and Right.
		this.camera.fov = CAMERA_BASE_FOV - (this.frontSpeed + this.backSpeed) * CAMERA_FOV_SPEED_FACTOR;
		this.camera.updateProjectionMatrix();
    }

    update(shipVector) {
        this.model.position.x = ((SHIP_FOLLOW_ORIGIN_PERCENT + this.frontSpeed / SHIP_FOLLOW_SPEED_FACTOR) * this.model.position.x + (SHIP_FOLLOW_DEST_PERCENT - this.frontSpeed / SHIP_FOLLOW_SPEED_FACTOR) * shipVector.x) + Math.cos(this.oscilation)*(SHIP_FOLLOW_OSCILATION_BASE + (this.frontSpeed)) * SHIP_FOLLOW_OSCILATION_FACTOR;
		this.model.position.y = ((SHIP_FOLLOW_ORIGIN_PERCENT + this.frontSpeed / SHIP_FOLLOW_SPEED_FACTOR) * this.model.position.y + (SHIP_FOLLOW_DEST_PERCENT - this.frontSpeed / SHIP_FOLLOW_SPEED_FACTOR) * shipVector.y) + Math.sin(this.oscilation)*(SHIP_FOLLOW_OSCILATION_BASE + (this.frontSpeed)) * SHIP_FOLLOW_OSCILATION_FACTOR;
		this.model.position.z = ((SHIP_FOLLOW_ORIGIN_PERCENT + this.frontSpeed / SHIP_FOLLOW_SPEED_FACTOR) * this.model.position.z + (SHIP_FOLLOW_DEST_PERCENT - this.frontSpeed / SHIP_FOLLOW_SPEED_FACTOR) * shipVector.z);

        this.model.up.set((this.leftSpeed + this.rightSpeed) * SHIP_FOLLOW_UP_FACTOR * Math.cos(GAME.controller.yaw), GAME.controller.shipUp, (this.leftSpeed + this.rightSpeed) * SHIP_FOLLOW_UP_FACTOR * -Math.sin(GAME.controller.yaw));

        // Make this.model look at the front vector.
        this.model.lookAt(this.pointLook.getWorldPosition( new THREE.Vector3() ));
        
        // Remove Rocket Particles.
        this.removeMovementParticles();
        // connection.send(JSON.stringify({
        //     type : "whereami",
        //     ship : [ {
        //         pos_x : this.model.position.x,
        //         pos_y : this.model.position.y,
        //         pos_z : this.model.position.z,
        //         rot_x : this.model.rotation.x,
        //         rot_y : this.model.rotation.y,
        //         rot_z : this.model.rotation.z
        //         }
        //     ]
        // }));
    }

    fireBullets(event, position = SHIP.model.position, rotation = SHIP.model.rotation) {
        var pewpew = document.getElementById('pewAudio')
        pewpew.currentTime = 0;
        pewpew.play();
        
        // OFFLINE BULLET FIRE.
        // SHIP.bullets.unshift(
        //     new THREE.Mesh(
        //         new THREE.SphereGeometry(BULLET_SCALE, BULLET_PRECISION, BULLET_PRECISION),
        //         new THREE.MeshBasicMaterial(
        //             {
        //                 color: BULLET_COLOR,
        //             }
        //         )
        //     )
        // );

        // SHIP.bullets[0].position.set(position.x, position.y, position.z);
        // SHIP.bullets[0].rotation.set(rotation.x, rotation.y, rotation.z);

        // GAME.scene.add(SHIP.bullets[0]);

        // ONLINE BULLET FIRE.

        connection.send(JSON.stringify({
            type : "newBullet",
            bullet : [ {
                pos_x : position.x,
                pos_y : position.y,
                pos_z : position.z,
                rot_x : rotation.x,
                rot_y : rotation.y,
                rot_z : rotation.z
                }
            ]
        }));
    }

    updateBullets() {
        // TODO: Change to server dependent bullets.
        for(var i = 0; i < this.bullets.length; i++)
            this.bullets[i].translateZ(1);
    }
}
