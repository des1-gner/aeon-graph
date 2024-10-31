import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Article } from '../../types/article';
import { EdgeOptions } from '../../types/filters';
import { hasActiveFilters, matchesFilter } from '../../utils/filters';

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
  const lineRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame(() => {
    if (lineRef.current && materialRef.current) {
      const geometry = lineRef.current.geometry as THREE.BufferGeometry;
      const vertices: number[] = [];
      
      // Check if any filters are active using hasActiveFilters
      const isEdgeActive = hasActiveFilters(edgeOptions);

      if (edgeOptions.visibility === 'on' && isEdgeActive) {
        articles.forEach((article1, i) => {
          articles.forEach((article2, j) => {
            if (
              i < j && 
              matchesFilter(article1, edgeOptions) && 
              matchesFilter(article2, edgeOptions)
            ) {
              vertices.push(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2],
                positions[j * 3],
                positions[j * 3 + 1],
                positions[j * 3 + 2]
              );
            }
          });
        });
      } else if (
        edgeOptions.visibility === 'hover' && 
        hoveredParticle !== null && 
        isEdgeActive
      ) {
        const hoveredArticle = articles[hoveredParticle];
        articles.forEach((article, index) => {
          if (
            index !== hoveredParticle && 
            matchesFilter(hoveredArticle, edgeOptions) && 
            matchesFilter(article, edgeOptions)
          ) {
            vertices.push(
              positions[hoveredParticle * 3],
              positions[hoveredParticle * 3 + 1],
              positions[hoveredParticle * 3 + 2],
              positions[index * 3],
              positions[index * 3 + 1],
              positions[index * 3 + 2]
            );
          }
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