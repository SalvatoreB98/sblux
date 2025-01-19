import * as THREE from 'three';
import { Sizes } from '../utils/Sizes';
import { RGBELoader } from 'three/examples/jsm/Addons.js';
import { Utils } from '../utils/Utils';

export class Scene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement) {
    
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(5, 90, 3);
    this.camera.zoom = 2
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const sizes = new Sizes(this.camera, this.renderer);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);


    // 🌟 Create a Plane for the Shadow
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50), // Shadow size
      Utils.shadowShader()
    );

    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -5; 
    shadowPlane.renderOrder = 1;
    this.scene.add(shadowPlane);


    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/imgs/hdr3.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
    });

    this.scene.background = new THREE.Color(0xfcf1ef);
    const gradientBox = Utils.createGradientObject("sphere");
    this.scene.add(gradientBox);

  }


  public animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}