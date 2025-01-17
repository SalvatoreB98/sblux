import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PerspectiveCamera, WebGLRenderer } from 'three';

export class Controls {
  constructor(camera: PerspectiveCamera, renderer: WebGLRenderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;

    // 🔹 Restrict rotation to Y-axis only
    controls.minPolarAngle = Math.PI / 2; // Prevent vertical movement
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableRotate = true; // Allow rotation
    controls.enableZoom = true; // Allow zoom

    // Update controls on each frame
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
    }
    animate();
  }
}
