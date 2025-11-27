import Parallax3D from "./Parallax3D.js";

// Crée la scène 3D
const parallax = new Parallax3D({
  container: document.getElementById("parallax-container"), // div dans index.html
  width: 640,
  height: 480,
});

// Fonction pour mettre à jour la position caméra / parallax
export function updateParallaxFromEyes(eyeOffsetX, eyeOffsetY) {
  parallax.updateCamera(eyeOffsetX, eyeOffsetY);
}

// Animation loop Three.js
function animate() {
  requestAnimationFrame(animate);
  parallax.render();
}

animate();
