import * as THREE from "three";

export default class Parallax3D {
  constructor({ container, width = 640, height = 480 }) {
    this.width = width;
    this.height = height;

    // Scene, camera, renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // Création de quelques plans pour parallax
    this.layers = [];
    const colors = [0xff5555, 0x55ff55, 0x5555ff];
    colors.forEach((color, i) => {
      const geometry = new THREE.PlaneGeometry(5, 3);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -i * 1.5; // profondeur
      this.scene.add(mesh);
      this.layers.push(mesh);
    });
  }

  updateCamera(offsetX, offsetY) {
    // Appliquer un petit mouvement de caméra en fonction des yeux
    const maxOffset = 0.5;
    this.camera.position.x = THREE.MathUtils.clamp(offsetX * maxOffset, -maxOffset, maxOffset);
    this.camera.position.y = THREE.MathUtils.clamp(-offsetY * maxOffset, -maxOffset, maxOffset);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
