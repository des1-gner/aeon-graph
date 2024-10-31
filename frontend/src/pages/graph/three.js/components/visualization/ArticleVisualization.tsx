import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Article, HighlightOptions, ClusterOptions, EdgeOptions } from '../../types';
import { VISUALIZATION_CONSTANTS, COLOR_SCHEMES } from '../../utils/constants';
import { ParticleSwarm } from './ParticleSwarm';
import { CameraController } from '../controls/CameraController';
import { ColorLegend } from '../ui';  // Updated import
import { DetailedArticlePanel } from '../../../components/panels/DetailedArticlePanel';


interface ArticleVisualizationProps {
    articles: Article[];
    highlightColor?: string;
    clusterColor?: string;
    edgeColor?: string;
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;
    edgeOptions: EdgeOptions;
}

export const ArticleVisualization: React.FC<ArticleVisualizationProps> = ({
    articles,
    highlightColor = COLOR_SCHEMES.DEFAULT.HIGHLIGHT,
    clusterColor = COLOR_SCHEMES.DEFAULT.CLUSTER,
    edgeColor = COLOR_SCHEMES.DEFAULT.EDGE,
    highlightOptions,
    clusterOptions,
    edgeOptions,
}) => {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
    
    // Add a key that changes when articles change to force remount
    const canvasKey = useMemo(() => articles.length, [articles]);

    const handleArticleSelect = (article: Article | null, position?: THREE.Vector3) => {
        setSelectedArticle(article);
        if (position) {
            setCameraTarget(position);
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
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
            
            {selectedArticle && (
                <DetailedArticlePanel
                    article={selectedArticle}
                    onClose={() => {
                        setSelectedArticle(null);
                        setCameraTarget(null);
                    }}
                />
            )}
            
            <ColorLegend 
                highlightColor={highlightColor}
                clusterColor={clusterColor}
                edgeColor={edgeColor}
            />
        </div>
    );
};