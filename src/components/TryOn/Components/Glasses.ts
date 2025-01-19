import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { IHeadRotation } from '../../../utils/Interfaces';
import EventEmitter from 'eventemitter3';

export class Glasses extends EventEmitter {
  model: THREE.Object3D | null = null;
  emitter = new EventEmitter();

  constructor(scene: THREE.Scene) {
    super();
    const loader = new GLTFLoader();
    loader.load(
      '/models/glasses2.glb', // Replace with the actual model path
      (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(0.1, 0.1, 0.1);
        this.model.position.set(0, 0, 1);
        scene.add(this.model);
        this.emitter.emit("loaded", this.model)
      },
      undefined,
      (error) => console.log("Error loading model", error)
    );
  }

  updatePosition(facePosition: THREE.Vector3, headPosition: any, headRotation: IHeadRotation, scale: number) {
    if (this.model) {
      const sceneScaleFactor = 2.5; // Adjust based on scene size
      const offsetX = -0.5; 
      const offsetY = 0.52;
      const offsetZ = 0.2; 

      // Map Mediapipe coords to Three.js world space
      const mappedPosition = new THREE.Vector3(
        (headPosition.x + offsetX) * sceneScaleFactor,
        (-headPosition.y + offsetY) * sceneScaleFactor,
        (headPosition.z + offsetZ) * sceneScaleFactor
      );

      // Smoothly interpolate position
      const smoothFactor = 0.2;
      this.model.position.lerp(mappedPosition, smoothFactor);

      // Convert rotation degrees to radians
      const yawRad = THREE.MathUtils.degToRad(headRotation.yaw);
      const pitchRad = THREE.MathUtils.degToRad(headRotation.pitch);
      const rollRad = THREE.MathUtils.degToRad(headRotation.roll);

      // Apply rotation to glasses
      this.model.rotation.set(
        -pitchRad,
        rollRad,
        -yawRad
      );

      console.log("Updated Rotation:", { yaw: yawRad, pitch: pitchRad, roll: rollRad });

      // Adjust scale dynamically based on face size
      const deltaScale = 0.02;
      this.model.scale.set(scale * deltaScale, scale * deltaScale, scale * deltaScale);
    } else {
      console.error("Glasses model is not initialized yet");
    }
  }


}
