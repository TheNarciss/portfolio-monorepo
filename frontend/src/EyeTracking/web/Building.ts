import * as THREE from "three";

export class BuildingScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  rectangle: THREE.Mesh;
  ground: THREE.Mesh;
  pivot: THREE.Group;
  ambientLight: THREE.AmbientLight;
  dirLight: THREE.DirectionalLight;

  latestEyePos: {
    left: { x: number; y: number };
    right: { x: number; y: number };
  } | null = null;

  constructor(container: HTMLElement) {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000); // Noir pour terminal

    // Camera - Vue parfaitement perpendiculaire (de dessus à 90°)
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    this.camera.position.set(0, 20, 0);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Pivot pour le rectangle
    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    // Rectangle vertical (tour/building) - Style néon vert
    const geometry = new THREE.BoxGeometry(2, 5, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });
    this.rectangle = new THREE.Mesh(geometry, material);
    this.rectangle.position.set(0, 2.5, 0);
    this.pivot.add(this.rectangle);

    // Ajouter des lignes horizontales (étages)
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffaa,
      linewidth: 2,
    });
    const wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    this.rectangle.add(wireframe);

    // Lignes horizontales pour marquer les étages
    const numFloors = 5;
    for (let i = 1; i < numFloors; i++) {
      const floorY = (i * 5) / numFloors - 2.5;

      const floorPoints = [
        new THREE.Vector3(-1, floorY, -1),
        new THREE.Vector3(1, floorY, -1),
        new THREE.Vector3(1, floorY, 1),
        new THREE.Vector3(-1, floorY, 1),
        new THREE.Vector3(-1, floorY, -1),
      ];

      const floorGeometry = new THREE.BufferGeometry().setFromPoints(
        floorPoints
      );
      const floorLine = new THREE.Line(
        floorGeometry,
        new THREE.LineBasicMaterial({
          color: 0x00ff66,
          transparent: true,
          opacity: 0.8,
        })
      );

      this.rectangle.add(floorLine);
    }

    // SOL qui ressemble à une fenêtre Terminal macOS
    const groundGeometry = new THREE.PlaneGeometry(15, 10);
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 682;
    const ctx = canvas.getContext("2d")!;

    // Fond noir du terminal
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Barre de titre macOS en haut
    ctx.fillStyle = "rgba(40, 40, 40, 0.95)";
    ctx.fillRect(0, 0, canvas.width, 60);

    // Boutons rouge, jaune, vert
    const buttonColors = ["#FF5F56", "#FFBD2E", "#27C93F"];
    buttonColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(20 + i * 25, 30, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Titre "Terminal"
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "18px -apple-system, BlinkMacSystemFont";
    ctx.textAlign = "center";
    ctx.fillText("Terminal — user@mac", canvas.width / 2, 35);

    // Ligne de séparation
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.lineTo(canvas.width, 60);
    ctx.stroke();

    // Texte terminal vert
    ctx.fillStyle = "#00ff00";
    ctx.font = "16px Monaco, monospace";
    ctx.textAlign = "left";
    ctx.fillText("user@mac:~$ npm run dev", 20, 100);
    ctx.fillText("> Starting server...", 20, 130);
    ctx.fillText("> Server running on port 3000", 20, 160);
    ctx.fillText("> █", 20, 190);

    // Créer une texture à partir du canvas
    const texture = new THREE.CanvasTexture(canvas);
    const groundMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = 0;
    this.scene.add(this.ground);

    // Bordure lumineuse autour de la fenêtre terminal
    const borderPoints = [
      new THREE.Vector3(-7.5, 0.01, -5),
      new THREE.Vector3(7.5, 0.01, -5),
      new THREE.Vector3(7.5, 0.01, 5),
      new THREE.Vector3(-7.5, 0.01, 5),
      new THREE.Vector3(-7.5, 0.01, -5),
    ];
    const borderGeometry = new THREE.BufferGeometry().setFromPoints(
      borderPoints
    );
    const borderLine = new THREE.Line(
      borderGeometry,
      new THREE.LineBasicMaterial({
        color: 0x00ff00,
        linewidth: 3,
      })
    );
    this.scene.add(borderLine);
    // Interface macOS
    // Lumières
    this.ambientLight = new THREE.AmbientLight(0x00ff44, 0.4);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0x00ffaa, 0.8);
    this.dirLight.position.set(5, 15, 5);
    this.scene.add(this.dirLight);

    // Lumière d'accent verte
    const accentLight = new THREE.PointLight(0x00ff88, 1, 50);
    accentLight.position.set(0, 20, 0);
    this.scene.add(accentLight);
    this.createMacOSWindow(container);

    // Bouton de log
    this.createLogButton();

    // Démarrage de l'animation
    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    if (this.latestEyePos) {
      this.applyParallax(this.latestEyePos);
    }

    this.renderer.render(this.scene, this.camera);
  };

  setRectanglePosition(x: number, y: number, z: number) {
    this.rectangle.position.set(x, y, z);
  }

  updateFromEyePos(eyePos: {
    left: { x: number; y: number };
    right: { x: number; y: number };
  }) {
    this.latestEyePos = eyePos;
  }

  applyParallax(eyePos: {
    left: { x: number; y: number };
    right: { x: number; y: number };
  }) {
    const normalizedX = (eyePos.left.x + eyePos.right.x) / 2 / 480;
    const normalizedY = (eyePos.left.y + eyePos.right.y) / 2 / 360;

    let centerX = THREE.MathUtils.clamp(normalizedX - 0.5, -0.5, 0.5);
    let centerY = THREE.MathUtils.clamp(normalizedY - 0.5, -0.5, 0.5);

    const curve = 1.5;
    centerX =
      (Math.sign(centerX) * Math.pow(Math.abs(centerX) * 2, curve)) /
      Math.pow(2, curve);
    centerY =
      (Math.sign(centerY) * Math.pow(Math.abs(centerY) * 2, curve)) /
      Math.pow(2, curve);

    const moveFactorX = 20;
    const moveFactorZ = 20;

    const targetX = -centerX * moveFactorX;
    const targetZ = -centerY * moveFactorZ;

    const lerp = 0.1;
    this.rectangle.position.x += (targetX - this.rectangle.position.x) * lerp;
    this.rectangle.position.z += (targetZ - this.rectangle.position.z) * lerp;
  }

  createMacOSWindow(container: HTMLElement) {
    const titleBar = document.createElement("div");
    titleBar.style.position = "absolute";
    titleBar.style.top = "0";
    titleBar.style.left = "0";
    titleBar.style.right = "0";
    titleBar.style.height = "40px";
    titleBar.style.background = "rgba(40, 40, 40, 0.95)";
    titleBar.style.backdropFilter = "blur(20px)";
    titleBar.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
    titleBar.style.display = "flex";
    titleBar.style.alignItems = "center";
    titleBar.style.padding = "0 12px";
    titleBar.style.zIndex = "1000";
    titleBar.style.fontFamily = "-apple-system, BlinkMacSystemFont, sans-serif";

    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "8px";

    const colors = ["#FF5F56", "#FFBD2E", "#27C93F"];
    colors.forEach((color) => {
      const button = document.createElement("div");
      button.style.width = "12px";
      button.style.height = "12px";
      button.style.borderRadius = "50%";
      button.style.backgroundColor = color;
      button.style.cursor = "pointer";
      button.style.transition = "opacity 0.2s";

      button.onmouseenter = () => (button.style.opacity = "0.7");
      button.onmouseleave = () => (button.style.opacity = "1");

      buttonsContainer.appendChild(button);
    });

    const title = document.createElement("div");
    title.textContent = "Terminal — Parallax Scene";
    title.style.position = "absolute";
    title.style.left = "50%";
    title.style.transform = "translateX(-50%)";
    title.style.color = "rgba(255, 255, 255, 0.7)";
    title.style.fontSize = "13px";
    title.style.fontWeight = "500";

    titleBar.appendChild(buttonsContainer);
    titleBar.appendChild(title);
    container.appendChild(titleBar);

    this.renderer.domElement.style.marginTop = "40px";
  }

  createLogButton() {
    const btn = document.createElement("button");
    btn.textContent = "LOG SCENE";
    btn.style.position = "fixed";
    btn.style.top = "50px";
    btn.style.left = "10px";
    btn.style.zIndex = "1000";
    btn.style.padding = "8px 12px";
    btn.style.borderRadius = "5px";
    btn.style.backgroundColor = "#0077ff";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.cursor = "pointer";

    btn.onclick = () => {
      console.log("=== BuildingScene LOG ===");
      console.log("Rectangle position:", this.rectangle.position);
      console.log("Pivot rotation:", this.pivot.rotation);
      console.log("Camera position:", this.camera.position);
    };

    document.body.appendChild(btn);
  }
}
