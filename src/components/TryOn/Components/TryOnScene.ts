import * as THREE from 'three';
import { VideoPlane } from './VideoPlane';
import { Glasses } from './Glasses';
import { IHeadRotation } from '../../../utils/Interfaces';
import { Sizes } from '../../../utils/Sizes';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

export class TryOnScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  videoPlane: VideoPlane;
  glasses: Glasses;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = null; // 🔹 Make background transparent

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 2);

    // 🔹 Enable transparency in renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0); // 🔹 Transparent clear color

    document.body.appendChild(this.renderer.domElement);

    // Initialize glasses
    this.glasses = new Glasses(this.scene);

    // Ensure the function exists before passing
    this.videoPlane = new VideoPlane(this.scene, this.onFaceDetected.bind(this));
    const sizes = new Sizes(this.camera, this.renderer);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/imgs/hdr3.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
    });
    this.colorsControls();
    this.animate();
  }

  // Define onFaceDetected correctly
  onFaceDetected(position: THREE.Vector3, headPosition: any, rotation: IHeadRotation, scale: number) {
    if (this.glasses) {
      this.glasses.updatePosition(position, headPosition, rotation, scale);
    } else {
      console.error('Glasses instance is missing');
    }
  }
  colorsControls() {
    document.querySelectorAll('.color-btn').forEach((button) => {
      button.addEventListener('click', (event) => {
        const color = (event.target as HTMLElement).getAttribute('data-color');
        if (color) {
          this.glasses.model?.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name.includes("Glasses_Glasses")) {
              child.material.color.set(color);
              child.material.metalness = 0.4;
            }
          });
        }
      });
    });
  }
  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };
}
