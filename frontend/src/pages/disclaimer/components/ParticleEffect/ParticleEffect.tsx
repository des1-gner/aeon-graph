// Import necessary dependencies from React and Three.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { initScene, createParticles, animate } from '../utils/three';

// Define the component props interface
interface ParticleEffectProps {
  isExploding: boolean; // Controls whether particles are in explosion state
}

// ParticleEffect component: Renders a 3D particle system with explosion effects
export const ParticleEffect: React.FC<ParticleEffectProps> = ({ isExploding }) => {
  // Refs for DOM elements
  const mountRef = useRef<HTMLDivElement>(null);            // Reference to the main mounting div
  const backgroundRef = useRef<HTMLDivElement>(null);       // Reference to the background container

  // Refs for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);                    // Stores the 3D scene
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);       // Stores the camera
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);         // Stores the WebGL renderer
  const particlesRef = useRef<THREE.Points | null>(null);               // Stores main particle system
  const backgroundParticlesRef = useRef<THREE.Points | null>(null);     // Stores background particles
  const frameIdRef = useRef<number | null>(null);                       // Stores animation frame ID

  // Main effect hook for setting up and managing the 3D scene
  useEffect(() => {
    if (!backgroundRef.current) return;

    // Initialize the Three.js scene, camera, renderer, and controls
    const { scene, camera, renderer, controls } = initScene(backgroundRef.current);

    // Create particle systems and get their properties
    const {
      particles,
      backgroundParticles,
      velocities,
      backgroundVelocities,
      initialPositions
    } = createParticles(scene);

    // Store references to Three.js objects for later use
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    particlesRef.current = particles;
    backgroundParticlesRef.current = backgroundParticles;

    // Handle window resize events to maintain proper aspect ratio
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Start the animation loop and get cleanup function
    const cleanup = animate({
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
    });

    // Cleanup function to remove event listeners and Three.js elements
    return () => {
      cleanup();
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && backgroundRef.current) {
        backgroundRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [isExploding]); // Re-run effect when isExploding prop changes

  // Render a full-screen container for the particle effect
  return (
    <div ref={backgroundRef} className="absolute inset-0" style={{ zIndex: 0 }} />
  );
};