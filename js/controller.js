// ========================================================
// Controller.js
//=========================================================
// Solar system generation constants
const HALF_PI   = Math.PI / 2;
const DOUBLE_PI = Math.PI * 2;
const MOUSE_MOVEMENT_FACTOR = 0.002;
// Control KEYCODE
const KEY_W = 87;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;

class Controller {
    constructor(camera, ppc) {
        this.camera = camera;
        this.ppc    = ppc;

        this.yaw    = 0;
        this.pitch  = 0;
        this.shipUp = -1;
        this.yawMatrix    = new THREE.Matrix4();
        this.pitchMatrix  = new THREE.Matrix4();
        this.rotateMatrix = new THREE.Matrix4();

        this.key_w = false;
        this.key_a = false;
        this.key_s = false;
        this.key_d = false;
    }

    mouseMove(e) {
        // Updates yaw and pitch values according to mouse movement.
        if (Math.cos(GAME.controller.pitch) >= 0) {
            GAME.controller.yaw = GAME.controller.yaw - e.movementX * MOUSE_MOVEMENT_FACTOR;
            this.shipUp = 1;
        } else {
            GAME.controller.yaw = GAME.controller.yaw + e.movementX * MOUSE_MOVEMENT_FACTOR;
            this.shipUp = -1; 
        }

        GAME.controller.pitch = GAME.controller.pitch + e.movementY * -MOUSE_MOVEMENT_FACTOR;

		// Creates identity matrices.
        GAME.controller.pitchMatrix.identity();
        GAME.controller.yawMatrix.identity();

        // Performs rotation on specific axis to pitch and yaw matrices.
        GAME.controller.yawMatrix.makeRotationY(GAME.controller.yaw);
        GAME.controller.pitchMatrix.makeRotationX(GAME.controller.pitch);

        // Multiplies yaw and pitch matrices.
        GAME.controller.rotateMatrix.multiplyMatrices(GAME.controller.yawMatrix, GAME.controller.pitchMatrix);

        // Rotates the camera.
        GAME.controller.camera.setRotationFromMatrix(GAME.controller.rotateMatrix);
    }

    keyDown(e) {
        if (e.keyCode == KEY_W) {
            GAME.controller.key_w = true;
        }
        if (e.keyCode == KEY_A) {
            GAME.controller.key_a = true;
        }
        if (e.keyCode == KEY_S) {
            GAME.controller.key_s = true;
        }
        if (e.keyCode == KEY_D) {
            GAME.controller.key_d = true;
        }
    }

    keyUp(e) {
        if (e.keyCode == KEY_W) {
            GAME.controller.key_w = false;
        }
        if (e.keyCode == KEY_A) {
            GAME.controller.key_a = false;
        }
        if (e.keyCode == KEY_S) {
            GAME.controller.key_s = false;
        }
        if (e.keyCode == KEY_D) {
            GAME.controller.key_d = false;
        }
    }

    lockChange() {
        // Here mofo
        if (document.pointerLockElement === document.body) {
            console.log('The pointer lock is now locked');
            document.addEventListener   ("mousemove", GAME.controller.mouseMove, false);
            document.addEventListener   ("mousedown", GAME.ship.fire, false);
            document.addEventListener   ("keydown",   GAME.controller.keyDown);
            document.addEventListener   ("keyup",     GAME.controller.keyUp);

            document.removeEventListener("mousedown", GAME.controller.activatePointerLock, false);
        } else {
            console.log('The pointer lock is now unlocked');  
			document.addEventListener   ("mousedown", GAME.controller.activatePointerLock, false);

            document.removeEventListener("mousemove", GAME.controller.mouseMove, false);
            document.removeEventListener("keydown",   GAME.controller.keyDown);
            document.removeEventListener("keyup",     GAME.controller.keyUp);
        }
    }
    
    activatePointerLock() {
        document.body.requestPointerLock();
    }
}
