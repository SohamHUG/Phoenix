import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';

export default class GPGPUEvents {
    constructor(mouse, camera, mesh, uniforms, transformObject = null) {
        this.camera = camera;
        this.mouse = mouse;
        this.geometry = mesh.geometry;       // géométrie triangles (BVH)
        this.uniforms = uniforms;
        this.mesh = mesh;                    // mesh source
        this.transformObject = transformObject || mesh; // objet qui tourne à l'écran

        this.mouseSpeed = 0;
        this._prevHit = new THREE.Vector3();
        this._hasPrev = false;

        this._tmpQuat = new THREE.Quaternion();
        this._tmpNormal = new THREE.Vector3(0, 0, 1);
        this._tmpPlane = new THREE.Plane();
        this._tmpPoint = new THREE.Vector3();

        this.init();
    }

    init() {
        this.setupMouse();
    }

    setupMouse() {
        THREE.Mesh.prototype.raycast = acceleratedRaycast;

        if (!this.geometry.boundsTree) {
            this.geometry.boundsTree = new MeshBVH(this.geometry);
        }

        this.raycaster = new THREE.Raycaster();
        this.raycaster.firstHitOnly = true;

        // Mesh invisible pour raycast, parenté sous l'objet qui tourne
        this.raycasterMesh = new THREE.Mesh(
            this.geometry,
            new THREE.MeshBasicMaterial({ visible: false })
        );
        this.transformObject.add(this.raycasterMesh);

        if (!this.uniforms.velocityUniforms.uMouse) {
            this.uniforms.velocityUniforms.uMouse = { value: new THREE.Vector3() };
        }

        // Ecoute la souris (en NDC)
        this.mouse.on('mousemove', (cursorPosition) => {
            // 1) Essai raycast BVH
            this.raycaster.setFromCamera(cursorPosition, this.camera);
            let hit = this.raycaster.intersectObject(this.raycasterMesh, true)[0];

            // 2) Fallback : intersection avec un plan orienté comme 'points'
            if (!hit) {
                // normal du plan = (0,0,1) transformée selon l'orientation de l'objet
                this.transformObject.getWorldQuaternion(this._tmpQuat);
                const normal = this._tmpNormal.set(0, 0, 1).applyQuaternion(this._tmpQuat);
                const planePoint = this._tmpPoint.setFromMatrixPosition(this.transformObject.matrixWorld);
                this._tmpPlane.setFromNormalAndCoplanarPoint(normal, planePoint);

                const intersect = new THREE.Vector3();
                if (this.raycaster.ray.intersectPlane(this._tmpPlane, intersect)) {
                    hit = { point: intersect };
                }
            }

            if (hit) {
                const wp = hit.point;

                // vitesse (distance frame à frame)
                if (this._hasPrev) {
                    this.mouseSpeed = THREE.MathUtils.clamp(this._prevHit.distanceTo(wp) * 20.0, 0, 1);
                } else {
                    this._hasPrev = true;
                }
                this._prevHit.copy(wp);

                // alimente le shader (monde)
                this.uniforms.velocityUniforms.uMouse.value.copy(wp);
            } else {
                // si rien, on ralentit
                this.mouseSpeed *= 0.9;
            }
        });
    }

    update() {
        // amorti
        this.mouseSpeed *= 0.85;
        if (this.uniforms.velocityUniforms.uMouseSpeed) {
            this.uniforms.velocityUniforms.uMouseSpeed.value = this.mouseSpeed;
        }
    }
}
