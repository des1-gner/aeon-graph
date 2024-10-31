import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { initScene, createParticles, animate } from '../utils/three';

interface ParticleEffectProps {
  isExploding: boolean;
}

export const ParticleEffect: React.FC<ParticleEffectProps> = ({ isExploding }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const backgroundParticlesRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!backgroundRef.current) return;

    const { scene, camera, renderer, controls } = initScene(backgroundRef.current);
    const {
      particles,
      backgroundParticles,
      velocities,
      backgroundVelocities,
      initialPositions
    } = createParticles(scene);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    particlesRef.current = particles;
    backgroundParticlesRef.current = backgroundParticles;

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

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

    return () => {
      cleanup();
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && backgroundRef.current) {
        backgroundRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [isExploding]);

  return (
    <div ref={backgroundRef} className="absolute inset-0" style={{ zIndex: 0 }} />
  );
};
