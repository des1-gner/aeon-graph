import * as THREE from 'three';
import { VISUALIZATION_CONSTANTS } from './constants';

export const generateRandomPointInSphere = (radius: number): THREE.Vector3 => {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const r = Math.cbrt(Math.random()) * radius;
    
    return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
    );
};

export const checkCollision = (
    position: THREE.Vector3,
    existingPositions: THREE.Vector3[],
    minDistance: number
): boolean => {
    return existingPositions.some(existing => 
        position.distanceTo(existing) < minDistance
    );
};

export const findValidPosition = (
    radius: number,
    existingPositions: THREE.Vector3[],
    minDistance: number,
    maxAttempts: number = 50
): THREE.Vector3 => {
    let attempts = 0;
    let position: THREE.Vector3;
    
    do {
        position = generateRandomPointInSphere(radius);
        attempts++;
        
        if (attempts > maxAttempts) {
            minDistance *= 0.9;
            attempts = 0;
        }
    } while (
        checkCollision(position, existingPositions, minDistance) && 
        minDistance > 0.1
    );
    
    return position;
};