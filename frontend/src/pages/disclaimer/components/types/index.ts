// Import required Three.js components and controls
import { Points, Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

/**
 * Parameters required for the particle explosion animation
 * Contains all necessary Three.js objects and animation state
 */
export interface AnimationParams {
  // Core Three.js scene components
  scene: Scene;                    // Main Three.js scene containing all objects
  camera: PerspectiveCamera;       // Camera defining the viewpoint
  renderer: WebGLRenderer;         // WebGL renderer for drawing the scene
  controls: OrbitControls;         // Orbit controls for camera manipulation

  // Particle system components
  particles: Points;               // Main particle system for the explosion effect
  backgroundParticles: Points;     // Secondary particle system for background effects
  
  // Animation state
  isExploding: boolean;            // Flag indicating if explosion animation is active
  frameIdRef: React.MutableRefObject<number | null>;  // Reference to store animation frame ID for cleanup
  
  // Particle movement data
  velocities: Float32Array;        // Velocity vectors for main particles
  backgroundVelocities: Float32Array;  // Velocity vectors for background particles
  initialPositions: Float32Array;  // Starting positions for resetting particles
}

/**
 * Groups together all particle-related components
 * Used for managing the particle systems separately from scene setup
 */
export interface ParticleSystem {
  // Main particle systems
  particles: Points;               // Primary particle system
  backgroundParticles: Points;     // Background particle system
  
  // Particle physics data
  velocities: Float32Array;        // Main particle velocities
  backgroundVelocities: Float32Array;  // Background particle velocities
  initialPositions: Float32Array;  // Original particle positions for reset
}

/**
 * Basic Three.js scene configuration
 * Contains essential components for rendering 3D graphics
 */
export interface SceneSetup {
  scene: Scene;                    // Container for all 3D objects
  camera: PerspectiveCamera;       // Defines view frustum and perspective
  renderer: WebGLRenderer;         // Handles rendering to canvas
  controls: OrbitControls;         // Camera controls for user interaction
}