import * as THREE from 'three';
import { VISUALIZATION_CONSTANTS } from './constants';

/**
 * Generates a random point within a sphere using spherical coordinates.
 * Uses a uniform distribution to ensure points are evenly distributed throughout the sphere volume.
 * 
 * The algorithm works by:
 * 1. Generating random spherical coordinates (r, phi, theta)
 * 2. Converting them to Cartesian coordinates (x, y, z)
 * 3. Using cube root of random for radius to ensure uniform distribution
 * 
 * @param radius - The radius of the sphere in which to generate the point
 * @returns THREE.Vector3 - A new vector representing a random point in the sphere
 */
export const generateRandomPointInSphere = (radius: number): THREE.Vector3 => {
    // Generate random angle from zenith (phi) using arccos for uniform distribution
    const phi = Math.acos(2 * Math.random() - 1);
    
    // Generate random azimuthal angle (theta)
    const theta = 2 * Math.PI * Math.random();
    
    // Generate random radius using cube root for uniform volume distribution
    const r = Math.cbrt(Math.random()) * radius;
    
    // Convert spherical coordinates to Cartesian coordinates
    return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta), // x coordinate
        r * Math.sin(phi) * Math.sin(theta), // y coordinate
        r * Math.cos(phi)                    // z coordinate
    );
};

/**
 * Checks if a given position collides with any existing positions.
 * A collision occurs when the distance between two points is less than the minimum allowed distance.
 * 
 * @param position - The position to check for collisions
 * @param existingPositions - Array of existing positions to check against
 * @param minDistance - Minimum allowed distance between points
 * @returns boolean - True if collision detected, false otherwise
 */
export const checkCollision = (
    position: THREE.Vector3,
    existingPositions: THREE.Vector3[],
    minDistance: number
): boolean => {
    // Use Array.some() to check if any existing position is too close
    return existingPositions.some(existing => 
        position.distanceTo(existing) < minDistance
    );
};

/**
 * Finds a valid position for a new point that doesn't collide with existing points.
 * Uses an iterative approach with collision detection and distance reduction if needed.
 * 
 * The algorithm:
 * 1. Generates random positions until finding one without collisions
 * 2. If too many attempts fail, reduces the minimum distance requirement
 * 3. Continues until either finding a valid position or reaching minimum distance threshold
 * 
 * @param radius - The radius of the sphere in which to generate points
 * @param existingPositions - Array of existing point positions to avoid
 * @param minDistance - Initial minimum distance required between points
 * @param maxAttempts - Maximum number of attempts before reducing minDistance (default: 50)
 * @returns THREE.Vector3 - A valid position for the new point
 */
export const findValidPosition = (
    radius: number,
    existingPositions: THREE.Vector3[],
    minDistance: number,
    maxAttempts: number = 50
): THREE.Vector3 => {
    let attempts = 0;
    let position: THREE.Vector3;
    
    do {
        // Generate a new random position
        position = generateRandomPointInSphere(radius);
        attempts++;
        
        // If too many attempts, reduce minimum distance requirement by 10%
        if (attempts > maxAttempts) {
            minDistance *= 0.9;
            attempts = 0;
        }
    } while (
        // Continue loop if position collides and minDistance hasn't gotten too small
        checkCollision(position, existingPositions, minDistance) && 
        minDistance > 0.1
    );
    
    return position;
};