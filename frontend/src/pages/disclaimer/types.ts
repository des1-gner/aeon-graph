// pages/disclaimer/types.ts
import { Points, Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface AnimationParams {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: OrbitControls;
  particles: Points;
  backgroundParticles: Points;
  isExploding: boolean;
  frameIdRef: React.MutableRefObject<number | null>;
  velocities: Float32Array;
  backgroundVelocities: Float32Array;
  initialPositions: Float32Array;
}

export interface ParticleSystem {
  particles: Points;
  backgroundParticles: Points;
  velocities: Float32Array;
  backgroundVelocities: Float32Array;
  initialPositions: Float32Array;
}

export interface SceneSetup {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: OrbitControls;
}