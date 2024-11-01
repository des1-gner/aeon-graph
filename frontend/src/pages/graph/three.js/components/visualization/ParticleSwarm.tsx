// Main component for visualizing articles as an interactive 3D particle swarm
// Handles particle positioning, clustering, and animations using Three.js
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Article } from '../../types/article';
import { HighlightOptions, ClusterOptions, EdgeOptions } from '../../types/filters';
import { VISUALIZATION_CONSTANTS, ANIMATION_CONSTANTS } from '../../utils/constants';
import { matchesFilter } from '../../utils/filters';
import { Particle } from './Particle';
import { ConnectionLines } from './ConnectionLines';
import { findValidPosition } from '../../utils/geometry';

// Authors Oisin Aeonn, and Chris Partridge

const {
    SPHERE_RADIUS,
    CLUSTER_RADIUS,
    OUTER_SPHERE_PADDING,
} = VISUALIZATION_CONSTANTS;

// Props interface defining required properties for particle visualization
interface ParticleSwarmProps {
    articles: Article[];
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;
    edgeOptions: EdgeOptions;
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
}

export const ParticleSwarm: React.FC<ParticleSwarmProps> = ({
    articles,
    setSelectedArticle,
    highlightOptions,
    clusterOptions,
    edgeOptions,
    highlightColor,
    clusterColor,
    edgeColor,
}) => {
    // Store particle positions in TypedArrays for performance
    const positionsRef = useRef<Float32Array>(new Float32Array(articles.length * 3));
    const targetPositionsRef = useRef<Float32Array>(new Float32Array(articles.length * 3));
    const [hoveredParticle, setHoveredParticle] = useState<number | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize particle positions in a spherical distribution
    useEffect(() => {
        const existingPositions: THREE.Vector3[] = [];
        const minDistance = Math.max(1, (SPHERE_RADIUS * 2) / Math.cbrt(articles.length));
        
        articles.forEach((_, i) => {
            const position = findValidPosition(
                SPHERE_RADIUS - OUTER_SPHERE_PADDING,
                existingPositions,
                minDistance
            );
            
            existingPositions.push(position.clone());
            
            positionsRef.current[i * 3] = position.x;
            positionsRef.current[i * 3 + 1] = position.y;
            positionsRef.current[i * 3 + 2] = position.z;
            
            targetPositionsRef.current[i * 3] = position.x;
            targetPositionsRef.current[i * 3 + 1] = position.y;
            targetPositionsRef.current[i * 3 + 2] = position.z;
        });

        setIsInitialized(true);
    }, [articles]);

    // Update particle clustering based on filter options
    useEffect(() => {
        if (!isInitialized) return;

        const existingPositions: THREE.Vector3[] = [];
        const matchingArticles = articles.filter(article => 
            matchesFilter(article, clusterOptions)
        );
        
        const nonMatchingArticles = articles.filter(article => 
            !matchesFilter(article, clusterOptions)
        );
        
        const innerMinDistance = Math.max(0.5, (CLUSTER_RADIUS * 2) / Math.cbrt(matchingArticles.length));
        const outerMinDistance = Math.max(1, ((SPHERE_RADIUS - OUTER_SPHERE_PADDING) * 2) / Math.cbrt(nonMatchingArticles.length));
        
        matchingArticles.forEach((article) => {
            const index = articles.indexOf(article);
            const position = findValidPosition(
                CLUSTER_RADIUS,
                existingPositions,
                innerMinDistance
            );
            
            existingPositions.push(position.clone());
            targetPositionsRef.current[index * 3] = position.x;
            targetPositionsRef.current[index * 3 + 1] = position.y;
            targetPositionsRef.current[index * 3 + 2] = position.z;
        });
        
        nonMatchingArticles.forEach((article) => {
            const index = articles.indexOf(article);
            const position = findValidPosition(
                SPHERE_RADIUS - OUTER_SPHERE_PADDING,
                existingPositions,
                outerMinDistance
            );
            
            existingPositions.push(position.clone());
            targetPositionsRef.current[index * 3] = position.x;
            targetPositionsRef.current[index * 3 + 1] = position.y;
            targetPositionsRef.current[index * 3 + 2] = position.z;
        });
    }, [articles, clusterOptions, isInitialized]);

    // Animate particles towards their target positions each frame
    useFrame(() => {
        if (!isInitialized) return;
        
        const LERP_FACTOR = ANIMATION_CONSTANTS.LERP_FACTORS.POSITION;
        articles.forEach((_, i) => {
            positionsRef.current[i * 3] += (
                targetPositionsRef.current[i * 3] - positionsRef.current[i * 3]
            ) * LERP_FACTOR;
            positionsRef.current[i * 3 + 1] += (
                targetPositionsRef.current[i * 3 + 1] - positionsRef.current[i * 3 + 1]
            ) * LERP_FACTOR;
            positionsRef.current[i * 3 + 2] += (
                targetPositionsRef.current[i * 3 + 2] - positionsRef.current[i * 3 + 2]
            ) * LERP_FACTOR;
        });
    });

    return (
        <>
            <ambientLight intensity={VISUALIZATION_CONSTANTS.LIGHTING.AMBIENT_INTENSITY} />
            <pointLight 
                position={VISUALIZATION_CONSTANTS.LIGHTING.POINT_LIGHT_POSITION.toArray()} 
                intensity={VISUALIZATION_CONSTANTS.LIGHTING.POINT_LIGHT_INTENSITY} 
            />
            <directionalLight 
                position={VISUALIZATION_CONSTANTS.LIGHTING.DIRECTIONAL_LIGHT_POSITION.toArray()} 
                intensity={VISUALIZATION_CONSTANTS.LIGHTING.DIRECTIONAL_LIGHT_INTENSITY} 
                castShadow 
            />
            {isInitialized && articles.map((article, index) => (
                <Particle
                    key={article.articleId}
                    index={index}
                    positions={positionsRef.current}
                    article={article}
                    highlightOptions={highlightOptions}
                    clusterOptions={clusterOptions}
                    highlightColor={highlightColor}
                    clusterColor={clusterColor}
                    setSelectedArticle={setSelectedArticle}
                    setHoveredParticle={setHoveredParticle}
                />
            ))}
            <ConnectionLines
                articles={articles}
                positions={positionsRef.current}
                edgeOptions={edgeOptions}
                edgeColor={edgeColor}
                hoveredParticle={hoveredParticle}
            />
        </>
    );
};