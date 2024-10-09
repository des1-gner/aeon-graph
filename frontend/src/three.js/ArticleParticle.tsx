import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '../components/Button';
import { Article } from '../types/article';

type ViewMode = 'soup' | string;

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
    
    const isHighlighted = useMemo(() => {
        const shouldHighlight = highlightedWord &&
            (article.title?.toLowerCase().includes(highlightedWord.toLowerCase()) ||
             article.broadClaim?.toLowerCase().includes(highlightedWord.toLowerCase()) ||
             article.subclaims?.some(subclaim => subclaim.toLowerCase().includes(highlightedWord.toLowerCase())));
        
        console.log(`Article ${index}:`, { 
            title: article.title, 
            broadClaim: article.broadClaim, 
            highlightedWord, 
            isHighlighted: shouldHighlight 
        });
        
        return shouldHighlight;
    }, [highlightedWord, article, index]);

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
                viewMode === 'soup' || article.broadClaim === viewMode;

            if (isHighlighted) {
                materialRef.current.color.setRGB(1, 0, 0); // Bright red for highlighted
                materialRef.current.emissive.setRGB(0.5, 0, 0); // Darker red emissive for depth
                materialRef.current.opacity = 1; // Fully opaque
                materialRef.current.emissiveIntensity = 1; // Moderate emissive intensity
                } else if (viewMode === 'soup') {
                materialRef.current.color.copy(originalColor);
                materialRef.current.emissive.copy(originalColor);
                materialRef.current.opacity = 0.5;
                materialRef.current.emissiveIntensity = 0.5;
                } else if (isInFocus) {
                materialRef.current.color.copy(originalColor);
                materialRef.current.emissive.copy(originalColor);
                materialRef.current.opacity = 1;
                materialRef.current.emissiveIntensity = 1;
                } else {
                materialRef.current.color.lerp(new THREE.Color(0.2, 0.2, 0.2), 0.8);
                materialRef.current.emissive.lerp(new THREE.Color(0.2, 0.2, 0.2), 0.8);
                materialRef.current.opacity = 0.2;
                materialRef.current.emissiveIntensity = 0.2;
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
                console.log("Particle clicked:", article);
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
                if (viewMode !== 'soup' && article.broadClaim === viewMode) {
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

interface SceneProps {
    articles: Article[];
    viewMode: ViewMode;
    colorMap: Map<string, THREE.Color>;
    setSelectedArticle: (article: Article | null) => void;
    highlightedWord: string;
}

const Scene: React.FC<SceneProps> = ({
    articles,
    viewMode,
    colorMap,
    setSelectedArticle,
    highlightedWord,
}) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Swarm
                articles={articles}
                viewMode={viewMode}
                colorMap={colorMap}
                setSelectedArticle={setSelectedArticle}
                highlightedWord={highlightedWord}
            />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
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
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 text-white p-4 max-w-sm overflow-y-auto max-h-screen">
            <button 
                onClick={onClose} 
                className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center"
            >
                X
            </button>
            <h2 className="text-xl font-bold mb-4">{article.title}</h2>
            {Object.entries(article).map(([key, value]) => {
                if (key !== 'title') {
                    return (
                        <div key={key} className="mb-4">
                            <h3 className="text-lg font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</h3>
                            {Array.isArray(value) ? (
                                <ul className="list-disc list-inside">
                                    {value.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>{typeof value === 'string' ? value : JSON.stringify(value, null, 2)}</p>
                            )}
                        </div>
                    );
                }
                return null;
            })}
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
    const [broadClaims, setBroadClaims] = useState<string[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    console.log("ArticleParticle render, selectedArticle:", selectedArticle); // Debug log

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
        const claims = Array.from(
            new Set(
                articles
                    .map((article) => article.broadClaim)
                    .filter(Boolean) as string[]
            )
        );
        setBroadClaims(['soup', ...claims]);
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
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <color attach="background" args={['black']} />
                <Scene 
                    articles={articles} 
                    viewMode={viewMode} 
                    colorMap={colorMap}
                    setSelectedArticle={handleArticleSelect}
                    highlightedWord={highlightedWord}
                />
            </Canvas>
            <Button
                variant="glass"
                onClick={handleToggle}
                className="absolute top-10 left-10 p-10 text-xl text-white font-semibold"
            >
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
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