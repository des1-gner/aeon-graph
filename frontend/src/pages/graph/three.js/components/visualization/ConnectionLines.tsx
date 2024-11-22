import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Article } from '../../types/article';
import { EdgeOptions } from '../../types/filters';
import { hasActiveFilters, matchesFilter } from '../../utils/filters';

// Add the missing Distance interface
interface Distance {
  index: number;
  distance: number;
}

interface ConnectionLinesProps {
  articles: Article[];
  positions: Float32Array;
  edgeOptions: EdgeOptions;
  edgeColor: string;
  hoveredParticle: number | null;
}

/**
 * ConnectionLines component creates visual connections between articles in 3D space
 * Connects each article to its two nearest neighbors that match the filter criteria
 */
export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  articles,
  positions,
  edgeOptions,
  edgeColor,
  hoveredParticle,
}) => {
  // Refs for Three.js objects
  const lineRef = useRef<THREE.LineSegments | null>(null);
  const materialRef = useRef<THREE.LineBasicMaterial | null>(null);

  // Calculate distance between two 3D points
  const calculateDistance = (index1: number, index2: number): number => {
    const x1 = positions[index1 * 3];
    const y1 = positions[index1 * 3 + 1];
    const z1 = positions[index1 * 3 + 2];
    const x2 = positions[index2 * 3];
    const y2 = positions[index2 * 3 + 1];
    const z2 = positions[index2 * 3 + 2];

    return Math.sqrt(
      Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)
    );
  };

  // Find two nearest neighbors for an article that match the filter
  const findNearestNeighbors = (
    articleIndex: number,
    excludeIndices: Set<number> = new Set()
  ): number[] => {
    const distances: Distance[] = [];
    const article = articles[articleIndex];

    articles.forEach((neighbor, index) => {
      if (
        index !== articleIndex &&
        !excludeIndices.has(index) &&
        matchesFilter(article, edgeOptions) &&
        matchesFilter(neighbor, edgeOptions)
      ) {
        distances.push({
          index,
          distance: calculateDistance(articleIndex, index),
        });
      }
    });

    // Sort by distance and take the two nearest
    return distances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .map(d => d.index);
  };

  // Update line connections every frame
  useFrame(() => {
    if (lineRef.current && materialRef.current) {
      const geometry = lineRef.current.geometry as THREE.BufferGeometry;
      const vertices: number[] = [];
      
      // Check if any filters are active
      const isEdgeActive = hasActiveFilters(edgeOptions);

      // Two nearest neighbors logic for 'on' visibility
      if (edgeOptions.visibility === 'on' && isEdgeActive) {
        // Track connected pairs to avoid duplicates
        const connectedPairs = new Set<string>();

        articles.forEach((_, i) => {
          const nearestNeighbors = findNearestNeighbors(i);
          
          nearestNeighbors.forEach(neighborIndex => {
            // Create a unique key for this pair
            const pairKey = [Math.min(i, neighborIndex), Math.max(i, neighborIndex)].join('-');
            
            // Only add if we haven't already connected these articles
            if (!connectedPairs.has(pairKey)) {
              connectedPairs.add(pairKey);
              vertices.push(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2],
                positions[neighborIndex * 3],
                positions[neighborIndex * 3 + 1],
                positions[neighborIndex * 3 + 2]
              );
            }
          });
        });
      }
      // All connections for hovered particle
      else if (
        edgeOptions.visibility === 'hover' &&
        hoveredParticle !== null &&
        isEdgeActive
      ) {
        const hoveredArticle = articles[hoveredParticle];
        // Create connections between hovered article and all other matching articles
        articles.forEach((article, index) => {
          if (
            index !== hoveredParticle &&
            matchesFilter(hoveredArticle, edgeOptions) &&
            matchesFilter(article, edgeOptions)
          ) {
            // Add vertex pairs for line segments
            vertices.push(
              positions[hoveredParticle * 3],     // x1
              positions[hoveredParticle * 3 + 1], // y1
              positions[hoveredParticle * 3 + 2], // z1
              positions[index * 3],               // x2
              positions[index * 3 + 1],           // y2
              positions[index * 3 + 2]            // z2
            );
          }
        });
      }

      // Update geometry with new vertices
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.attributes.position.needsUpdate = true;

      // Update material properties
      materialRef.current.color = new THREE.Color(edgeColor);
      materialRef.current.visible = edgeOptions.visibility !== 'off';
      materialRef.current.opacity = edgeOptions.visibility === 'hover' ? 0.5 : 1;
    }
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        depthTest={true}
      />
    </lineSegments>
  );
};