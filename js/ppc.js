//================================================
// PPC.js
//================================================

class PPC { // Post Processing Composer
    constructor(renderer, scene, camera) {
        this.composer = new THREE.EffectComposer(renderer);

        var sceneRenderModel = new THREE.RenderPass(scene, camera);
        // Effects.
        // Starts damage effect on screen.
        // TODO: LESSEN THE EFFECT.
        this.glitchPass = new THREE.GlitchPass();
        this.glitchPass.goWild = false;
        var effectBloom = new THREE.BloomPass(0.8, 25, 4, 512);
        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;

        this.composer.addPass(sceneRenderModel);
        this.composer.addPass(this.glitchPass);
        this.composer.addPass(effectBloom);
        this.composer.addPass(effectCopy);
    }

    glitchWildSwitch() {
        if (GAME.ppc.glitchPass.goWild == true) {
            GAME.ppc.glitchPass.goWild = false;
        } else {
            GAME.ppc.glitchPass.goWild = true;
        }
    }

    render() {
        this.composer.render();
    }
}