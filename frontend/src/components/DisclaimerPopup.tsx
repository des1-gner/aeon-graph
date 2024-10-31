/**
 * @file DisclaimerPage.tsx
 * @description A React component that displays a disclaimer page with animated particle effects
 * @maintainers 
 * - Oisin Aeonn (s3952320@student.rmit.edu.au)
 * - Lucas Phung (s3945217@student.rmit.edu.au)
 */

import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface DisclaimerPageProps {
  onAccept: () => void;
}

/**
 * DisclaimerPage component that displays terms and conditions with an interactive
 * particle effect background using Three.js
 */
const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onAccept }) => {
  // State management for user interactions and animation control
  const [isChecked, setIsChecked] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  // Refs for Three.js scene management
  const mountRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const backgroundParticlesRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!mountRef.current || !backgroundRef.current) return;

    // Initialize Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;

    // Configure WebGL renderer with high-performance settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    backgroundRef.current.appendChild(renderer.domElement);

    // Add orbital controls for camera movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create background particle system
    const backgroundGeometry = new THREE.BufferGeometry();
    const backgroundParticleCount = 100;
    const backgroundPositions = new Float32Array(backgroundParticleCount * 3);
    const backgroundSizes = new Float32Array(backgroundParticleCount);
    const backgroundVelocities = new Float32Array(backgroundParticleCount * 3);

    // Initialize background particles with random positions and velocities
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

    // Load particle texture for better visual effect
    const particleTexture = new THREE.TextureLoader().load('data:image/png;base64,...');

    // Configure background particle material
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

    // Create main particle system for text effect
    const geometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const initialPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Generate particles from text using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 4192;
      canvas.height = 2028;
      ctx.font = 'Bold 768px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      // ctx.fillText('.', canvas.width / 2, canvas.height / 2 + 100);
      ctx.fillText('La Zona', canvas.width / 2, canvas.height / 2 + 100);

      // Sample pixels from text to create particle positions
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < particleCount; i++) {
        // Find valid position within text pixels
        let x, y;
        do {
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
        } while (!data[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3]);

        const initialX = (x - canvas.width / 2) * 0.15;
        const initialY = (canvas.height / 2 - y) * 0.15;
        
        // Initialize particle properties
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

    // Set up particle geometry attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader for particle rendering
    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        vec2 center = gl_PointCoord - vec2(0.5, 0.5);
        float dist = length(center);
        float alpha = smoothstep(0.5, 0.45, dist);
        if (alpha < 0.1) discard;
        gl_FragColor = vec4(vColor, alpha);
      }
    `;

    // Configure particle material with custom shaders
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

    // Store references for animation
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    particlesRef.current = particles;
    backgroundParticlesRef.current = backgroundParticles;

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controls.update();

      // Update background particles
      if (backgroundParticlesRef.current) {
        const positions = backgroundParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const sizes = backgroundParticlesRef.current.geometry.attributes.size.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          // Update positions and handle bounds
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

        backgroundParticlesRef.current.geometry.attributes.position.needsUpdate = true;
        backgroundParticlesRef.current.geometry.attributes.size.needsUpdate = true;
      }

      // Update main particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          if (!isExploding) {
            // Normal particle behavior
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Spring force back to initial positions
            const dx = initialPositions[i] - positions[i];
            const dy = initialPositions[i + 1] - positions[i + 1];
            const dz = initialPositions[i + 2] - positions[i + 2];
            
            velocities[i] += dx * 0.0001;
            velocities[i + 1] += dy * 0.0001;
            velocities[i + 2] += dz * 0.0001;

            // Damping
            velocities[i] *= 0.99;
            velocities[i + 1] *= 0.99;
            velocities[i + 2] *= 0.99;
          } else {
            // Explosion effect
            velocities[i] += (Math.random() - 0.5) * 0.2;
            velocities[i + 1] += (Math.random() - 0.5) * 0.2;
            velocities[i + 2] += (Math.random() - 0.5) * 0.2;

            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            sizes[i / 3] *= 1;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.geometry.attributes.size.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resizing
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (backgroundRef.current && rendererRef.current) {
        backgroundRef.current.removeChild(rendererRef.current.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isExploding]);

  // Handle user acceptance of terms
  const handleAccept = () => {
    setIsChecked(true);
    setTimeout(() => {
      setIsExploding(true);
      setTimeout(onAccept, 5000);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative">
      <div ref={backgroundRef} className="absolute inset-0" style={{ zIndex: 0 }} />
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="bg-red-600 text-white p-4 rounded mb-4 max-w-2xl text-center">
          <strong>Photosensitivity Warning:</strong> This page contains moving particles and lights. 
          Viewer discretion is advised.
        </div>
        <div ref={mountRef} className="w-full h-64 mb-8" />
        <h1 className="text-4xl font-bold mb-6 pt-20">Disclaimer</h1>
        <p className="text-center max-w-2xl mb-6">
          The content on The Zone represents an artistic exploration of the flow of news and media in the 21st century,
          using advanced Deep Learning techniques to classify and analyze articles across various topics. While every
          effort has been made to use technology to gain insights and organize information, these methods are not
          infallible. Visitors should approach the content with critical thinking and caution.
        </p>
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="mr-2"
          />
          <label>I have read and accept the terms and conditions</label>
        </div>
        <button
          onClick={handleAccept}
          disabled={!isChecked || isExploding}
          className={`px-6 py-2 rounded ${isChecked && !isExploding ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-500 cursor-not-allowed'
        }`}
      >
        {isExploding ? 'Entering The Zone...' : 'Enter The Zone'}
      </button>
    </div>
  </div>
);
};

export default DisclaimerPage;