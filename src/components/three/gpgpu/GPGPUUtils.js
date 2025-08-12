import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';



export default class GPGPUUtils {
    constructor(mesh, size) {

        this.size = size;

        this.number = this.size * this.size;

        this.mesh = mesh;

        this.sampler = new MeshSurfaceSampler(this.mesh).build();



        this.setupDataFromMesh();
        this.setupVelocitiesData();
    }


    setupDataFromMesh() {
        const data = new Float32Array(4 * this.number);
        const positions = new Float32Array(3 * this.number);
        const uvs = new Float32Array(2 * this.number);

        this._position = new THREE.Vector3();

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const index = i * this.size + j;

                // Pick random point from Mesh

                this.sampler.sample(this._position);


                // Setup for DataTexture

                data[4 * index] = this._position.x;
                data[4 * index + 1] = this._position.y;
                data[4 * index + 2] = this._position.z;


                // Setup positions attribute for geometry

                positions[3 * index] = this._position.x;
                positions[3 * index + 1] = this._position.y;
                positions[3 * index + 2] = this._position.z;



                // Setup UV attribute for geometry

                uvs[2 * index] = j / (this.size - 1);
                uvs[2 * index + 1] = i / (this.size - 1);
            }
        }


        const positionTexture = new THREE.DataTexture(data, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);

        positionTexture.needsUpdate = true;

        this.positions = positions;

        this.positionTexture = positionTexture;

        this.uvs = uvs;
    }


    setupVelocitiesData() {
        const data = new Float32Array(4 * this.number);

        data.fill(0);

        let velocityTexture = new THREE.DataTexture(data, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);

        velocityTexture.needsUpdate = true;

        this.velocityTexture = velocityTexture
    }


    getPositions() {
        return this.positions;
    }


    getUVs() {
        return this.uvs;
    }


    getPositionTexture() {
        return this.positionTexture;
    }


    getVelocityTexture() {
        return this.velocityTexture;
    }
}