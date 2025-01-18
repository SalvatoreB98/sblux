import { Scene } from './components/Scene';
import { Glasses } from './components/Glasses';
import { Controls } from './components/Controls';
import './style.scss';
import { TryOn } from './components/TryOn';


const canvas = document.querySelector<HTMLCanvasElement>('#webglCanvas')!;
if (!canvas) {
  throw new Error('Canvas not found!');
}


const sceneInstance = new Scene(canvas);
const glasses = new Glasses(sceneInstance.scene);
new Controls(sceneInstance.camera, sceneInstance.renderer);
const tryOn = new TryOn();
sceneInstance.animate();
