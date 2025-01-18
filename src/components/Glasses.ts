import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { Animations } from '../utils/Animations';

export class Glasses {
  private model: THREE.Object3D | null = null;
  modelAnimations: Animations | undefined;

  constructor(private scene: THREE.Scene) {
    this.loadModel();
    this.colorsControls();
    this.animate();
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
      this.modelAnimations = new Animations(this.model);
      this.modelAnimations.fadeIn();
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
              this.modelAnimations?.fadeIn();
              child.material.metalness = 0.4;
              console.log(child.material)
            }
          });
        }
      });
    });
  }
  animate() {
    const animateRotation = () => {
      requestAnimationFrame(animateRotation);
      if (this.model)
        this.model.rotation.y += 0.005;
    }
    animateRotation();
  }
}
