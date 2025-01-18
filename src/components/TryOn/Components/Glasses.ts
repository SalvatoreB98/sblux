import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Glasses {
  model: THREE.Object3D | null = null;

  constructor(scene: THREE.Scene) {
    const loader = new GLTFLoader();
    loader.load(
      '/models/glasses.glb', // Replace with the actual model path
      (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(0.1, 0.1, 0.1);
        this.model.position.set(0, 0, 1);
        scene.add(this.model);
      },
      undefined,
      (error) => console.error('Error loading glasses model:', error)
    );
  }

  updatePosition(facePosition: THREE.Vector3) {
    if (this.model) {
      this.model.position.lerp(facePosition, 0.5); // Smooth transition
    } else {
      console.error('Glasses model is not initialized yet');
    }
  }
}
