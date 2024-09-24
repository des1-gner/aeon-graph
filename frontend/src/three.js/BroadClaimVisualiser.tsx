import React, { useState, useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import Button from '../components/Button';

export type DBArticle = {
    content: string;
    sourceName: string;
    publishedAt: string;
    urlToImage: string;
    url: string;
    author: string;
    title: string;
    broadClaim?: string;
    subclaims?: string[];
};

type ViewMode = 'chaos' | string;

const generateVibrantColor = (index: number, total: number): THREE.Color => {
    const hue = (index / total) * 360;
    const saturation = 100; // Full saturation for vibrant colors
    const lightness = 50; // Mid-range lightness for brightness without washing out
    return new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
};

const Particle = ({
    index,
    positions,
    velocities,
    articles,
    viewMode,
    color,
    setHoveredParticle,
}: {
    index: number;
    positions: Float32Array;
    velocities: Float32Array;
    articles: DBArticle[];
    viewMode: ViewMode;
    color: THREE.Color;
    setHoveredParticle: (index: number | null) => void;
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const article = articles[index];
    const originalColor = useMemo(() => color.clone(), [color]);

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.transparent = true;
        }
    }, []);

    useFrame(() => {
        if (meshRef.current && materialRef.current) {
            meshRef.current.position.set(
                positions[index * 3],
                positions[index * 3 + 1],
                positions[index * 3 + 2]
            );

            const isInFocus =
                viewMode === 'chaos' || article.broadClaim === viewMode;
            materialRef.current.opacity = isInFocus ? 1 : 0.2; // More transparent when not in focus
            materialRef.current.emissiveIntensity = isInFocus ? 1 : 0.2;

            if (isInFocus) {
                materialRef.current.color.copy(originalColor);
                materialRef.current.emissive.copy(originalColor);
            } else {
                materialRef.current.color.lerp(
                    new THREE.Color(0.2, 0.2, 0.2), // Darker color when not in focus
                    0.8
                );
                materialRef.current.emissive.lerp(
                    new THREE.Color(0.2, 0.2, 0.2),
                    0.8
                );
            }
        }
    });

    return (
        <mesh
            ref={meshRef}
            onPointerOver={() => setHoveredParticle(index)}
            onPointerOut={() => setHoveredParticle(null)}
        >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
                ref={materialRef}
                color={originalColor}
                emissive={originalColor}
                emissiveIntensity={1}
            />
        </mesh>
    );
};

