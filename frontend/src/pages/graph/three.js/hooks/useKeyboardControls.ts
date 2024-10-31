// Custom hook for handling keyboard controls in a Three.js scene using React Three Fiber
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_CONTROL_CONSTANTS } from '../utils/constants';
const { KEY_CODES } = CAMERA_CONTROL_CONSTANTS;

// Define interface for tracking pressed keys
interface KeyMap {
    [key: string]: boolean;
}

// Custom hook that manages keyboard controls for camera movement
// @param speed - Movement speed of the camera (optional, defaults to MOVEMENT_SPEED constant)
// @returns object containing isMoving state indicating if any movement key is pressed
export const useKeyboardControls = (speed: number = CAMERA_CONTROL_CONSTANTS.MOVEMENT_SPEED) => {
    // Get access to the Three.js camera from React Three Fiber
    const { camera } = useThree();

    // Create a ref to store the current state of pressed keys
    // Using ref instead of state to avoid re-renders on key changes
    const keys = useRef<KeyMap>({
        // Initialize all movement keys as not pressed
        [KEY_CODES.ARROW_UP]: false,    // Up arrow key
        [KEY_CODES.ARROW_DOWN]: false,  // Down arrow key
        [KEY_CODES.ARROW_LEFT]: false,  // Left arrow key
        [KEY_CODES.ARROW_RIGHT]: false, // Right arrow key
        [KEY_CODES.KEY_W]: false,       // W key (alternative to up)
        [KEY_CODES.KEY_S]: false,       // S key (alternative to down)
        [KEY_CODES.KEY_A]: false,       // A key (alternative to left)
        [KEY_CODES.KEY_D]: false,       // D key (alternative to right)
    });

    // Set up event listeners for keyboard input
    useEffect(() => {
        // Handler for keydown events - marks keys as pressed
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code in keys.current) {
                keys.current[event.code] = true;
            }
        };

        // Handler for keyup events - marks keys as released
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code in keys.current) {
                keys.current[event.code] = false;
            }
        };

        // Add event listeners when component mounts
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Clean up event listeners when component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Update camera position on each frame based on pressed keys
    useFrame(() => {
        // Check which movement keys are currently pressed
        // Combines arrow keys and WASD controls
        const moveForward = keys.current[KEY_CODES.ARROW_UP] || keys.current[KEY_CODES.KEY_W];
        const moveBackward = keys.current[KEY_CODES.ARROW_DOWN] || keys.current[KEY_CODES.KEY_S];
        const moveLeft = keys.current[KEY_CODES.ARROW_LEFT] || keys.current[KEY_CODES.KEY_A];
        const moveRight = keys.current[KEY_CODES.ARROW_RIGHT] || keys.current[KEY_CODES.KEY_D];

        // Create a vector to store the movement direction
        const moveVector = new THREE.Vector3();

        // Get current camera rotation
        const quat = camera.quaternion.clone();

        // Note: The following movement calculations are currently commented out
        // if (moveForward) moveVector.z -= speed;
        // if (moveBackward) moveVector.z += speed;
        // if (moveLeft) moveVector.x -= speed;
        // if (moveRight) moveVector.x += speed;

        // Apply camera rotation to movement vector
        moveVector.applyQuaternion(quat);

        // Update camera position
        camera.position.add(moveVector);
    });

    // Return whether any movement key is currently pressed
    return { isMoving: Object.values(keys.current).some(key => key) };
};