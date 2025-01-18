import * as THREE from 'three';
import gsap from 'gsap';

export class Animations {

  private model: THREE.Object3D;

  constructor(model: THREE.Object3D) {
    this.model = model;
  }

  public fadeIn(duration: number = 0.1): void {
    this.model.visible = true;
    gsap.to(this.model.scale, {
      x: 0.7, y: 0.7, z: 0.7, duration, ease: "power2.out",
      onComplete: () => {
        gsap.to(this.model.scale, { x: 1, y: 1, z: 1, duration, ease: "power2.out" });
      }
    });
  }

  public fadeOut(duration: number = 0.5): void {
    gsap.to(this.model.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration,
      ease: "power2.in",
      onComplete: () => {
        this.model.visible = false;
      }
    });
    gsap.to(this.model, { opacity: 0, duration, ease: "power2.in" });
  }


  public scaleUp(factor: number = 1.2, duration: number = 0.3): void {
    gsap.to(this.model.scale, { x: factor, y: factor, z: factor, duration, ease: "power2.out" });
  }


  public scaleDown(duration: number = 0.3): void {
    gsap.to(this.model.scale, { x: 1, y: 1, z: 1, duration, ease: "power2.inOut" });
  }


  public animateProperty(property: string, value: number, duration: number = 1): void {
    gsap.to(this.model, { [property]: value, duration, ease: "power2.out" });
  }
}