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
      (error) => console.log("Error loading model")
    );
  }

  updatePosition(facePosition: THREE.Vector3, headRotation: IHeadRotation, scale: number) {
    if (this.model) {
      // Update position with smooth interpolation
      this.model.position.lerp(facePosition, 0.5);

      // Convert degrees to radians (Three.js uses radians)
      const yawRad = THREE.MathUtils.degToRad(headRotation.yaw);
      const pitchRad = THREE.MathUtils.degToRad(headRotation.pitch);
      const rollRad = THREE.MathUtils.degToRad(headRotation.roll);

      // Apply rotation based on head movement
      this.model.rotation.set(
        -pitchRad,
        rollRad,
        -yawRad 
      ); 
      console.log("Updated Rotation:", { yaw: yawRad, pitch: pitchRad, roll: rollRad });

      // Adjust scale dynamically based on face size
      const deltaScale = 0.025;
      this.model.scale.set(scale * deltaScale, scale * deltaScale, scale * deltaScale)
    } else {
      console.error("Glasses model is not initialized yet");
    }
  }

}
