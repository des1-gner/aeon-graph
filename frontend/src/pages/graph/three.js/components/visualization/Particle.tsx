import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Article } from '../../types/article';
import { HighlightOptions, ClusterOptions } from '../../types/filters';
import { VISUALIZATION_CONSTANTS } from '../../utils/constants';
import { matchesFilter } from '../../utils/filters';

const {
    DEFAULT_COLOR,
    DEFAULT_OPACITY,
    ACTIVE_OPACITY,
} = VISUALIZATION_CONSTANTS;

interface ParticleProps {
    index: number;
    positions: Float32Array;
    article: Article;
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;
    highlightColor: string;
    clusterColor: string;
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
    setHoveredParticle: (index: number | null) => void;
}

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
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const labelRef = useRef<THREE.Group>(null);

    const isHighlighted = useMemo(
        () => matchesFilter(article, highlightOptions),
        [article, highlightOptions]
    );

    const isInCluster = useMemo(
        () => matchesFilter(article, clusterOptions),
        [article, clusterOptions]
    );

    const getParticleState = () => {
        if (isHighlighted && isInCluster) {
            const blendedColor = new THREE.Color(highlightColor)
                .lerp(new THREE.Color(clusterColor), 0.5);
            return {
                color: blendedColor,
                opacity: ACTIVE_OPACITY,
                emissiveIntensity: 1.5
            };
        }

        if (isHighlighted) {
            return {
                color: new THREE.Color(highlightColor),
                opacity: ACTIVE_OPACITY,
                emissiveIntensity: 1.0
            };
        }

        if (isInCluster) {
            return {
                color: new THREE.Color(clusterColor),
                opacity: ACTIVE_OPACITY,
                emissiveIntensity: 1.0
            };
        }

        return {
            color: DEFAULT_COLOR,
            opacity: DEFAULT_OPACITY,
            emissiveIntensity: 0.2
        };
    };

    useFrame(({ camera }) => {
        if (meshRef.current && materialRef.current && labelRef.current) {
            const targetPosition = new THREE.Vector3(
                positions[index * 3],
                positions[index * 3 + 1],
                positions[index * 3 + 2]
            );

            meshRef.current.position.lerp(targetPosition, 0.1);
            labelRef.current.position.copy(targetPosition).add(new THREE.Vector3(0, -0.5, 0));
            labelRef.current.quaternion.copy(camera.quaternion);

            const { color, opacity, emissiveIntensity } = getParticleState();
            
            materialRef.current.color.lerp(color, 0.1);
            materialRef.current.emissive.lerp(color, 0.1);
            materialRef.current.opacity = opacity;
            materialRef.current.emissiveIntensity = emissiveIntensity;
        }
    });

    return (
        <group>
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