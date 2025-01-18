import './style.scss';
import { Experience } from './Experience';

let isTryOn: boolean = false;
const experience = new Experience()
document.getElementById("cat")?.addEventListener("click", () => {
  isTryOn = !isTryOn;
  console.log(isTryOn)
  if (isTryOn) {
    experience.renderTryOn();
  } else {
    experience.renderShowRoom();
  }
})