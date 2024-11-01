import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { VISUALIZATION_CONSTANTS, ANIMATION_CONSTANTS } from '../../utils/constants';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';

/**
 * Props interface for the CameraController component
 * @interface CameraControllerProps
 * @property {THREE.Vector3 | null} target - The target position to move the camera to
 * @property {boolean} resetView - Flag to reset the camera to its default position
 * @property {() => void} [onTransitionComplete] - Optional callback function called when camera transition completes
 */
interface CameraControllerProps {
    target: THREE.Vector3 | null;
    resetView: boolean;
    onTransitionComplete?: () => void;
}

/**
 * Camera Controller component for handling camera movements and transitions in a Three.js scene
 * This component provides smooth camera transitions, orbit controls, and keyboard navigation
 */
export const CameraController: React.FC<CameraControllerProps> = ({
    target,
    resetView,
    onTransitionComplete
}) => {
    // Get access to Three.js camera and renderer from react-three-fiber context
    const { camera, gl } = useThree();
    
    // Reference to the OrbitControls instance for direct manipulation
    const controlsRef = useRef<OrbitControlsImpl>(null);
    
    // State to track if camera is currently in transition
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    // Refs to store target positions and transition progress
    const targetRef = useRef<THREE.Vector3 | null>(null);            // Destination position
    const startTargetRef = useRef<THREE.Vector3 | null>(null);       // Starting position
    const transitionProgressRef = useRef(0);                         // Progress of transition (0 to 1)

    // Initialize keyboard controls for camera movement
    useKeyboardControls(VISUALIZATION_CONSTANTS.CAMERA_MOVE_SPEED);

    /**
     * Effect to handle camera transition initialization
     * Triggers when target changes or view reset is requested
     */
    useEffect(() => {
        if (target || resetView) {
            setIsTransitioning(true);
            // Store current camera target position as starting point
            startTargetRef.current = controlsRef.current?.target.clone() || new THREE.Vector3();
            // Set target position (either provided target or origin for reset)
            targetRef.current = target ? target.clone() : new THREE.Vector3(0, 0, 0);
            // Reset transition progress
            transitionProgressRef.current = 0;
            
            // Set default camera position if not already set
            if (camera.position.length() === 0) {
                camera.position.copy(VISUALIZATION_CONSTANTS.DEFAULT_CAMERA_POSITION);
            }
        }
    }, [target, resetView, camera]);

    /**
     * Frame update hook for handling camera transitions
     * Performs smooth lerp between start and target positions
     */
    useFrame(() => {
        if (controlsRef.current && isTransitioning && targetRef.current && startTargetRef.current) {
            // Increment transition progress
            transitionProgressRef.current += ANIMATION_CONSTANTS.TRANSITION_DURATION;
            const progress = Math.min(1, transitionProgressRef.current);

            // Interpolate camera target position
            controlsRef.current.target.lerpVectors(
                startTargetRef.current,
                targetRef.current,
                progress
            );

            // Check if transition is complete
            if (progress >= 1) {
                setIsTransitioning(false);
                targetRef.current = null;
                startTargetRef.current = null;
                transitionProgressRef.current = 0;
                onTransitionComplete?.();
            }

            // Update orbit controls
            controlsRef.current.update();
        }
    });

    /**
     * Render OrbitControls component with configured parameters
     * Provides user interaction capabilities for camera movement
     */
    return (
        <OrbitControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            enableDamping                                                          // Enable smooth camera movement
            dampingFactor={VISUALIZATION_CONSTANTS.CAMERA_SETTINGS.DAMPING_FACTOR} // Control smoothing amount
            enableZoom={true}                                                      // Allow zoom in/out
            enableRotate={true}                                                    // Allow orbital rotation
            enablePan={true}                                                       // Allow panning
            minDistance={VISUALIZATION_CONSTANTS.CAMERA_SETTINGS.MIN_DISTANCE}     // Minimum zoom distance
            maxDistance={VISUALIZATION_CONSTANTS.CAMERA_SETTINGS.MAX_DISTANCE}     // Maximum zoom distance
            target0={new THREE.Vector3(0, 0, 0)}                                  // Default target position
        />
    );
};