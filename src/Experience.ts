import { Scene } from './components/Scene';
import { Glasses } from './components/Glasses';
import { Controls } from './components/Controls';
import { TryOnScene } from './components/TryOn/Components/TryOnScene';


export class Experience {
  canvas: HTMLCanvasElement;
  tryOnSceneInstance: TryOnScene | undefined;
  sceneInstance: Scene | undefined;
  isTryOn: boolean = false;
  constructor() {
    this.canvas = document.querySelector<HTMLCanvasElement>('#webglCanvas')!;
    this.renderShowRoom();
  }

  renderShowRoom() {
    const myCanvas = document.querySelector<HTMLCanvasElement>("canvas");

    if (myCanvas && myCanvas.parentElement) {
      myCanvas.parentElement.removeChild(myCanvas);
    }
    const myVideo = document.querySelector<HTMLVideoElement>("video");

    if (myVideo && myVideo.parentElement) {
      myVideo.parentElement.removeChild(myVideo);
    }
    this.sceneInstance = new Scene(this.canvas);
    new Glasses(this.sceneInstance.scene);
    new Controls(this.sceneInstance.camera, this.sceneInstance.renderer);
    this.sceneInstance.animate();
    this.isTryOn = false;
    const button = document.getElementById("cat")
    button ? button.innerHTML = 'Provali ora!' : null;
  }

  renderTryOn() {
    const myCanvas = document.querySelector<HTMLCanvasElement>("canvas");

    if (myCanvas && myCanvas.parentElement) {
      myCanvas.parentElement.removeChild(myCanvas);
    }
    this.tryOnSceneInstance = new TryOnScene(this.canvas);
    this.isTryOn = true;
    const button = document.getElementById("cat")
    button ? button.innerHTML = 'Esci' : null;
  }
}
