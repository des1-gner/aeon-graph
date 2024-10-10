import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '../components/Button';
import { Article } from '../types/article';

type ViewMode = 'soup' | keyof Article['broadClaims'];

const generateVibrantColor = (index: number, total: number): THREE.Color => {
    const hue = (index / total) * 360;
    const saturation = 100;
    const lightness = 50;
    return new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
};

interface ParticleProps {
    index: number;
    positions: Float32Array;
    velocities: Float32Array;
    articles: Article[];
    viewMode: ViewMode;
    color: THREE.Color;
    setHoveredParticle: (index: number | null) => void;
    setSelectedArticle: (article: Article | null) => void;
    highlightedWord: string;
}

const Particle: React.FC<ParticleProps> = ({
    index,
    positions,
    velocities,
    articles,
    viewMode,
    color,
    setHoveredParticle,
    setSelectedArticle,
    highlightedWord,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshStandardMaterial>(null);
    const article = articles[index];
    const originalColor = useMemo(() => color.clone(), [color]);
    const isHighlighted = useMemo(
        () =>
            highlightedWord &&
            article.body?.toLowerCase().includes(highlightedWord.toLowerCase()),
        [highlightedWord, article.body]
    );

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
                viewMode === 'soup' ||
                (article.broadClaims && article.broadClaims[viewMode]);

            if (isHighlighted) {
                materialRef.current.color.setRGB(1, 1, 1);
                materialRef.current.emissive.setRGB(1, 1, 1);
                materialRef.current.opacity = 1;
                materialRef.current.emissiveIntensity = 10;
            } else if (viewMode === 'soup') {
                materialRef.current.color.setRGB(0.5, 0.5, 0.5);
                materialRef.current.emissive.setRGB(0.5, 0.5, 0.5);
                materialRef.current.opacity = 0.5;
                materialRef.current.emissiveIntensity = 0.5;
            } else if (isInFocus) {
                materialRef.current.color.copy(originalColor);
                materialRef.current.emissive.copy(originalColor);
                materialRef.current.opacity = 1;
                materialRef.current.emissiveIntensity = 1;
            } else {
                materialRef.current.color.lerp(
                    new THREE.Color(0.5, 0.5, 0.5),
                    0.8
                );
                materialRef.current.emissive.lerp(
                    new THREE.Color(0.5, 0.5, 0.5),
                    0.8
                );
                materialRef.current.opacity = 0.5;
                materialRef.current.emissiveIntensity = 0.5;
            }
        }
    });

    return (
        <mesh
            ref={meshRef}
            onPointerOver={() => setHoveredParticle(index)}
            onPointerOut={() => setHoveredParticle(null)}
            onClick={(event) => {
                event.stopPropagation();
                setSelectedArticle(article);
            }}
        >
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial
                ref={materialRef}
                color={originalColor}
                emissive={originalColor}
                emissiveIntensity={1}
            />
        </mesh>
    );
};

