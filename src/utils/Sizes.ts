import * as THREE from 'three'

export class Sizes {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
    this.camera = camera;
    this.renderer = renderer;
    window.addEventListener("resize", this.onResize.bind(this));
    this.onResize();
  }

  private onResize(): void {
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera.aspect = aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  public destroy(): void {
    window.removeEventListener("resize", this.onResize.bind(this));
  }
}
