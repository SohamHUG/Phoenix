import * as THREE from 'three';
import GPGPUUtils from './utils';

import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
  

export default class GPGPU {
	constructor({ size, camera, renderer, mouse, scene, model, sizes }) {
		this.camera = camera; // Camera
		this.renderer = renderer; // Renderer
		this.mouse = mouse; // Mouse, our cursor position
		this.scene = scene; // Global scene
		this.sizes = sizes; // Sizes of the scene, canvas, pixel ratio
		this.size = size; // Amount of GPGPU particles, ex. 1500
		this.model = model; // Mesh from which we will sample the particles
		
		
		this.init();
	}
	
	
	init() {
		this.utils = new GPGPUUtils(this.model, this.size); // Setup GPGPUUtils

		this.initGPGPU();
	}
	

	initGPGPU() {
		this.gpgpuCompute = new GPUComputationRenderer(this.sizes.width, this.sizes.width, this.renderer);
	}
}