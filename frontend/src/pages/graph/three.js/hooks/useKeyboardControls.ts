// src/pages/graph/three.js/hooks/useKeyboardControls.ts
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_CONTROL_CONSTANTS } from '../utils/constants';

const { KEY_CODES } = CAMERA_CONTROL_CONSTANTS;

interface KeyMap {
    [key: string]: boolean;
}

export const useKeyboardControls = (speed: number = CAMERA_CONTROL_CONSTANTS.MOVEMENT_SPEED) => {
    const { camera } = useThree();
    const keys = useRef<KeyMap>({
        [KEY_CODES.ARROW_UP]: false,
        [KEY_CODES.ARROW_DOWN]: false,
        [KEY_CODES.ARROW_LEFT]: false,
        [KEY_CODES.ARROW_RIGHT]: false,
        [KEY_CODES.KEY_W]: false,
        [KEY_CODES.KEY_S]: false,
        [KEY_CODES.KEY_A]: false,
        [KEY_CODES.KEY_D]: false,
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code in keys.current) {
                keys.current[event.code] = true;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code in keys.current) {
                keys.current[event.code] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        const moveForward = keys.current[KEY_CODES.ARROW_UP] || keys.current[KEY_CODES.KEY_W];
        const moveBackward = keys.current[KEY_CODES.ARROW_DOWN] || keys.current[KEY_CODES.KEY_S];
        const moveLeft = keys.current[KEY_CODES.ARROW_LEFT] || keys.current[KEY_CODES.KEY_A];
        const moveRight = keys.current[KEY_CODES.ARROW_RIGHT] || keys.current[KEY_CODES.KEY_D];

        const moveVector = new THREE.Vector3();
        const quat = camera.quaternion.clone();

        // if (moveForward) moveVector.z -= speed;
        // if (moveBackward) moveVector.z += speed;
        // if (moveLeft) moveVector.x -= speed;
        // if (moveRight) moveVector.x += speed;

        moveVector.applyQuaternion(quat);
        camera.position.add(moveVector);
    });

    return { isMoving: Object.values(keys.current).some(key => key) };
};