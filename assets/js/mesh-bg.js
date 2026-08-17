import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById('mesh-bg');
const hero = document.querySelector('.hero');

if (canvas && hero && window.WebGLRenderingContext) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 2.2, 5.2);

  const camera = new THREE.PerspectiveCamera(42, hero.clientWidth / hero.clientHeight, 0.1, 100);
  camera.position.set(0, 2.1, 1.55);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(hero.clientWidth, hero.clientHeight);

  scene.add(new THREE.AmbientLight(0xffffff, 1.0));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(2, 3, 2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x8ea2ff, 0.7);
  rim.position.set(-3, 1.5, -2);
  scene.add(rim);

  let meshGroup = null;
  let rotationY = 0;
  let pointerX = 0;

  const loader = new GLTFLoader();
  loader.load(
    'assets/models/mesh_bg.glb',
    (gltf) => {
      meshGroup = gltf.scene;
      meshGroup.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            roughness: 0.85,
            metalness: 0.05,
          });
        }
      });
      // source mesh is Z-up (photogrammetry convention); three.js is Y-up
      meshGroup.rotation.x = -Math.PI / 2;
      meshGroup.scale.setScalar(1.85);
      scene.add(meshGroup);
      canvas.classList.add('loaded');
    },
    undefined,
    (err) => console.warn('MEJA background mesh failed to load', err)
  );

  window.addEventListener('pointermove', (e) => {
    pointerX = (e.clientX / window.innerWidth) - 0.5;
  });

  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);

  function animate() {
    requestAnimationFrame(animate);
    if (meshGroup) {
      if (!reduceMotion) rotationY += 0.0016;
      meshGroup.rotation.y = rotationY + pointerX * 0.35;
    }
    renderer.render(scene, camera);
  }
  animate();
}
