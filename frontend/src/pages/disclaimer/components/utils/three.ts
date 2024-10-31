/**
 * @file three.ts
 * @description Utility functions for Three.js scene setup and particle system management
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { vertexShader, fragmentShader } from '../shaders';
import { AnimationParams, ParticleSystem, SceneSetup } from '../types';

/**
 * Initializes the Three.js scene, camera, and renderer
 * @param container - DOM element to mount the renderer
 * @returns Object containing scene, camera, renderer, and controls
 */
export const initScene = (container: HTMLElement): SceneSetup => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 300;

  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  return { scene, camera, renderer, controls };
};

/**
 * Creates particle systems for background and text effects
 * @param scene - Three.js scene to add particles to
 * @returns ParticleSystem containing all necessary components
 */
export const createParticles = (scene: THREE.Scene): ParticleSystem => {
  const backgroundGeometry = new THREE.BufferGeometry();
  const backgroundParticleCount = 100;
  const backgroundPositions = new Float32Array(backgroundParticleCount * 3);
  const backgroundSizes = new Float32Array(backgroundParticleCount);
  const backgroundVelocities = new Float32Array(backgroundParticleCount * 3);

  for (let i = 0; i < backgroundParticleCount; i++) {
    backgroundPositions[i * 3] = (Math.random() - 0.5) * window.innerWidth;
    backgroundPositions[i * 3 + 1] = (Math.random() - 0.5) * window.innerHeight;
    backgroundPositions[i * 3 + 2] = 0;

    backgroundVelocities[i * 3] = (Math.random() - 0.5) * 2;
    backgroundVelocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
    backgroundVelocities[i * 3 + 2] = 0;

    backgroundSizes[i] = Math.random() * 5 + 2;
  }

  backgroundGeometry.setAttribute('position', new THREE.BufferAttribute(backgroundPositions, 3));
  backgroundGeometry.setAttribute('size', new THREE.BufferAttribute(backgroundSizes, 1));

  const particleTexture = new THREE.TextureLoader().load('data:image/png;base64,...');

  const backgroundMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 5,
    map: particleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    alphaTest: 0.1
  });

  const backgroundParticles = new THREE.Points(backgroundGeometry, backgroundMaterial);
  scene.add(backgroundParticles);

  const geometry = new THREE.BufferGeometry();
  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const initialPositions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    canvas.width = 4192;
    canvas.height = 2028;
    ctx.font = 'Bold 768px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('La Zona', canvas.width / 2, canvas.height / 2 + 100);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < particleCount; i++) {
      let x, y;
      do {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      } while (!data[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3]);

      const initialX = (x - canvas.width / 2) * 0.15;
      const initialY = (canvas.height / 2 - y) * 0.15;
      
      positions[i * 3] = initialX;
      positions[i * 3 + 1] = initialY;
      positions[i * 3 + 2] = 0;

      initialPositions[i * 3] = initialX;
      initialPositions[i * 3 + 1] = initialY;
      initialPositions[i * 3 + 2] = 0;

      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();

      sizes[i] = Math.random() * 10 + 20;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader,
    fragmentShader,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    depthTest: true
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  return {
    particles,
    backgroundParticles,
    velocities,
    backgroundVelocities,
    initialPositions
  };
};

/**
 * Animates the particle systems
 * @param params - Animation parameters including scene objects and state
 * @returns Cleanup function to cancel animation frame
 */
export const animate = ({
  scene,
  camera,
  renderer,
  controls,
  particles,
  backgroundParticles,
  isExploding,
  frameIdRef,
  velocities,
  backgroundVelocities,
  initialPositions
}: AnimationParams): () => void => {
  const animationLoop = () => {
    frameIdRef.current = requestAnimationFrame(animationLoop);
    controls.update();

    if (backgroundParticles) {
      const positions = backgroundParticles.geometry.attributes.position.array as Float32Array;
      const sizes = backgroundParticles.geometry.attributes.size.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += backgroundVelocities[i];
        positions[i + 1] += backgroundVelocities[i + 1];

        if (Math.abs(positions[i]) > window.innerWidth / 2) {
          backgroundVelocities[i] *= -1;
        }
        if (Math.abs(positions[i + 1]) > window.innerHeight / 2) {
          backgroundVelocities[i + 1] *= -1;
        }

        if (sizes[i / 3] < 10) {
          sizes[i / 3] += 0.01;
        }
      }

      backgroundParticles.geometry.attributes.position.needsUpdate = true;
      backgroundParticles.geometry.attributes.size.needsUpdate = true;
    }

    if (particles) {
      const positions = particles.geometry.attributes.position.array as Float32Array;
      const sizes = particles.geometry.attributes.size.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        if (!isExploding) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          const dx = initialPositions[i] - positions[i];
          const dy = initialPositions[i + 1] - positions[i + 1];
          const dz = initialPositions[i + 2] - positions[i + 2];
          
          velocities[i] += dx * 0.0001;
          velocities[i + 1] += dy * 0.0001;
          velocities[i + 2] += dz * 0.0001;

          velocities[i] *= 0.99;
          velocities[i + 1] *= 0.99;
          velocities[i + 2] *= 0.99;
        } else {
          velocities[i] += (Math.random() - 0.5) * 0.2;
          velocities[i + 1] += (Math.random() - 0.5) * 0.2;
          velocities[i + 2] += (Math.random() - 0.5) * 0.2;

          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          sizes[i / 3] *= 1;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.size.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  animationLoop();

  return () => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
    }
  };
};