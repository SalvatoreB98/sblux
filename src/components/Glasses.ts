import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

export class Glasses {
  private model: THREE.Object3D | null = null;

  constructor(private scene: THREE.Scene) {
    this.loadModel();
    this.colorsControls();
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
          if (child.name.includes("Glasses_Glasses")) {  // Modify the frame material
            child.material = new THREE.MeshStandardMaterial({
              color: 0x000000,  // Black frame
              metalness: 0.9,
              roughness: 0.1
            });
          }
        }
      });

      this.scene.add(this.model);
    }, undefined, (error) => {
      console.error('Error loading glasses model:', error);
    });
  }
  colorsControls() {
    document.querySelectorAll('.color-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const color = (event.target as HTMLElement).getAttribute('data-color');
        if (color) {
          this.model?.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name.includes("Glasses_Glasses")) {
              child.material.color.set(color);
            }
          });
        }
      });
    });
  }
}
