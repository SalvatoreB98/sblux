import { Scene } from './components/Scene';
import { Glasses } from './components/Glasses';
import { Controls } from './components/Controls';
import { TryOnScene } from './components/TryOn/Components/TryOnScene';


export class Experience {
  canvas: HTMLCanvasElement;
  tryOnSceneInstance: TryOnScene | undefined;
  sceneInstance: Scene | undefined;

  constructor() {
    this.canvas = document.querySelector<HTMLCanvasElement>('#webglCanvas')!;
    this.renderShowRoom();
  }

  renderShowRoom() {
    this.sceneInstance = new Scene(this.canvas);
    new Glasses(this.sceneInstance.scene);
    new Controls(this.sceneInstance.camera, this.sceneInstance.renderer);
    this.sceneInstance.animate();
  }

  renderTryOn() {
    this.tryOnSceneInstance = new TryOnScene(this.canvas);
  }
}