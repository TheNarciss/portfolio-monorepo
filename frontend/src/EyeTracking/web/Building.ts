import * as THREE from "three";

export class BuildingScene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  rectangle: THREE.Mesh;
  ground: THREE.Mesh;
  pivot: THREE.Group; // Pivot du bâtiment
  scenePivot: THREE.Group; // Nouveau pivot pour toute la scène (drag and drop)

  ambientLight: THREE.AmbientLight;
  dirLight: THREE.DirectionalLight;

  // Propriétés pour le canvas du terminal
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;

  // Propriétés pour le Raycasting / Glissement
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  isDragging: boolean = false;
  lastIntersectionPoint: THREE.Vector3 | null = null;

  latestEyePos: {
    left: { x: number; y: number };
    right: { x: number; y: number };
  } | null = null;

  constructor(container: HTMLElement) {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000); // Noir pour background

    // Camera - Vue parfaitement perpendiculaire (de dessus à 90°)
    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    this.camera.position.set(0, 30, 0);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // --- PIVOT PRINCIPAL POUR LE GLISSEMENT ---
    this.scenePivot = new THREE.Group();
    this.scene.add(this.scenePivot);

    // Pivot pour le rectangle (bâtiment)
    this.pivot = new THREE.Group();
    this.scenePivot.add(this.pivot); // Le bâtiment est enfant du pivot de scène

    // Rectangle vertical (tour/building) - Style néon vert
    const geometry = new THREE.BoxGeometry(3, 15, 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff11,
      emissive: 0x00ff11,
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
    const numFloors = 50;
    for (let i = 1; i < numFloors; i++) {
      const floorY = (i * 15) / numFloors - 7.5;

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

    // --- SOL / FENÊTRE TERMINAL ---

    // Création et stockage du canvas
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1024;
    this.canvas.height = 682;
    this.ctx = this.canvas.getContext("2d")!;

    // Créer la texture
    this.texture = new THREE.CanvasTexture(this.canvas);
    const groundMaterial = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.DoubleSide,
      // La transparence est nécessaire pour que les coins arrondis fonctionnent
      transparent: true,
      alphaTest: 0.1 // Petite optimisation pour la transparence
    });

    // Dessiner la texture initiale (sans décalage)
    this.drawTerminalTexture(0, 0);

    const groundGeometry = new THREE.PlaneGeometry(15, 10);
    this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = 0.01; // Légèrement au-dessus du sol 3D pour éviter le Z-fighting
    this.scenePivot.add(this.ground); // Le terminal est enfant du pivot de scène

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

    // --- CONFIGURATION DU GLISSEMENT ---
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));

    this.createMacOSWindow(container);

    // Bouton de log
    this.createLogButton();

    // Démarrage de l'animation
    this.animate();
  }

  // Fonction utilitaire pour dessiner un rectangle aux coins arrondis
  drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }


  // Fonction pour dessiner/redessiner le contenu du terminal avec un décalage
  drawTerminalTexture(offsetX: number, offsetY: number) {
    const ctx = this.ctx;
    const canvas = this.canvas;
    const radius = 20; // Rayon plus petit et fidèle à macOS (20px)
    const titleBarHeight = 40;
    const bodyColor = "rgba(40, 40, 40, 0.9)"; // Gris foncé pour le corps
    const titleBarColor = "rgba(60, 60, 60, 0.9)"; // Gris légèrement plus clair pour la barre de titre

    // 1. Effacer le canvas (rend la zone autour du terminal transparent)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // === Corps du Terminal (avec coins arrondis) ===

    // Définir le chemin du rectangle arrondi pour le fond
    this.drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, radius);

    // Appliquer une légère ombre (simule la profondeur et la bordure claire)
    ctx.filter = "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5))"; // Ombre légère pour le détacher
    ctx.fillStyle = bodyColor;
    ctx.fill();
    ctx.filter = 'none'; // Réinitialiser le filtre

    // Appliquer un masque d'écrêtage pour que tout le contenu reste à l'intérieur des coins arrondis
    ctx.save();
    this.drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, radius);
    ctx.clip();


    // 2. Dessiner la barre de titre

    // Remplir la zone de la barre de titre avec la couleur plus claire
    ctx.fillStyle = titleBarColor;
    ctx.fillRect(0, 0, canvas.width, titleBarHeight);

    // Ligne de séparation subtile (pour l'effet d'acrylique/vibrancy)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, titleBarHeight);
    ctx.lineTo(canvas.width, titleBarHeight);
    ctx.stroke();

    // Simulation de dégradé/lumière en haut (effet macOS)
    const gradient = ctx.createLinearGradient(0, 0, 0, titleBarHeight);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, titleBarHeight);

    // Boutons rouge, jaune, vert (style macOS) - légèrement plus grands et centrés
    const buttonColors = ["#FF5F56", "#FFBD2E", "#27C93F"];
    const buttonRadius = 6;
    buttonColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(15 + i * 18, titleBarHeight / 2, buttonRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Titre "Terminal"
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.font = `14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`;
    ctx.textAlign = "center";
    ctx.fillText("Terminal - zsh", canvas.width / 2, titleBarHeight / 2 + 5);


    // 3. Appliquer la translation pour le contenu (Parallax)

    ctx.save();
    ctx.translate(offsetX, offsetY);

    // Texte terminal vert
    ctx.fillStyle = "#00ff00"; // Maintien du vert néon pour l'ambiance
    ctx.font = "16px 'SF Mono', 'Monaco', monospace";
    ctx.textAlign = "left";
    ctx.fillText("user@mac:~$ npm run dev", 20, titleBarHeight + 30);
    ctx.fillText("> Starting server...", 20, titleBarHeight + 60);
    ctx.fillText("> Server running on port 3000", 20, titleBarHeight + 90);
    ctx.fillText("> █", 20, titleBarHeight + 120);

    // 4. Rétablir le contexte (annule la translation et l'écrêtage)
    ctx.restore();
    ctx.restore(); // Restaurer deux fois (une fois pour le clip, une fois pour la translation)

    this.texture.needsUpdate = true; // Forcer la mise à jour de la texture.
  }

  // --- LOGIQUE DE GLISSEMENT (DRAG & DROP) ---

  /**
   * Obtient le point d'intersection 3D entre le rayon de la souris et le plan du sol.
   * @param event L'événement PointerEvent.
   * @returns Un THREE.Vector3 du point d'intersection, ou null.
   */
  getGroundIntersection(event: PointerEvent): THREE.Vector3 | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    // Intersection avec le plan du terminal/sol
    const intersects = this.raycaster.intersectObject(this.ground, false);

    if (intersects.length > 0) {
      return intersects[0].point;
    }
    return null;
  }

  onPointerDown(event: PointerEvent) {
    const intersection = this.getGroundIntersection(event);
    if (intersection) {
      this.isDragging = true;
      // Stocke le point d'intersection 3D initial
      this.lastIntersectionPoint = intersection.clone();
    }
  }

  onPointerUp(event: PointerEvent) {
    this.isDragging = false;
    this.lastIntersectionPoint = null;
  }

  onPointerMove(event: PointerEvent) {
    // Si l'utilisateur est en mode glissement, déplacer le pivot de scène
    if (this.isDragging) {
      const currentIntersection = this.getGroundIntersection(event);

      if (currentIntersection && this.lastIntersectionPoint) {
        // Calcule la différence entre le point 3D actuel et le point 3D précédent
        const deltaX = currentIntersection.x - this.lastIntersectionPoint.x;
        const deltaZ = currentIntersection.z - this.lastIntersectionPoint.z;

        // Applique ce delta à la position du pivot principal
        this.scenePivot.position.x += deltaX;
        this.scenePivot.position.z += deltaZ;

        // Met à jour le point d'intersection pour le prochain mouvement
        this.lastIntersectionPoint.copy(currentIntersection);
      }
    }
  }

  // --- FIN LOGIQUE DE GLISSEMENT ---


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

    const lerp = 0.1;

    // 1. Mouvement 3D du bâtiment (depth effect) - Déplacement local à l'intérieur du pivot
    const moveFactorX = 30;
    const moveFactorZ = 30;

    const targetX = -centerX * moveFactorX;
    const targetZ = -centerY * moveFactorZ;

    this.rectangle.position.x += (targetX - this.rectangle.position.x) * lerp;
    this.rectangle.position.z += (targetZ - this.rectangle.position.z) * lerp;

    // --- Contrôle des facteurs d'effet sur le terminal (ground) ---
    const rotationFactor = 0.5;
    const groundMoveFactor = 3.0;
    const shiftFactor = 150;

    // Rotation autour de l'axe Y (gauche/droite) - La rotation s'applique au ground, enfant du scenePivot
    const targetRotY = -centerX * rotationFactor;
    this.ground.rotation.y += (targetRotY - this.ground.rotation.y) * lerp;

    // Rotation autour de l'axe X (haut/bas)
    const targetRotX = centerY * rotationFactor * 0.5;
    this.ground.rotation.x += ((-Math.PI / 2) + targetRotX - this.ground.rotation.x) * lerp;


    // Translation du plan 3D pour suivre légèrement l'œil (renforce l'effet de perspective)
    const targetGroundX = -centerX * groundMoveFactor;
    const targetGroundZ = -centerY * groundMoveFactor;

    this.ground.position.x += (targetGroundX - this.ground.position.x) * lerp;
    this.ground.position.z += (targetGroundZ - this.ground.position.z) * lerp;


    // 2. Décalage 2D du contenu du terminal (perspective on flat surface)
    const shiftX = -centerX * shiftFactor;
    const shiftY = -centerY * shiftFactor;

    this.drawTerminalTexture(shiftX, shiftY);
    this.texture.needsUpdate = true;
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
      console.log("Scene Pivot position:", this.scenePivot.position);
      console.log("Rectangle (Building) local position:", this.rectangle.position);
      console.log("Ground (Terminal) local position:", this.ground.position);
      console.log("Camera position:", this.camera.position);
    };

    document.body.appendChild(btn);
  }
}