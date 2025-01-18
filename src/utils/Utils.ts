import * as THREE from 'three';

export class Utils {

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

    const object = new THREE.Mesh(geometry, material);
    object.position.set(0, 0, 0); 

    return object;
  }
  public static shadowShader() {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0x000000) },
        uOpacity: { value: 0.5 },
        uRadius: { value: 0.5 }, 
        uSoftness: { value: 0.5 }
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
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uRadius;
        uniform float uSoftness;
        void main() {
          float dist = distance(vUv, vec2(0.5, 0.5)); // Distance from center
          float alpha = smoothstep(uRadius, uRadius - uSoftness, dist); // Soft edges
          gl_FragColor = vec4(uColor, uOpacity * alpha);
        }
      `,
      transparent: true // Allows transparency
    });
  }
}
