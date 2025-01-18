import * as THREE from 'three';

export class Utils {
  /**
   * Creates a 3D object (Box or Sphere) with a gradient shader material.
   * @param shape "box" or "sphere"
   * @param size Size of the object (default: 5)
   * @returns THREE.Mesh (the created object)
   */
  public static createGradientObject(shape: "box" | "sphere" = "box", size: number = 500): THREE.Mesh {
    let geometry: THREE.BufferGeometry;

    // 🔹 Choose Geometry Type with Adjustable Size
    if (shape === "box") {
      geometry = new THREE.BoxGeometry(size, size, size); 
    } else {
      geometry = new THREE.SphereGeometry(size, 64, 64);
    }

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color("#1b7691") },
        color2: { value: new THREE.Color("#fcf1ef") }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 color1;
        uniform vec3 color2;
        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `,
      side: THREE.DoubleSide
    });

    // 🎨 Create the Object
    const object = new THREE.Mesh(geometry, material);
    object.position.set(0, 0, 0); // Center in scene

    return object;
  }
}
