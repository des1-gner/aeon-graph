import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Article } from '../../types/article';
import { EdgeOptions } from '../../types/filters';
import { hasActiveFilters, matchesFilter } from '../../utils/filters';

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

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  articles,
  positions,
  edgeOptions,
  edgeColor,
  hoveredParticle,
}) => {
  const lineRef = useRef<THREE.LineSegments | null>(null);
  const materialRef = useRef<THREE.LineBasicMaterial | null>(null);

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

    return distances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .map(d => d.index);
  };

  useFrame(() => {
    if (lineRef.current && materialRef.current) {
      const geometry = lineRef.current.geometry as THREE.BufferGeometry;
      const vertices: number[] = [];
      
      const isEdgeActive = hasActiveFilters(edgeOptions);

      // Show connections when either in 'on' mode or when hovering in 'hover' mode
      if ((edgeOptions.visibility === 'on' || (edgeOptions.visibility === 'hover' && hoveredParticle !== null)) && isEdgeActive) {
        const connectedPairs = new Set<string>();

        articles.forEach((_, i) => {
          const nearestNeighbors = findNearestNeighbors(i);
          
          nearestNeighbors.forEach(neighborIndex => {
            const pairKey = [Math.min(i, neighborIndex), Math.max(i, neighborIndex)].join('-');
            
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

      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.attributes.position.needsUpdate = true;

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