import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';



export default class GPGPUEvents {

    constructor(mouse, camera, mesh, uniforms) {
        this.camera = camera;
        this.mouse = mouse;
        this.geometry = mesh.geometry;
        this.uniforms = uniforms;
        this.mesh = mesh;


        // Mouse

        this.mouseSpeed = 0;


        this.init();
    }



    init() {
        this.setupMouse();
    }



    setupMouse() {
        THREE.Mesh.prototype.raycast = acceleratedRaycast;

        this.geometry.computeBoundsTree?.();
        this.geometry.boundsTree = new MeshBVH(this.geometry);

        this.raycaster = new THREE.Raycaster();
        this.raycaster.firstHitOnly = true;
        // this.raycasterMesh = new THREE.Mesh(
        //     this.geometry,
        //     new THREE.MeshBasicMaterial()
        // );

        this.raycasterMesh = new THREE.Mesh(
            this.geometry,
            new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, wireframe: false })
        );


        // this.mouse.on('mousemove', (cursorPosition) => {
        //     this.raycaster.setFromCamera(cursorPosition, this.camera);

        //     const intersects = this.raycaster.intersectObjects([this.raycasterMesh]);

        //     if (intersects.length > 0) {
        //         const worldPoint = intersects[0].point.clone();

        //         this.mouseSpeed = 1;

        //         this.uniforms.velocityUniforms.uMouse.value = worldPoint;
        //     }
        // });

        this.mouse.addEventListener('mousemove', (cursorPosition) => {
            this.raycaster.setFromCamera(cursorPosition, this.camera);

            // console.log("Mouse position:", cursorPosition);

            const intersects = this.raycaster.intersectObjects([this.raycasterMesh]);

            // console.log("Intersects found:", intersects.length);

            

            if (intersects.length > 0) {
                const worldPoint = intersects[0].point.clone();
                this.mouseSpeed = 1;
                this.uniforms.velocityUniforms.uMouse.value = worldPoint;

                // console.log("Mouse over PHX at:", worldPoint);
                // console.log("Intersects:", intersects.length, intersects);

            }
        });
    }


    update() {
        if (!this.mouse.cursorPosition) return; // Don't update if cursorPosition is undefined

        this.mouseSpeed *= 0.85;

        if (this.uniforms.velocityUniforms.uMouseSpeed) this.uniforms.velocityUniforms.uMouseSpeed.value = this.mouseSpeed;
    }
}