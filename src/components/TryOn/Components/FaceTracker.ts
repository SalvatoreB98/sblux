import { FaceMesh } from '@mediapipe/face_mesh';

export class FaceTracker {
  video: HTMLVideoElement;
  faceMesh: FaceMesh;
  onResultsCallback: (faceLandmarks: any) => void;

  constructor(videoElement: HTMLVideoElement, onResultsCallback: (faceLandmarks: any) => void) {
    this.video = videoElement;
    this.onResultsCallback = onResultsCallback;

    // Initialize MediaPipe FaceMesh
    this.faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        this.onResultsCallback(results.multiFaceLandmarks[0]);
      }
    });

    // Start Webcam Capture
    this.startCamera();
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.srcObject = stream;
      this.video.play();

      // Process frames for face tracking
      const processFrame = async () => {
        if (!this.video.paused && !this.video.ended) {
          await this.faceMesh.send({ image: this.video });
        }
        requestAnimationFrame(processFrame);
      };

      processFrame();
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }
}
