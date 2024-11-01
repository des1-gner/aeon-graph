import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Article } from '../../types/article';
import { EdgeOptions } from '../../types/filters';
import { hasActiveFilters, matchesFilter } from '../../utils/filters';

interface ConnectionLinesProps {
  articles: Article[];           // Array of articles to connect
  positions: Float32Array;       // Array of 3D positions for each article
  edgeOptions: EdgeOptions;      // Options controlling edge visibility and filtering
  edgeColor: string;            // Color of the connection lines
  hoveredParticle: number | null; // Index of currently hovered particle, if any
}

// Authors Oisin Aeonn, and Chris Partridge

/**
 * ConnectionLines component creates visual connections between articles in 3D space
 * It supports different visibility modes (always on, hover-only, off) and filtering options
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

  // Update line connections every frame
  useFrame(() => {
    if (lineRef.current && materialRef.current) {
      const geometry = lineRef.current.geometry as THREE.BufferGeometry;
      const vertices: number[] = [];

      // Check if any filters are active
      const isEdgeActive = hasActiveFilters(edgeOptions);

      // Handle 'always on' visibility mode
      if (edgeOptions.visibility === 'on' && isEdgeActive) {
        // Create connections between all pairs of articles that match the filter
        articles.forEach((article1, i) => {
          articles.forEach((article2, j) => {
            // Only process each pair once (i < j) and check filter matches
            if (
              i < j &&
              matchesFilter(article1, edgeOptions) &&
              matchesFilter(article2, edgeOptions)
            ) {
              // Add vertex pairs for line segments
              vertices.push(
                positions[i * 3],     // x1
                positions[i * 3 + 1], // y1
                positions[i * 3 + 2], // z1
                positions[j * 3],     // x2
                positions[j * 3 + 1], // y2
                positions[j * 3 + 2]  // z2
              );
            }
          });
        });
      }
      // Handle 'hover only' visibility mode
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