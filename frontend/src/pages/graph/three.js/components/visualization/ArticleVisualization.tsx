import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Article, HighlightOptions, ClusterOptions, EdgeOptions } from '../../types';
import { VISUALIZATION_CONSTANTS, COLOR_SCHEMES } from '../../utils/constants';
import { ParticleSwarm } from './ParticleSwarm';
import { CameraController } from '../controls/CameraController';
import { ColorLegend } from '../ui';  // Updated import
import { DetailedArticlePanel } from '../../../components/panels/DetailedArticlePanel';

// Interface defining the props for the ArticleVisualization component
interface ArticleVisualizationProps {
    articles: Article[];                    // Array of articles to visualize
    highlightColor?: string;               // Color for highlighted elements
    clusterColor?: string;                 // Color for cluster elements
    edgeColor?: string;                    // Color for edge elements
    highlightOptions: HighlightOptions;    // Configuration for highlight behavior
    clusterOptions: ClusterOptions;        // Configuration for clustering behavior
    edgeOptions: EdgeOptions;              // Configuration for edge rendering
}

// Main component for visualizing articles in a 3D space using Three.js
export const ArticleVisualization: React.FC<ArticleVisualizationProps> = ({
    articles,
    // Default colors from color scheme if not provided
    highlightColor = COLOR_SCHEMES.DEFAULT.HIGHLIGHT,
    clusterColor = COLOR_SCHEMES.DEFAULT.CLUSTER,
    edgeColor = COLOR_SCHEMES.DEFAULT.EDGE,
    highlightOptions,
    clusterOptions,
    edgeOptions,
}) => {
    // State for tracking the currently selected article
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    
    // State for tracking the camera's target position
    const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
    
    // Create a key that changes when articles array changes to force Canvas remount
    const canvasKey = useMemo(() => articles.length, [articles]);

    // Handler for article selection, updates both article and camera position
    const handleArticleSelect = (article: Article | null, position?: THREE.Vector3) => {
        setSelectedArticle(article);
        if (position) {
            setCameraTarget(position);
        }
    };

    return (
        // Main container taking up full viewport
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {/* Three.js Canvas setup with initial camera configuration */}
            <Canvas
                key={canvasKey}
                camera={{
                    position: VISUALIZATION_CONSTANTS.DEFAULT_CAMERA_POSITION.toArray(),
                    fov: VISUALIZATION_CONSTANTS.CAMERA_SETTINGS.FOV,
                    near: VISUALIZATION_CONSTANTS.CAMERA_SETTINGS.NEAR,
                    far: VISUALIZATION_CONSTANTS.CAMERA_SETTINGS.FAR
                }}
                gl={{ antialias: true }}
            >
                {/* ParticleSwarm component handling the main visualization */}
                <ParticleSwarm
                    articles={articles}
                    setSelectedArticle={handleArticleSelect}
                    highlightOptions={highlightOptions}
                    clusterOptions={clusterOptions}
                    edgeOptions={edgeOptions}
                    highlightColor={highlightColor}
                    clusterColor={clusterColor}
                    edgeColor={edgeColor}
                />
                
                {/* Camera controller for handling camera movements and transitions */}
                <CameraController 
                    target={cameraTarget}
                    resetView={!selectedArticle}
                    onTransitionComplete={() => {
                        if (!selectedArticle) {
                            setCameraTarget(null);
                        }
                    }}
                />
            </Canvas>
            
            {/* Detailed panel shown when an article is selected */}
            {selectedArticle && (
                <DetailedArticlePanel
                    article={selectedArticle}
                    onClose={() => {
                        setSelectedArticle(null);
                        setCameraTarget(null);
                    }}
                />
            )}
            
            {/* Legend showing color meanings */}
            <ColorLegend 
                highlightColor={highlightColor}
                clusterColor={clusterColor}
                edgeColor={edgeColor}
            />
        </div>
    );
};