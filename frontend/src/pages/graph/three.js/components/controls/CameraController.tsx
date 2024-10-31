import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { VISUALIZATION_CONSTANTS, ANIMATION_CONSTANTS } from '../../utils/constants';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';


interface CameraControllerProps {
    target: THREE.Vector3 | null;
    resetView: boolean;
    onTransitionComplete?: () => void;
}

export const CameraController: React.FC<CameraControllerProps> = ({
    target,
    resetView,
    onTransitionComplete
}) => {
    const { camera, gl } = useThree();
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const targetRef = useRef<THREE.Vector3 | null>(null);
    const startTargetRef = useRef<THREE.Vector3 | null>(null);
    const transitionProgressRef = useRef(0);

    // Initialize keyboard controls
    useKeyboardControls(VISUALIZATION_CONSTANTS.CAMERA_MOVE_SPEED);

    useEffect(() => {
        if (target || resetView) {
            setIsTransitioning(true);
            startTargetRef.current = controlsRef.current?.target.clone() || new THREE.Vector3();
            targetRef.current = target ? target.clone() : new THREE.Vector3(0, 0, 0);
            transitionProgressRef.current = 0;
            
            if (camera.position.length() === 0) {
                camera.position.copy(VISUALIZATION_CONSTANTS.DEFAULT_CAMERA_POSITION);
            }
        }
    }, [target, resetView, camera]);

    useFrame(() => {
        if (controlsRef.current && isTransitioning && targetRef.current && startTargetRef.current) {
            transitionProgressRef.current += ANIMATION_CONSTANTS.TRANSITION_DURATION;
            const progress = Math.min(1, transitionProgressRef.current);

            controlsRef.current.target.lerpVectors(
                startTargetRef.current,
                targetRef.current,
                progress
            );

            if (progress >= 1) {
                setIsTransitioning(false);
                targetRef.current = null;
                startTargetRef.current = null;
                transitionProgressRef.current = 0;
                onTransitionComplete?.();
            }

            controlsRef.current.update();
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            enableDamping
            dampingFactor={VISUALIZATION_CONSTANTS.CAMERA_SETTINGS.DAMPING_FACTOR}
            enableZoom={true}
            enableRotate={true}
            enablePan={true}
            minDistance={VISUALIZATION_CONSTANTS.CAMERA_SETTINGS.MIN_DISTANCE}
            maxDistance={VISUALIZATION_CONSTANTS.CAMERA_SETTINGS.MAX_DISTANCE}
            target0={new THREE.Vector3(0, 0, 0)}
        />
    );
};