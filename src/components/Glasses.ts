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
      this.scene.add(this.model);
    }, undefined, (error) => {
      console.error('Error loading glasses model:', error);
    });
  }
}
