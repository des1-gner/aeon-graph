import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface DisclaimerPageProps {
  onAccept: () => void; // Callback function triggered when user accepts disclaimer
}

/**
 * A React component that renders an interactive disclaimer page with 3D particle effects.
 * Features a dynamic particle system that forms a dot shape and explodes when the user accepts.
 * 
 * @param {DisclaimerPageProps} props - Component props
 * @returns {JSX.Element} Rendered disclaimer page
 */
const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onAccept }) => {
  // State management
  const [isChecked, setIsChecked] = useState(false);     // Tracks checkbox state
  const [isExploding, setIsExploding] = useState(false); // Controls particle explosion animation

  // Refs for THREE.js elements
  const mountRef = useRef<HTMLDivElement>(null);         // Container for main content
  const backgroundRef = useRef<HTMLDivElement>(null);    // Container for THREE.js canvas
  const sceneRef = useRef<THREE.Scene | null>(null);     // THREE.js scene
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null); // Main particle system
  const backgroundParticlesRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number | null>(null);        // Animation frame ID for cleanup
  
  useEffect(() => {
    if (!mountRef.current || !backgroundRef.current) return;

    // Initialize THREE.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    backgroundRef.current.appendChild(renderer.domElement);

    // Setup camera controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Create background particle system for ambient effects
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

    // Load particle texture (base64 encoded dot image)
    const particleTexture = new THREE.TextureLoader().load('data:image/png;base64,...'); // Base64 string truncated for brevity

    // Configure background particle material
    const backgroundMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 5,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    });

    const backgroundParticles = new THREE.Points(backgroundGeometry, backgroundMaterial);
    scene.add(backgroundParticles);

    // Setup main particle system for dot formation
    const geometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const initialPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    // Create canvas for generating dot shape
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 4192;
      canvas.height = 2028;
      ctx.font = 'Bold 768px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('.', canvas.width / 2, canvas.height / 2 + 100);

      // Sample pixels from the canvas to position particles in dot shape
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < particleCount; i++) {
        // Find valid position within the dot shape
        let x, y;
        do {
          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height;
        } while (!data[(Math.floor(y) * canvas.width + Math.floor(x)) * 4 + 3]);

        const initialX = (x - canvas.width / 2) * 0.15;
        const initialY = (canvas.height / 2 - y) * 0.15;
        
        // Set initial positions and properties
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

    // Configure main particle geometry
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
        if (length(center) > 0.5) discard;
        gl_FragColor = vec4(vColor, 1.0);
      }
    `;

    // Create shader material for main particles
    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader,
      fragmentShader,
      transparent: true,
      vertexColors: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Store references for animation loop
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

        // Move background particles and handle bounds
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += backgroundVelocities[i];
          positions[i + 1] += backgroundVelocities[i + 1];

          // Bounce off screen edges
          if (Math.abs(positions[i]) > window.innerWidth / 2) {
            backgroundVelocities[i] *= -1;
          }
          if (Math.abs(positions[i + 1]) > window.innerHeight / 2) {
            backgroundVelocities[i + 1] *= -1;
          }

          // Gradually increase particle size
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
            // Normal animation: particles move with slight randomness but return to original positions
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Calculate spring force back to original position
            const dx = initialPositions[i] - positions[i];
            const dy = initialPositions[i + 1] - positions[i + 1];
            const dz = initialPositions[i + 2] - positions[i + 2];
            
            velocities[i] += dx * 0.0001;
            velocities[i + 1] += dy * 0.0001;
            velocities[i + 2] += dz * 0.0001;

            // Apply damping
            velocities[i] *= 0.99;
            velocities[i + 1] *= 0.99;
            velocities[i + 2] *= 0.99;
          } else {
            // Explosion animation: particles scatter randomly
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

  /**
   * Handles user acceptance of disclaimer
   * Triggers explosion animation and calls onAccept callback after delay
   */
  const handleAccept = () => {
    setIsChecked(true);
    setTimeout(() => {
      setIsExploding(true);
      setTimeout(onAccept, 5000); // Call onAccept after explosion animation
    }, 0);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative">
      {/* THREE.js canvas container */}
      <div ref={backgroundRef} className="absolute inset-0" style={{ zIndex: 0 }} />
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Photosensitivity warning */}
        <div className="bg-red-600 text-white p-4 rounded mb-4 max-w-2xl text-center">
          <strong>Photosensitivity Warning:</strong> This page contains moving particles and lights. 
          Viewer discretion is advised.
        </div>
        
        {/* Particle container */}
        <div ref={mountRef} className="w-full h-64 mb-8" />
        
        {/* Disclaimer content */}
        <h1 className="text-4xl font-bold mb-6 pt-20">Disclaimer</h1>
        <p className="text-center max-w-2xl mb-6">
          The content on The Zone represents an artistic exploration of the flow of news and media in the 21st century,
          using advanced Deep Learning techniques to classify and analyze articles across various topics. While every
          effort has been made to use technology to gain insights and organize information, these methods are not
          infallible. Visitors should approach the content with critical thinking and caution.
        </p>
        
        {/* Acceptance checkbox */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            className="mr-2"
          />
          <label>I have read and accept the terms and conditions</label>
        </div>
        
        {/* Accept button */}
        <button
          onClick={handleAccept}
          disabled={!isChecked || isExploding}
          className={`px-6 py-2 rounded ${
            isChecked && !isExploding ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-500 cursor-not-allowed'
          }`}
        >
          {isExploding ? 'Entering The Zone...' : 'Enter The Zone'}
        </button>
      </div>
    </div>
  );
};

export default DisclaimerPage;