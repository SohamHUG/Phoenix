import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { MotionBloomPass } from './MotionBloomPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Vector2 } from 'three';

export default class PostProcessing {

    static instance;

    static getInstance(args) {
        if (!PostProcessing.instance) {
            PostProcessing.instance = new PostProcessing(args);
        }

        return PostProcessing.instance;
    }

    constructor({ renderer, scene, camera, sizes, debug }) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        this.sizes = sizes;
        this.debug = debug;


        this.params = {
            threshold: 0.058,
            strength: 1.2,
            radius: 0,
            directionX: 1.5,
            directionY: 1,
        };


        // Debug

        if (this.debug.active) this.debugFolder = this.debug.gui.addFolder('Post Processing');

        this.init();
    }


    init() {
        this.setupEffect();
        this.setupDebug();
    }


    setupEffect() {
        const renderScene = new RenderPass(this.scene, this.camera.target);

        this.bloomPass = new MotionBloomPass(new Vector2(this.sizes.width, this.sizes.height), 1.5, 0.4, 0.85);
        this.bloomPass.threshold = this.params.threshold;
        this.bloomPass.strength = this.params.strength;
        this.bloomPass.radius = this.params.radius;

        const outputPass = new OutputPass();

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(this.bloomPass);
        this.composer.addPass(outputPass);
    }


    setupDebug() {
        if (this.debug.active) {
            const bloomFolder = this.debugFolder.addFolder('bloom');

            bloomFolder.add(this.params, 'threshold', 0.0, 1.0).onChange((value) => {
                this.bloomPass.threshold = Number(value);
            });

            bloomFolder.add(this.params, 'strength', 0.0, 3.0).onChange((value) => {
                this.bloomPass.strength = Number(value);
            });

            bloomFolder.add(this.params, 'radius', 0.0, 1.0).step(0.01).onChange((value) => {
                this.bloomPass.radius = Number(value);
            });

            bloomFolder.add(this.params, 'directionX', 0.0, 10.0).step(0.01).onChange((value) => {
                this.bloomPass.BlurDirectionX.x = Number(value);
            });

            bloomFolder.add(this.params, 'directionY', 0.0, 10.0).step(0.01).onChange((value) => {
                this.bloomPass.BlurDirectionX.x = Number(value);
            });
        }
    }


    resize() {
        if (this.composer) {
            this.composer.setSize(this.sizes.width, this.sizes.height);
            this.composer.setPixelRatio(this.sizes.pixelRatio);
        }
    }


    update() {
        if (this.composer) this.composer.render();
    }


    dispose() {
        if (this.composer) this.composer.dispose();
    }
}