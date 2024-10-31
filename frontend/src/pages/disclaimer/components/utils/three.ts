/**
 * @file three.ts
 * @description Utility functions for Three.js scene setup and particle system management
 * Handles initialization of 3D scene, particle systems creation, and animation loops
 * for both background particles and text-based particle effects
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { vertexShader, fragmentShader } from '../shaders';
import { AnimationParams, ParticleSystem, SceneSetup } from '../types';

/**
 * Initializes the Three.js scene, camera, and renderer
 * Sets up a perspective camera with orbital controls and configures
 * the WebGL renderer with high-performance settings
 * 
 * @param container - DOM element to mount the renderer
 * @returns Object containing scene, camera, renderer, and controls
 */
export const initScene = (container: HTMLElement): SceneSetup => {
  // Create basic scene and configure perspective camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 300;

  // Initialize WebGL renderer with optimal settings for particle effects
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Set up orbital controls with smooth damping effect
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  return { scene, camera, renderer, controls };
};

/**
 * Creates particle systems for background and text effects
 * Generates two separate particle systems:
 * 1. Background particles for ambient motion
 * 2. Text-based particles that form the "La Zona" text
 * 
 * @param scene - Three.js scene to add particles to
 * @returns ParticleSystem containing all necessary components
 */
export const createParticles = (scene: THREE.Scene): ParticleSystem => {
  // Initialize background particle system
  const backgroundGeometry = new THREE.BufferGeometry();
  const backgroundParticleCount = 100;
  const backgroundPositions = new Float32Array(backgroundParticleCount * 3);
  const backgroundSizes = new Float32Array(backgroundParticleCount);
  const backgroundVelocities = new Float32Array(backgroundParticleCount * 3);

  // Generate random positions and velocities for background particles
  for (let i = 0; i < backgroundParticleCount; i++) {
    // Position particles across the screen width and height
    backgroundPositions[i * 3] = (Math.random() - 0.5) * window.innerWidth;
    backgroundPositions[i * 3 + 1] = (Math.random() - 0.5) * window.innerHeight;
    backgroundPositions[i * 3 + 2] = 0;

    // Set random initial velocities for organic movement
    backgroundVelocities[i * 3] = (Math.random() - 0.5) * 2;
    backgroundVelocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
    backgroundVelocities[i * 3 + 2] = 0;

    // Randomize particle sizes for visual variety
    backgroundSizes[i] = Math.random() * 5 + 2;
  }

  // Set up background geometry attributes
  backgroundGeometry.setAttribute('position', new THREE.BufferAttribute(backgroundPositions, 3));
  backgroundGeometry.setAttribute('size', new THREE.BufferAttribute(backgroundSizes, 1));

  // Load and configure particle texture
  const particleTexture = new THREE.TextureLoader().load('data:image/png;base64,...');

  // Configure background particle material with additive blending
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

  // Create and add background particle system to scene
  const backgroundParticles = new THREE.Points(backgroundGeometry, backgroundMaterial);
  scene.add(backgroundParticles);

  // Initialize text particle system
  const geometry = new THREE.BufferGeometry();
  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const initialPositions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  // Create canvas for text rendering and particle positioning
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Configure canvas and text settings
    canvas.width = 4192;
    canvas.height = 2028;
    ctx.font = 'Bold 768px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('La Zona', canvas.width / 2, canvas.height / 2 + 100);

    // Get image data for particle positioning
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Generate particles for text effect
    for (let i = 0; i < particleCount; i++) {
      // Find valid position within text pixels
      let x, y;
      do {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
      } while (!data[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3]);

      // Scale positions to scene coordinates
      const initialX = (x - canvas.width / 2) * 0.15;
      const initialY = (canvas.height / 2 - y) * 0.15;
      
      // Set initial and current positions
      positions[i * 3] = initialX;
      positions[i * 3 + 1] = initialY;
      positions[i * 3 + 2] = 0;

      initialPositions[i * 3] = initialX;
      initialPositions[i * 3 + 1] = initialY;
      initialPositions[i * 3 + 2] = 0;

      // Set random velocities for particle movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      // Assign random colors for visual variety
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();

      // Set random particle sizes
      sizes[i] = Math.random() * 10 + 20;
    }
  }

  // Configure text particle geometry attributes
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Set up shader material for text particles
  const material = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader,
    fragmentShader,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    depthTest: true
  });

  // Create and add text particle system to scene
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
 * Handles both background particle animation and text particle behavior,
 * including explosion effects and position restoration
 * 
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

    // Animate background particles
    if (backgroundParticles) {
      const positions = backgroundParticles.geometry.attributes.position.array as Float32Array;
      const sizes = backgroundParticles.geometry.attributes.size.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        // Update positions based on velocities
        positions[i] += backgroundVelocities[i];
        positions[i + 1] += backgroundVelocities[i + 1];

        // Bounce particles off screen boundaries
        if (Math.abs(positions[i]) > window.innerWidth / 2) {
          backgroundVelocities[i] *= -1;
        }
        if (Math.abs(positions[i + 1]) > window.innerHeight / 2) {
          backgroundVelocities[i + 1] *= -1;
        }

        // Gradually increase particle sizes
        if (sizes[i / 3] < 10) {
          sizes[i / 3] += 0.01;
        }
      }

      // Mark attributes for update
      backgroundParticles.geometry.attributes.position.needsUpdate = true;
      backgroundParticles.geometry.attributes.size.needsUpdate = true;
    }

    // Animate text particles
    if (particles) {
      const positions = particles.geometry.attributes.position.array as Float32Array;
      const sizes = particles.geometry.attributes.size.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        if (!isExploding) {
          // Normal state: Update positions and apply spring force to return to initial positions
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Calculate distance from initial position
          const dx = initialPositions[i] - positions[i];
          const dy = initialPositions[i + 1] - positions[i + 1];
          const dz = initialPositions[i + 2] - positions[i + 2];
          
          // Apply spring force
          velocities[i] += dx * 0.0001;
          velocities[i + 1] += dy * 0.0001;
          velocities[i + 2] += dz * 0.0001;

          // Apply damping
          velocities[i] *= 0.99;
          velocities[i + 1] *= 0.99;
          velocities[i + 2] *= 0.99;
        } else {
          // Explosion state: Add random velocities and update positions
          velocities[i] += (Math.random() - 0.5) * 0.2;
          velocities[i + 1] += (Math.random() - 0.5) * 0.2;
          velocities[i + 2] += (Math.random() - 0.5) * 0.2;

          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          sizes[i / 3] *= 1;
        }
      }
      // Mark attributes for update
      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.size.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  animationLoop();

  // Return cleanup function
  return () => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
    }
  };
};