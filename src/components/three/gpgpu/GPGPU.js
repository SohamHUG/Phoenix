import * as THREE from 'three';
import { simFragmentPositionShader } from './shaders/simFragment';
import { simFragmentVelocityShader } from './shaders/simFragmentVelocity';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import GPGPUUtils from './GPGPUUtils.js';


export default class GPGPU {
	constructor({ size, camera, renderer, mouse, scene, model, sizes }) {
		this.camera = camera; // Camera
		this.renderer = renderer; // Renderer
		this.mouse = mouse; // Our cursor position
		this.scene = scene; // Global scene
		this.sizes = sizes; // window width & height

		this.size = size; // Amount of GPGPU particles
		this.model = model; // Mesh from which we will sample the particles


		this.init();
	}


	init() {
		this.utils = new GPGPUUtils(this.model, this.size);

		this.initGPGPU();
	}


	initGPGPU() {
		this.gpgpuCompute = new GPUComputationRenderer(this.sizes.width, this.sizes.width, this.renderer);

		const positionTexture = this.utils.getPositionTexture();
		const velocityTexture = this.utils.getVelocityTexture();

		this.positionVariable = this.gpgpuCompute.addVariable('uCurrentPosition', simFragmentPositionShader, positionTexture);

		this.velocityVariable = this.gpgpuCompute.addVariable('uCurrentVelocity', simFragmentVelocityShader, velocityTexture);

		this.gpgpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable]);

		this.gpgpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable]);

		this.uniforms = {
			positionUniforms: this.positionVariable.material.uniforms,
			velocityUniforms: this.velocityVariable.material.uniforms
		}

		this.uniforms.velocityUniforms.uMouse = { value: this.mouse.cursorPosition };
		this.uniforms.velocityUniforms.uMouseSpeed = { value: 0 };
		this.uniforms.velocityUniforms.uOriginalPosition = { value: positionTexture };
		this.uniforms.velocityUniforms.uTime = { value: 0 };


		this.gpgpuCompute.init();
	}


	compute(time) {
		this.gpgpuCompute.compute();

		this.uniforms.velocityUniforms.uTime.value = time;
	}
}