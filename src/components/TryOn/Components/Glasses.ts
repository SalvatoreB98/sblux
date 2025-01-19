import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { IHeadRotation } from "../../../utils/Interfaces";
import EventEmitter from "eventemitter3";
import GUI from "lil-gui";

export class Glasses extends EventEmitter {
  model: THREE.Object3D | null = null;
  emitter = new EventEmitter();

  // GUI-controlled parameters
  params = {
    scale: 1.25,
    offsetX: -0.50,
    offsetY: 0.54,
    offsetZ: 0.2,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scaleFactor: 2.5
  };

  constructor(scene: THREE.Scene) {
    super();
    const loader = new GLTFLoader();
    loader.load(
      "/models/glasses2.glb",
      (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(0.1, 0.1, 0.1);
        this.model.position.set(0, 0, 1);
        const bbox = new THREE.Box3().setFromObject(this.model);
        const modelCenter = bbox.getCenter(new THREE.Vector3());
        this.model.position.sub(modelCenter); // Shift the model so its center aligns with the origin
        scene.add(this.model);
        this.emitter.emit("loaded", this.model);
      },
      undefined,
      (error) => console.log("Error loading model", error)
    );

    this.createGUI();
  }

  /**
   * Called from an external class to update position dynamically.
   */
  updatePosition(facePosition: THREE.Vector3, headPosition: any, headRotation: IHeadRotation, scale: number) {
    if (!this.model) return;

    const headWidth = Math.abs(headPosition.x - facePosition.x); // Distance between facial landmarks
    const sceneScaleFactor = headWidth * 2; // Dynamically scale glasses based on head size
    const smoothFactor = 0.2;
    const lerpFactor = 0.1;

    // Blend GUI modifications with real-time tracking data
    const mappedPosition = new THREE.Vector3(
      headPosition.x * sceneScaleFactor,
      -headPosition.y * sceneScaleFactor,
      headPosition.z * sceneScaleFactor
    );
    this.model.position.lerp(mappedPosition, smoothFactor);

    // Smoothly interpolate position
    this.model.position.lerp(mappedPosition, smoothFactor);

    // Rotation adjustments
    const yawRad = THREE.MathUtils.degToRad(headRotation.yaw + this.params.rotationY);
    const pitchRad = THREE.MathUtils.degToRad(headRotation.pitch + this.params.rotationX);
    const rollRad = THREE.MathUtils.degToRad(headRotation.roll + this.params.rotationZ);

    const targetQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(-pitchRad, rollRad, -yawRad)
    );

    // Smooth rotation interpolation
    this.model.quaternion.slerp(targetQuat, lerpFactor);

    // Adjust scale dynamically
    const deltaScale = 0.02;
    this.model.scale.set(
      scale * deltaScale * this.params.scale,
      scale * deltaScale * this.params.scale,
      scale * deltaScale * this.params.scale
    );
  }

  /**
   * GUI for manual fine-tuning.
   */
  createGUI() {
    const gui = new GUI();

    gui.add(this.params, "scale", 0.1, 5.0);
    gui.add(this.params, "offsetX", -0.6, -0.3);
    gui.add(this.params, "offsetY", 0, 1);
    gui.add(this.params, "offsetZ", -2, 2);
    gui.add(this.params, "rotationX", -180, 180);
    gui.add(this.params, "rotationY", -180, 180);
    gui.add(this.params, "rotationZ", -180, 180);
    gui.add(this.params, "scaleFactor", 0.1, 3.0);
  }
}
