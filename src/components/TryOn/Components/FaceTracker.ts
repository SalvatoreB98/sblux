import { FaceMesh } from '@mediapipe/face_mesh';
import { IHeadRotation } from '../../../utils/Interfaces';

export class FaceTracker {
  video: HTMLVideoElement;
  static faceMeshInstance: FaceMesh | null = null; // Singleton instance
  onResultsCallback: (faceLandmarks: any, position: any,  headRotation?: IHeadRotation, scaleFactor?: number) => void;

  constructor(videoElement: HTMLVideoElement, onResultsCallback: (faceLandmarks: any, position: any, headRotation?: { yaw: number, pitch: number, roll: number }, scaleFactor?: number) => void) {
    this.video = videoElement;
    this.onResultsCallback = onResultsCallback;

    // Use existing instance if available
    if (!FaceTracker.faceMeshInstance) {
      FaceTracker.faceMeshInstance = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      FaceTracker.faceMeshInstance.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
    }

    // Set callback for processing results
    FaceTracker.faceMeshInstance.onResults((results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const faceLandmarks = results.multiFaceLandmarks[0];

        // Get head rotation & position
        const { yaw, pitch, roll, position } = this.estimateHeadPose(faceLandmarks);

        // Compute scale factor
        const scaleFactor = this.computeScale(faceLandmarks);

        // Callback with landmarks, rotation & scale
        this.onResultsCallback(faceLandmarks, position, { yaw, pitch, roll }, scaleFactor);
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

      const processFrame = async () => {
        if (!this.video.paused && !this.video.ended) {
          await FaceTracker.faceMeshInstance!.send({ image: this.video });
        }
        requestAnimationFrame(processFrame);
      };

      processFrame();
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  /**
   * Estimate head pose based on facial landmarks (yaw, pitch, roll).
   */
  estimateHeadPose(faceLandmarks: any): { yaw: number, pitch: number, roll: number, position: { x: number, y: number, z: number } } {
    // Define reference points
    const referencePoints = {
      noseTip: 1,   // Nose Tip
      leftEye: 33,  // Left Eye Corner
      rightEye: 263,// Right Eye Corner
      chin: 152,    // Chin
    };

    const nose = faceLandmarks[referencePoints.noseTip];
    const chin = faceLandmarks[referencePoints.chin];
    const leftEye = faceLandmarks[referencePoints.leftEye];
    const rightEye = faceLandmarks[referencePoints.rightEye];

    // Compute yaw (left/right rotation)
    const yaw = Math.atan2(rightEye.x - leftEye.x, rightEye.z - leftEye.z) * (180 / Math.PI);

    // Compute pitch (up/down rotation)
    const pitch = Math.atan2(chin.y - nose.y, chin.z - nose.z) * (180 / Math.PI);

    // Compute roll (tilt rotation)
    const roll = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);

    // Compute head position (centroid of main landmarks)
    const position = {
      x: (nose.x + leftEye.x + rightEye.x + chin.x) / 4,
      y: (nose.y + leftEye.y + rightEye.y + chin.y) / 4,
      z: (nose.z + leftEye.z + rightEye.z + chin.z) / 4,
    };

    return { yaw, pitch, roll, position };
  }


  /**
   * Compute scale factor based on the distance between eyes.
   */
  computeScale(faceLandmarks: any): number {
    const leftEye = faceLandmarks[33];  // Left eye corner
    const rightEye = faceLandmarks[263]; // Right eye corner

    // Compute Euclidean distance between eyes
    const eyeDistance = Math.sqrt(
      Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2) + Math.pow(rightEye.z - leftEye.z, 2)
    );

    // Normalize scale factor (arbitrary constant for tuning)
    const scaleFactor = eyeDistance * 10; // Adjust this factor as needed

    return scaleFactor;
  }
}
