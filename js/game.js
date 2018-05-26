//================================================
// Game.js
//================================================

const CAMERA_FOV = 90;
const CAMERA_NEAR_FRUSTUM = 0.1;
const CAMERA_FAR_FRUSTUM  = 3000;
const CAMERA_POS_Z	 	= 50;
const CAMERA_NEAR_CLIP	= 0.001;

const AMBIENT_LIGHT_COLOR = 0xffffff;
const AMBIENT_LIGHT_INTENSITY = 0.72;

const SCENE_BG_COLOR      = "rgb(2, 0, 15)";

class Technium {
    constructor(seed) {
        // Scene
        this.scene    = new THREE.Scene();
        this.scene.background = new THREE.Color(SCENE_BG_COLOR);

        // Camera
        this.camera   = new THREE.PerspectiveCamera(
            CAMERA_FOV,
            window.innerWidth/window.innerHeight,
            CAMERA_NEAR_FRUSTUM,
            CAMERA_FAR_FRUSTUM
        );
        this.scene.add(this.camera);
        this.camera.nearClip = CAMERA_NEAR_CLIP;
        this.camera.position.z = CAMERA_POS_Z;

        // Renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.autoClear = false;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Three.js Composer
        this.ppc = new PPC(this.renderer, this.scene, this.camera);
        
        // Creates soft ambient light, that illuminates everything uniformly.
        var ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_COLOR,
            AMBIENT_LIGHT_INTENSITY
        );
        this.scene.add(ambientLight);

        // This randomizer is essential for universally equal universes between different machines.
        var randomizer = new MersenneTwister(seed);

        // Create Solar systems
        this.universe = new Universe();
        this.universe.generate(randomizer);
        this.universe.spawn(this.scene, randomizer);

        // Creates Ship object & model
        this.ship = null;

        // Creates Players and Bullets Array.
        this.players = [];
        this.bullets = [];

        // Controls
        this.controller = new Controller(this.camera, this.ppc);

        // Determine if browser supports pointer lock API.
        var hasPointerLock = 'pointerLockElement' in document;
        if(!hasPointerLock) {
            Screen.errorScreen("Your browser doesn't seem to support Pointer Lock API");
            throw "Your browser doesn't seem to support Pointer Lock API";
        }
        
        // Lock Mouse.
        this.controller.activatePointerLock();
        
        document.addEventListener('pointerlockchange', this.controller.lockChange, false);
        
        // Lock Mouse.
        this.controller.activatePointerLock();
    }

    addShip(ship) {
        this.ship = ship;
    }

    deletePlayers( players ) {
        for (var i = 0; i < players.length; i++) {
            for (var j = 0; j < this.players.length; j++) {
                if (this.players[j].name == players[i].name) {
                    this.scene.remove(this.players.splice(j, 1));
                    if (players[i].name == SHIP.name) {
                        // TODO: Create Lost Screen.
                        Screen.errorScreen("You perished! It was a good run!");
                    }
                    break;
                }
            }
        }
    }

    updatePlayers( players ) {
        var playerFound = false;
        for (var i = 0; i < players.length; i++) {
            for (var j = 0; j < this.players.length; j++) {
                if (this.players[j].userData.name == players[i].name) {
                    this.players[j].position.x = players[i].pos_x;
                    this.players[j].position.y = players[i].pos_y;
                    this.players[j].position.z = players[i].pos_z;
                    this.players[j].rotation.x = players[i].rot_x;
                    this.players[j].rotation.y = players[i].rot_y;
                    this.players[j].rotation.z = players[i].rot_z;

                    this.players[j].userData.score = players[i].score;
                    this.players[j].userData.shields = players[i].shields;
                    playerFound = true;
                    break;
                }
            }
            if (playerFound == true)
                break;
            
            console.log("a criar jogador");
            console.log(this.players);
            var newPlayer = SHIP.model.clone();
            newPlayer.position.x = players[i].pos_x;
            newPlayer.position.y = players[i].pos_y;
            newPlayer.position.z = players[i].pos_z;
            newPlayer.rotation.x = players[i].rot_x;
            newPlayer.rotation.y = players[i].rot_y;
            newPlayer.rotation.z = players[i].rot_z;

            newPlayer.userData = { 
                name    : players[i].name,
                score   : players[i].score,
                shields : players[i].shields,
            };

            this.players.unshift(newPlayer);
            if (newPlayer.userData.name != SHIP.name)
                this.scene.add(newPlayer);
            playerFound = false;
        }
    }

    deleteBullets( bullets ) {
        for (var i = 0; i < bullets.length; i++) {
            for (var j = 0; j < this.bullets.length; j++) {
                if (this.bullets[j].name == bullets[i].name) {
                    this.scene.remove(this.bullets.splice(j, 1));
                    break;
                }
            }
        }
    }

    updateBullets( bullets ) {
        var bulletFound = false;
        for (var i = 0; i < bullets.length; i++) {
            for (var j = 0; j < this.bullets.length; j++) {
                if (this.bullets[j].userData.id == bullets[i].id) {
                    this.bullets[j].position.x = bullets[i].pos_x;
                    this.bullets[j].position.y = bullets[i].pos_y;
                    this.bullets[j].position.z = bullets[i].pos_z;
                    bulletFound = true;
                    break;
                }
            }
            if (bulletFound == true)
                break;

            var newBullet = new THREE.Mesh(
                new THREE.SphereGeometry(BULLET_SCALE, BULLET_PRECISION, BULLET_PRECISION),
                new THREE.MeshBasicMaterial(
                    {
                        color: BULLET_COLOR,
                    }
                )
            );
            newBullet.position.x = bullets[i].pos_x;
            newBullet.position.y = bullets[i].pos_y;
            newBullet.position.z = bullets[i].pos_z;
            newBullet.userData = { 
                id    : bullets[i].id,
            };

            this.bullets.unshift(newBullet);
            this.scene.add(newBullet);
            bulletFound = false;
        }
    }

    // Start == animate function
    animate_loop() {

        var shipVector = this.ship.pointPlace.getWorldPosition(new THREE.Vector3());
        this.ship.calc_oscilation();
        this.ship.actuators(this.controller);
        this.ship.applyMovementToCamera();
        this.ship.update(shipVector);

        this.ppc.render();
    }
}
