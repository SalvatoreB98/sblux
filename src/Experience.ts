import { Scene } from './components/Scene';
import { Glasses } from './components/Glasses';
import { Controls } from './components/Controls';


export class Experience {
  constructor() {
    this.renderShowRoom();
  }
  renderShowRoom(){
    const canvas = document.querySelector<HTMLCanvasElement>('#webglCanvas')!;
    const sceneInstance = new Scene(canvas);
    new Glasses(sceneInstance.scene);
    new Controls(sceneInstance.camera, sceneInstance.renderer);
    sceneInstance.animate();
  }
}
