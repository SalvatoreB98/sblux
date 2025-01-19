import * as THREE from 'three';
import { VideoPlane } from './VideoPlane';
import { Glasses } from './Glasses';
import { IHeadRotation } from '../../../utils/Interfaces';

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
      75,
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

    this.animate();
  }

  // Define onFaceDetected correctly
  onFaceDetected(position: THREE.Vector3, rotation: IHeadRotation , scale: number) {
    if (this.glasses) {
      this.glasses.updatePosition(position, rotation, scale);
    } else {
      console.error('Glasses instance is missing');
    }
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };
}
