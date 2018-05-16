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
const MERSENNE_TWISTER_SEED = 42;

class Technium {
    constructor(ship) {
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

        // Threejs Composer
        this.ppc = new PPC(this.renderer, this.scene, this.camera);
        
        // Creates soft ambient light, that illuminates everything uniformly.
        var ambientLight = new THREE.AmbientLight(
            AMBIENT_LIGHT_COLOR,
            AMBIENT_LIGHT_INTENSITY
        );
        this.scene.add(ambientLight);

        var randomizer = new MersenneTwister(MERSENNE_TWISTER_SEED);

        // Create Solar systems
        this.universe = new Universe();
        this.universe.generate(randomizer);
        this.universe.spawn(this.scene, randomizer);

        // Creates Ship object & model
        this.ship = ship;

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

    // Start == animate function
    animate_loop() {
        // TODO: Update all solar Systems
        this.universe.update();

        var shipVector = this.ship.pointPlace.getWorldPosition(new THREE.Vector3());
        this.ship.calc_oscilation();
        this.ship.actuators(this.controller);
        this.ship.applyMovementToCamera();
        this.ship.update(shipVector);

        this.ppc.render();
    }
}