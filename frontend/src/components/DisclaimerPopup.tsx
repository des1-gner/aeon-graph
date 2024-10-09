import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface DisclaimerPageProps {
  onAccept: () => void;
}

const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 300, 0.1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, 300);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

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
      ctx.fillText('The Zone', canvas.width / 2, canvas.height / 2 + 100);

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

        sizes[i] = Math.random() * 5 + 2;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

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

    const material = new THREE.ShaderMaterial({
      uniforms: {
        // Add any uniforms if needed
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      vertexColors: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    particlesRef.current = particles;

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      controls.update();

      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;

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

            sizes[i / 3] *= 0.99;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
        particlesRef.current.geometry.attributes.size.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / 300;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, 300);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isExploding]);

  const handleAccept = () => {
    setIsChecked(true);
    setTimeout(() => {
      setIsExploding(true);
      setTimeout(onAccept, 5000);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="bg-red-600 text-white p-4 rounded mb-4 max-w-2xl text-center">
        <strong>WARNING:</strong> This page contains moving particles and flashing lights. 
        It may potentially trigger seizures for people with photosensitive epilepsy. 
        Viewer discretion is advised.
      </div>
      <div ref={mountRef} className="w-full h-64 mb-8" />
      <h1 className="text-4xl font-bold mb-6">Disclaimer</h1>
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
        className={`px-6 py-2 rounded ${
          isChecked && !isExploding ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-500 cursor-not-allowed'
        }`}
      >
        {isExploding ? 'Entering The Zone...' : 'Enter The Zone'}
      </button>
    </div>
  );
};

export default DisclaimerPage;