const ConnectionLines = ({
    articles,
    positions,
    hoveredParticle,
    viewMode,
    colorMap,
}: {
    articles: DBArticle[];
    positions: Float32Array;
    hoveredParticle: number | null;
    viewMode: ViewMode;
    colorMap: Map<string, THREE.Color>;
}) => {
    const lineRef = useRef<THREE.LineSegments>(null);
    const materialRef = useRef<THREE.LineBasicMaterial>(null);

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.linewidth = 0; // Set line thickness
        }
    }, []);

    useFrame(() => {
        if (lineRef.current && materialRef.current) {
            const geometry = lineRef.current.geometry as THREE.BufferGeometry;

            if (hoveredParticle !== null && viewMode !== 'chaos') {
                const hoveredArticle = articles[hoveredParticle];
                const vertices: number[] = [];

                if (
                    hoveredArticle.broadClaim === viewMode &&
                    hoveredArticle.subclaims
                ) {
                    articles.forEach((article, index) => {
                        if (
                            index !== hoveredParticle &&
                            article.broadClaim === viewMode &&
                            article.subclaims &&
                            hoveredArticle.subclaims!.some((subclaim) =>
                                article.subclaims!.includes(subclaim)
                            )
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

                // Set the color of the line to match the broadClaim group
                if (
                    hoveredArticle.broadClaim &&
                    colorMap.has(hoveredArticle.broadClaim)
                ) {
                    materialRef.current.color = colorMap.get(
                        hoveredArticle.broadClaim
                    )!;
                }

                materialRef.current.visible = true;
            } else {
                // Hide the lines when no particle is hovered
                materialRef.current.visible = false;
            }
        }
    });

    return (
        <lineSegments ref={lineRef}>
            <bufferGeometry />
            <lineBasicMaterial ref={materialRef} transparent opacity={1} />
        </lineSegments>
    );
};

const Swarm = ({
    articles,
    viewMode,
    colorMap,
}: {
    articles: DBArticle[];
    viewMode: ViewMode;
    colorMap: Map<string, THREE.Color>;
}) => {
    const positionsRef = useRef<Float32Array>(
        new Float32Array(articles.length * 3)
    );
    const velocitiesRef = useRef<Float32Array>(
        new Float32Array(articles.length * 3)
    );
    const targetPositionsRef = useRef<Float32Array>(
        new Float32Array(articles.length * 3)
    );
    const colorsRef = useRef<THREE.Color[]>([]);
    const transitionProgressRef = useRef<number>(0);
    const prevViewModeRef = useRef<ViewMode>('chaos');
    const [hoveredParticle, setHoveredParticle] = useState<number | null>(null);

    useMemo(() => {
        for (let i = 0; i < articles.length; i++) {
            positionsRef.current[i * 3] = (Math.random() - 0.5) * 20;
            positionsRef.current[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positionsRef.current[i * 3 + 2] = (Math.random() - 0.5) * 20;
            velocitiesRef.current[i * 3] = (Math.random() - 0.5) * 0.1;
            velocitiesRef.current[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
            velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

            const article = articles[i];
            colorsRef.current[i] =
                article.broadClaim && colorMap.has(article.broadClaim)
                    ? colorMap.get(article.broadClaim)!
                    : new THREE.Color(0.5, 0.5, 0.5);
        }
    }, [articles, colorMap]);

    useEffect(() => {
        if (viewMode !== prevViewModeRef.current) {
            transitionProgressRef.current = 0;
            for (let i = 0; i < articles.length; i++) {
                const article = articles[i];
                if (viewMode !== 'chaos' && article.broadClaim === viewMode) {
                    targetPositionsRef.current[i * 3] =
                        (Math.random() - 0.5) * 4;
                    targetPositionsRef.current[i * 3 + 1] =
                        (Math.random() - 0.5) * 4;
                    targetPositionsRef.current[i * 3 + 2] =
                        (Math.random() - 0.5) * 4;
                } else {
                    targetPositionsRef.current[i * 3] =
                        (Math.random() - 0.5) * 20;
                    targetPositionsRef.current[i * 3 + 1] =
                        (Math.random() - 0.5) * 20;
                    targetPositionsRef.current[i * 3 + 2] =
                        (Math.random() - 0.5) * 20;
                }
            }
            prevViewModeRef.current = viewMode;
        }
    }, [viewMode, articles]);

    useFrame(() => {
        const positions = positionsRef.current;
        const velocities = velocitiesRef.current;
        const targetPositions = targetPositionsRef.current;

        if (transitionProgressRef.current < 1) {
            transitionProgressRef.current += 0.02;
        }

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            const particlePosition = new THREE.Vector3(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2]
            );
            const particleVelocity = new THREE.Vector3(
                velocities[i * 3],
                velocities[i * 3 + 1],
                velocities[i * 3 + 2]
            );
            const targetPosition = new THREE.Vector3(
                targetPositions[i * 3],
                targetPositions[i * 3 + 1],
                targetPositions[i * 3 + 2]
            );

            if (viewMode !== 'chaos') {
                if (article.broadClaim === viewMode) {
                    particlePosition.lerp(targetPosition, 0.1);
                    particleVelocity.set(0, 0, 0);
                } else {
                    particleVelocity.add(
                        new THREE.Vector3(
                            (Math.random() - 0.5) * 0.01,
                            (Math.random() - 0.5) * 0.01,
                            (Math.random() - 0.5) * 0.01
                        )
                    );
                    particlePosition.add(particleVelocity);
                }
            } else {
                particleVelocity.add(
                    new THREE.Vector3(
                        (Math.random() - 0.5) * 0.01,
                        (Math.random() - 0.5) * 0.01,
                        (Math.random() - 0.5) * 0.01
                    )
                );
                particlePosition.add(particleVelocity);
            }

            for (let axis = 0; axis < 3; axis++) {
                if (Math.abs(particlePosition.getComponent(axis)) > 10) {
                    particlePosition.setComponent(
                        axis,
                        Math.sign(particlePosition.getComponent(axis)) * 10
                    );
                    particleVelocity.setComponent(
                        axis,
                        -particleVelocity.getComponent(axis) * 0.8
                    );
                }
            }

            positions[i * 3] = particlePosition.x;
            positions[i * 3 + 1] = particlePosition.y;
            positions[i * 3 + 2] = particlePosition.z;
            velocities[i * 3] = particleVelocity.x;
            velocities[i * 3 + 1] = particleVelocity.y;
            velocities[i * 3 + 2] = particleVelocity.z;
        }
    });

    return (
        <>
            {articles.map((article, index) => (
                <Particle
                    key={index}
                    index={index}
                    positions={positionsRef.current}
                    velocities={velocitiesRef.current}
                    articles={articles}
                    viewMode={viewMode}
                    color={colorsRef.current[index]}
                    setHoveredParticle={setHoveredParticle}
                />
            ))}
            <ConnectionLines
                articles={articles}
                positions={positionsRef.current}
                hoveredParticle={hoveredParticle}
                viewMode={viewMode}
                colorMap={colorMap}
            />
        </>
    );
};

export const BroadClaimVisualiser = ({
    articles,
}: {
    articles: DBArticle[];
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('chaos');
    const [broadClaims, setBroadClaims] = useState<string[]>([]);
    const colorMap = useMemo(() => {
        const map = new Map<string, THREE.Color>();
        broadClaims.forEach((claim, index) => {
            if (claim !== 'chaos') {
                map.set(
                    claim,
                    generateVibrantColor(index - 1, broadClaims.length - 1)
                );
            }
        });
        return map;
    }, [broadClaims]);

    useEffect(() => {
        const claims = Array.from(
            new Set(
                articles
                    .map((article) => article.broadClaim)
                    .filter(Boolean) as string[]
            )
        );
        setBroadClaims(['chaos', ...claims]);
    }, [articles]);

    const handleToggle = () => {
        setViewMode((current) => {
            const currentIndex = broadClaims.indexOf(current);
            if (currentIndex === broadClaims.length - 1) {
                return broadClaims[0]; // Return to 'chaos'
            } else {
                return broadClaims[currentIndex + 1];
            }
        });
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <color attach='background' args={['black']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Swarm
                    articles={articles}
                    viewMode={viewMode}
                    colorMap={colorMap}
                />
            </Canvas>
            <Button
                variant='glass'
                onClick={handleToggle}
                className='absolute top-10 left-10 p-10 text-xl text-white font-semibold'
            >
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
            </Button>
        </div>
    );
};