interface ConnectionLinesProps {
    articles: Article[];
    positions: Float32Array;
    hoveredParticle: number | null;
    viewMode: ViewMode;
    colorMap: Map<string, THREE.Color>;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({
    articles,
    positions,
    hoveredParticle,
    viewMode,
    colorMap,
}) => {
    const lineRef = useRef<THREE.LineSegments>(null);
    const materialRef = useRef<THREE.LineBasicMaterial>(null);

    useFrame(() => {
        if (lineRef.current && materialRef.current) {
            const geometry = lineRef.current.geometry as THREE.BufferGeometry;

            if (hoveredParticle !== null && viewMode !== 'soup') {
                const hoveredArticle = articles[hoveredParticle];
                const vertices: number[] = [];

                if (
                    hoveredArticle.broadClaims &&
                    hoveredArticle.broadClaims[viewMode] &&
                    hoveredArticle.subClaims
                ) {
                    articles.forEach((article, index) => {
                        if (
                            index !== hoveredParticle &&
                            article.broadClaims &&
                            article.broadClaims[viewMode] &&
                            article.subClaims &&
                            Object.keys(hoveredArticle.subClaims!).some(
                                (subclaim) =>
                                    article.subClaims![
                                        subclaim as keyof Article['subClaims']
                                    ]
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

                if (colorMap.has(viewMode)) {
                    materialRef.current.color = colorMap.get(viewMode)!;
                }

                materialRef.current.visible = true;
            } else {
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

interface SwarmProps {
    articles: Article[];
    viewMode: ViewMode;
    colorMap: Map<string, THREE.Color>;
    setSelectedArticle: (article: Article | null) => void;
    highlightedWord: string;
}

const Swarm: React.FC<SwarmProps> = ({
    articles,
    viewMode,
    colorMap,
    setSelectedArticle,
    highlightedWord,
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
    const prevViewModeRef = useRef<ViewMode>('soup');
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
                article.broadClaims && colorMap.has(viewMode)
                    ? colorMap.get(viewMode)!
                    : new THREE.Color(0.5, 0.5, 0.5);
        }
    }, [articles, colorMap, viewMode]);

    useEffect(() => {
        if (viewMode !== prevViewModeRef.current) {
            transitionProgressRef.current = 0;
            for (let i = 0; i < articles.length; i++) {
                const article = articles[i];
                if (
                    viewMode !== 'soup' &&
                    article.broadClaims &&
                    article.broadClaims[viewMode]
                ) {
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

            if (viewMode !== 'soup') {
                if (article.broadClaims && article.broadClaims[viewMode]) {
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
                    setSelectedArticle={setSelectedArticle}
                    highlightedWord={highlightedWord}
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

interface InfoPanelProps {
    article: Article | null;
    onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ article, onClose }) => {
    if (!article) return null;

    return (
        <div className='fixed left-0 top-1/2 transform -translate-y-1/2 text-white p-4 max-w-sm overflow-y-auto max-h-screen bg-black bg-opacity-75'>
            <button
                onClick={onClose}
                className='absolute top-2 right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center'
            >
                X
            </button>
            <h2 className='text-xl font-bold mb-4'>
                {article.title || 'Untitled'}
            </h2>
            <p className='mb-2'>
                <strong>Content:</strong> {article.body}
            </p>
            <p className='mb-2'>
                <strong>Source:</strong> {article.source || 'Unknown'}
            </p>
            <p className='mb-2'>
                <strong>Date:</strong>{' '}
                {new Date(article.dateTime).toLocaleDateString()}
            </p>
            <p className='mb-2'>
                <strong>Authors:</strong> {article.authors || 'Unknown'}
            </p>
            <h3 className='text-lg font-semibold mt-4 mb-2'>Broad Claims:</h3>
            {article.broadClaims &&
                Object.entries(article.broadClaims).map(
                    ([key, value]) =>
                        value && (
                            <p key={key} className='mb-1'>
                                <strong>{key}:</strong> {value}
                            </p>
                        )
                )}
            <h3 className='text-lg font-semibold mt-4 mb-2'>Sub Claims:</h3>
            {article.subClaims &&
                Object.entries(article.subClaims).map(
                    ([key, value]) =>
                        value && (
                            <p key={key} className='mb-1'>
                                <strong>{key}:</strong> {value}
                            </p>
                        )
                )}
        </div>
    );
};

interface ArticleParticleProps {
    articles: Article[];
    highlightedWord?: string;
}

export const ArticleParticle: React.FC<ArticleParticleProps> = ({
    articles,
    highlightedWord = '',
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('soup');
    const [broadClaims, setBroadClaims] = useState<ViewMode[]>(['soup']);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(
        null
    );

    const colorMap = useMemo(() => {
        const map = new Map<string, THREE.Color>();
        broadClaims.forEach((claim, index) => {
            if (claim !== 'soup') {
                map.set(
                    claim,
                    generateVibrantColor(index - 1, broadClaims.length - 1)
                );
            }
        });
        return map;
    }, [broadClaims]);

    useEffect(() => {
        const uniqueClaims = new Set<string>(['soup']);
        articles.forEach((article) => {
            if (article.broadClaims) {
                Object.keys(article.broadClaims).forEach((claim) => {
                    if (
                        article.broadClaims![
                            claim as keyof Article['broadClaims']
                        ]
                    ) {
                        uniqueClaims.add(claim);
                    }
                });
            }
        });
        setBroadClaims(Array.from(uniqueClaims) as ViewMode[]);
    }, [articles]);

    const handleToggle = () => {
        setViewMode((current) => {
            const currentIndex = broadClaims.indexOf(current);
            if (currentIndex === broadClaims.length - 1) {
                return broadClaims[0]; // Return to 'soup'
            } else {
                return broadClaims[currentIndex + 1];
            }
        });
    };

    const handleArticleSelect = (article: Article | null) => {
        setSelectedArticle(article);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <color attach='background' args={['black']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Swarm
                    articles={articles}
                    viewMode={viewMode}
                    colorMap={colorMap}
                    setSelectedArticle={handleArticleSelect}
                    highlightedWord={highlightedWord}
                />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                />
            </Canvas>
            <Button
                variant='glass'
                onClick={handleToggle}
                className='absolute top-10 left-10 p-10 text-xl text-white font-semibold'
            >
                {viewMode.charAt(0).toUpperCase() +
                    viewMode.slice(1).replace(/_/g, ' ')}
            </Button>
            {selectedArticle && (
                <InfoPanel
                    article={selectedArticle}
                    onClose={() => handleArticleSelect(null)}
                />
            )}
        </div>
    );
};
