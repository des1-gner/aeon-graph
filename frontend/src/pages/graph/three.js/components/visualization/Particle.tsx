// Import necessary dependencies from React and Three.js libraries
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Article } from '../../types/article';
import { HighlightOptions, ClusterOptions } from '../../types/filters';
import { VISUALIZATION_CONSTANTS } from '../../utils/constants';
import { matchesFilter } from '../../utils/filters';

// Authors Oisin Aeonn, and Chris Partridge

// Destructure visualization constants for easier access
const {
    DEFAULT_COLOR,
    DEFAULT_OPACITY,
    ACTIVE_OPACITY,
} = VISUALIZATION_CONSTANTS;

// Define the props interface for the Particle component
interface ParticleProps {
    index: number;                // Index of the particle in the visualization
    positions: Float32Array;      // Array containing positions of all particles
    article: Article;             // Article data associated with this particle
    highlightOptions: HighlightOptions;  // Options for highlighting particles
    clusterOptions: ClusterOptions;      // Options for clustering particles
    highlightColor: string;              // Color to use for highlighted particles
    clusterColor: string;                // Color to use for clustered particles
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;  // Callback for article selection
    setHoveredParticle: (index: number | null) => void;  // Callback for hover state
}

// Particle component representing a single article in 3D space
export const Particle: React.FC<ParticleProps> = ({
    index,
    positions,
    article,
    highlightOptions,
    clusterOptions,
    highlightColor,
    clusterColor,
    setSelectedArticle,
    setHoveredParticle,
}) => {
    // Refs for accessing Three.js objects
    const meshRef = useRef<THREE.Mesh>(null);                          // Reference to the particle mesh
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);      // Reference to the particle material
    const labelRef = useRef<THREE.Group>(null);                        // Reference to the text label group

    // Memoized values for performance optimization
    const isHighlighted = useMemo(
        () => matchesFilter(article, highlightOptions),
        [article, highlightOptions]
    );

    const isInCluster = useMemo(
        () => matchesFilter(article, clusterOptions),
        [article, clusterOptions]
    );

    // Function to determine particle visual state based on highlight and cluster status
    const getParticleState = () => {
        if (isHighlighted && isInCluster) {
            // Blend highlight and cluster colors if both states are active
            const blendedColor = new THREE.Color(highlightColor)
                .lerp(new THREE.Color(clusterColor), 0.5);
            return {
                color: blendedColor,
                opacity: ACTIVE_OPACITY,
                emissiveIntensity: 1.5
            };
        }

        if (isHighlighted) {
            // Apply highlight color and properties
            return {
                color: new THREE.Color(highlightColor),
                opacity: ACTIVE_OPACITY,
                emissiveIntensity: 1.0
            };
        }

        if (isInCluster) {
            // Apply cluster color and properties
            return {
                color: new THREE.Color(clusterColor),
                opacity: ACTIVE_OPACITY,
                emissiveIntensity: 1.0
            };
        }

        // Default state when neither highlighted nor clustered
        return {
            color: DEFAULT_COLOR,
            opacity: DEFAULT_OPACITY,
            emissiveIntensity: 0.2
        };
    };

    // Update particle position and appearance every frame
    useFrame(({ camera }) => {
        if (meshRef.current && materialRef.current && labelRef.current) {
            // Calculate target position from positions array
            const targetPosition = new THREE.Vector3(
                positions[index * 3],
                positions[index * 3 + 1],
                positions[index * 3 + 2]
            );

            // Smoothly interpolate to target position
            meshRef.current.position.lerp(targetPosition, 0.1);
            // Update label position to follow particle with slight offset
            labelRef.current.position.copy(targetPosition).add(new THREE.Vector3(0, -0.5, 0));
            // Make label face camera
            labelRef.current.quaternion.copy(camera.quaternion);

            // Update particle material properties
            const { color, opacity, emissiveIntensity } = getParticleState();
            
            materialRef.current.color.lerp(color, 0.1);
            materialRef.current.emissive.lerp(color, 0.1);
            materialRef.current.opacity = opacity;
            materialRef.current.emissiveIntensity = emissiveIntensity;
        }
    });

    return (
        <group>
            {/* Particle sphere mesh */}
            <mesh
                ref={meshRef}
                onClick={(event) => {
                    event.stopPropagation();
                    if (meshRef.current) {
                        setSelectedArticle(article, meshRef.current.position.clone());
                    }
                }}
                onPointerOver={() => setHoveredParticle(index)}
                onPointerOut={() => setHoveredParticle(null)}
            >
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshPhysicalMaterial
                    ref={materialRef}
                    color={DEFAULT_COLOR}
                    emissive={DEFAULT_COLOR}
                    emissiveIntensity={0.2}
                    transparent
                    opacity={DEFAULT_OPACITY}
                    roughness={0.5}
                    metalness={0.8}
                />
            </mesh>
            {/* Text label showing article title and source */}
            <group ref={labelRef}>
                <Text
                    color={DEFAULT_COLOR}
                    fontSize={0.15}
                    maxWidth={5}
                    lineHeight={1}
                    letterSpacing={0.02}
                    textAlign="center"
                    font="/fonts/eurostile-bold.ttf"
                    anchorX="center"
                    anchorY="middle"
                >
                    {`${article.title || 'Untitled'} | ${article.source || 'Unknown Source'}`}
                </Text>
            </group>
        </group>
    );
};