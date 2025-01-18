import { Scene } from './components/Scene';
import { Glasses } from './components/Glasses';
import { Controls } from './components/Controls';


export class Experience {
  canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.querySelector<HTMLCanvasElement>('#webglCanvas')!;
    this.renderShowRoom();
  }

  renderShowRoom() {
    const sceneInstance = new Scene(this.canvas);
    new Glasses(sceneInstance.scene);
    new Controls(sceneInstance.camera, sceneInstance.renderer);
    sceneInstance.animate();
  }

  renderTryOn() {
    const sceneInstance = new Scene(this.canvas);
    sceneInstance.animate();
  }
}