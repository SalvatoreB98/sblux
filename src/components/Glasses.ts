import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export class Glasses {
  private model: THREE.Object3D | null = null;

  constructor(private scene: THREE.Scene) {
    this.loadModel();
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load('/models/glasses.glb', (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(1, 1, 1);
        
        console.log(this.model); // Debugging: Check object structure in console
        
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              console.log(child)
                if (child.name.includes("Glasses2")) {  // Modify the frame material
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x000000,  // Black frame
                        metalness: 0.6,
                        roughness: 0.2
                    });
                }
            }
        });

        this.scene.add(this.model);
    }, undefined, (error) => {
        console.error('Error loading glasses model:', error);
    });
}
}
