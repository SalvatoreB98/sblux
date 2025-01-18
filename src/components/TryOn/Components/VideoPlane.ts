import * as THREE from 'three';
import { FaceTracker } from './FaceTracker';

export class VideoPlane {
  video: HTMLVideoElement;
  faceTracker: FaceTracker;
  onFaceDetected: (position: THREE.Vector3) => void;
  testVideo: HTMLVideoElement; // Webcam Test Video

  constructor(scene: THREE.Scene, onFaceDetected: (position: THREE.Vector3) => void) {
    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.video.muted = true;
    this.video.playsInline = true;

    this.onFaceDetected = onFaceDetected; 

    this.testVideo = document.createElement('video');
    this.testVideo.autoplay = true;
    this.testVideo.muted = true;
    this.testVideo.playsInline = true;
    this.testVideo.style.position = 'absolute';
    this.testVideo.style.top = '0';
    this.testVideo.style.right = '0';
    this.testVideo.style.width = '100%';
    this.testVideo.style.height = '100%';
    this.testVideo.style.border = '2px solid white';
    this.testVideo.style.backgroundColor = 'black';
    this.testVideo.style.zIndex = '1'
    document.body.appendChild(this.testVideo);

    // Start webcam stream
    this.startCamera();

    // Start Face Tracking
    this.faceTracker = new FaceTracker(this.video, (landmarks) => {
      if (landmarks && landmarks[168]) {
        const noseBridge = landmarks[168];
        const position = new THREE.Vector3(
          noseBridge.x - 0.5,
          -(noseBridge.y - 0.5),
          noseBridge.z
        );

        if (this.onFaceDetected) {
          this.onFaceDetected(position);
        }
      }
    });
  }

  async startCamera() {
    try {
      console.log('Requesting webcam access...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      console.log('Webcam stream received:', stream);

      // Assign the webcam stream to both the Three.js video texture & test video
      this.video.srcObject = stream;
      this.testVideo.srcObject = stream;

      // Ensure the video starts playing
      this.video.onloadedmetadata = () => {
        console.log('Webcam metadata loaded, playing video.');
        this.video.play().catch((error) => {
          console.error('Video Play Error:', error);
        });
        this.testVideo.play().catch((error) => {
          console.error('Test Video Play Error:', error);
        });
      };
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  updateTexture() {
    if (this.texture) {
      this.texture.needsUpdate = true; // Ensure texture updates each frame
    }
  }
}
