import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '../components/Button';
import { Article } from '../types/article';
import { Html } from '@react-three/drei';

const generateVibrantColor = (index: number, total: number): THREE.Color => {
    const hue = (index / total) * 360;
    const saturation = 100;
    const lightness = 50;
    return new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
};

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 color;
  uniform vec3 lightPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 lightDir = normalize(lightPosition - vWorldPosition);
    float shadow = 0.5 + 0.5 * dot(vNormal, lightDir);
    vec3 shadedColor = color * shadow;
    gl_FragColor = vec4(shadedColor, 1.0);
  }
`;

type ViewMode = 'soup' | keyof Article['broadClaims'];

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
    highlightColor: string;
    clusterColor: string;
}

const Label: React.FC<{ title: string }> = ({ title }) => {
    return (
        <Html
            center
            distanceFactor={10}
            style={{
                fontSize: '8px',
                color: 'white',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100px',
                pointerEvents: 'none',
                userSelect: 'none',
                textShadow: '0 0 3px black'
            }}
        >
            {title}
        </Html>
    );
};

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
    highlightColor,
    clusterColor,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const article = articles[index];
    const originalColor = useMemo(() => {
        if (!color) {
            console.warn(
                `Color is undefined for particle ${index}. Using default color.`
            );
            return DEFAULT_COLOR.clone();
        }
        return color.clone();
    }, [color, index]);
    const greyColor = new THREE.Color(0.5, 0.5, 0.5);
    const whiteColor = new THREE.Color(1, 1, 1);

    const isHighlighted = useMemo(
        () =>
            highlightedWord !== '' &&
            article.body?.toLowerCase().includes(highlightedWord.toLowerCase()),
        [highlightedWord, article.body]
    );

    const isInCluster = useMemo(
        () =>
            viewMode !== 'soup' &&
            article.broadClaims &&
            article.broadClaims[viewMode],
        [viewMode, article.broadClaims]
    );

    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.transparent = true;
        }
    }, []);

    useFrame(() => {
        if (meshRef.current && materialRef.current) {
            const targetX = positions[index * 3];
            const targetY = positions[index * 3 + 1];
            const targetZ = positions[index * 3 + 2];

            meshRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.1);

            let targetColor: THREE.Color;
            let targetEmissive: THREE.Color;
            let targetOpacity: number;
            let targetEmissiveIntensity: number;

            if (isHighlighted) {
                targetColor = new THREE.Color(highlightColor);
                targetEmissive = new THREE.Color(highlightColor);
                targetOpacity = 1;
                targetEmissiveIntensity = 2;
            } else if (viewMode === 'soup') {
                targetColor = originalColor;
                targetEmissive = originalColor;
                targetOpacity = 0.7;
                targetEmissiveIntensity = 0.5;
            } else if (isInCluster) {
                targetColor = new THREE.Color(clusterColor); // Use the clusterColor prop here
                targetEmissive = new THREE.Color(clusterColor); // And here
                targetOpacity = 0.7;
                targetEmissiveIntensity = 1;
            } else {
                targetColor = greyColor;
                targetEmissive = greyColor;
                targetOpacity = 0.3;
                targetEmissiveIntensity = 0.2;
            }

            materialRef.current.color.lerp(targetColor, 0.1);
            materialRef.current.emissive.lerp(targetEmissive, 0.1);
            materialRef.current.opacity = THREE.MathUtils.lerp(
                materialRef.current.opacity,
                targetOpacity,
                0.1
            );
            materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
                materialRef.current.emissiveIntensity,
                targetEmissiveIntensity,
                0.1
            );
        }
    });

    return (
        <group>
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
                <meshPhysicalMaterial
                    ref={materialRef}
                    color={originalColor}
                    emissive={originalColor}
                    emissiveIntensity={0.5}
                    transparent
                    roughness={0.5}
                    metalness={0.8}
                />
                <Label title={article.title || 'Untitled'} />
            </mesh>
        </group>
    );
};

interface ConnectionLinesProps {
    articles: Article[];
    positions: Float32Array;
    hoveredParticle: number | null;
    viewMode: ViewMode;
    colorMap: Map<string, THREE.Color>;
    edgeColor: string;
}

interface ConnectionLinesProps {
    articles: Article[];
    positions: Float32Array;
    hoveredParticle: number | null;
    viewMode: ViewMode;
    colorMap: Map<string, THREE.Color>;
    edgeColor: string;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({
    articles,
    positions,
    hoveredParticle,
    viewMode,
    colorMap,
    edgeColor,
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

                materialRef.current.color = new THREE.Color(edgeColor);
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
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
}

const DEFAULT_COLOR = new THREE.Color(0.5, 0.5, 0.5);

const Swarm: React.FC<SwarmProps> = ({
    articles,
    viewMode,
    colorMap,
    setSelectedArticle,
    highlightedWord,
    highlightColor,
    clusterColor,
    edgeColor,
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
    const targetColorsRef = useRef<THREE.Color[]>([]);
    const [hoveredParticle, setHoveredParticle] = useState<number | null>(null);

    const sphereRadius = 10;
    const maxSpeed = 0.05;
    const defaultSpeed = 0.01;
    const transitionSpeed = 0.02;
    const clusterRadius = 4;
    const colorTransitionSpeed = 0.1;

    const generateRandomPointOnSphere = (radius: number): THREE.Vector3 => {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
    };

    // Initialize positions, velocities, and colors
    useEffect(() => {
        for (let i = 0; i < articles.length; i++) {
            const point = generateRandomPointOnSphere(sphereRadius);
            positionsRef.current[i * 3] = point.x;
            positionsRef.current[i * 3 + 1] = point.y;
            positionsRef.current[i * 3 + 2] = point.z;
            targetPositionsRef.current[i * 3] = point.x;
            targetPositionsRef.current[i * 3 + 1] = point.y;
            targetPositionsRef.current[i * 3 + 2] = point.z;
            velocitiesRef.current[i * 3] = (Math.random() - 0.5) * defaultSpeed;
            velocitiesRef.current[i * 3 + 1] =
                (Math.random() - 0.5) * defaultSpeed;
            velocitiesRef.current[i * 3 + 2] =
                (Math.random() - 0.5) * defaultSpeed;

            colorsRef.current[i] = DEFAULT_COLOR.clone();
            targetColorsRef.current[i] = DEFAULT_COLOR.clone();
        }
    }, [articles]);

    // Update target positions and colors when viewMode changes
    useEffect(() => {
        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            if (
                viewMode !== 'soup' &&
                article.broadClaims &&
                article.broadClaims[viewMode]
            ) {
                const clusterPoint = generateRandomPointOnSphere(clusterRadius);
                targetPositionsRef.current[i * 3] = clusterPoint.x;
                targetPositionsRef.current[i * 3 + 1] = clusterPoint.y;
                targetPositionsRef.current[i * 3 + 2] = clusterPoint.z;

                targetColorsRef.current[i] = new THREE.Color(clusterColor);
            } else {
                const soupPoint = generateRandomPointOnSphere(sphereRadius);
                targetPositionsRef.current[i * 3] = soupPoint.x;
                targetPositionsRef.current[i * 3 + 1] = soupPoint.y;
                targetPositionsRef.current[i * 3 + 2] = soupPoint.z;

                targetColorsRef.current[i] = DEFAULT_COLOR.clone();
            }
        }
    }, [viewMode, articles, clusterColor]);

    useFrame(() => {
        const positions = positionsRef.current;
        const velocities = velocitiesRef.current;
        const targetPositions = targetPositionsRef.current;

        for (let i = 0; i < articles.length; i++) {
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

            // Calculate direction to target
            const direction = targetPosition.clone().sub(particlePosition);
            const distance = direction.length();

            if (distance > 0.1) {
                // If not very close to target, move towards it
                direction.normalize().multiplyScalar(transitionSpeed);
                particleVelocity.lerp(direction, 0.1);
            } else {
                // If close to target, add some random movement
                particleVelocity.add(
                    new THREE.Vector3(
                        (Math.random() - 0.5) * 0.001,
                        (Math.random() - 0.5) * 0.001,
                        (Math.random() - 0.5) * 0.001
                    )
                );
            }

            // Update position based on velocity
            particlePosition.add(particleVelocity);

            // Limit the speed of the particle
            const speed = particleVelocity.length();
            if (speed > maxSpeed) {
                particleVelocity.multiplyScalar(maxSpeed / speed);
            }

            // Keep particles within the sphere
            if (particlePosition.length() > sphereRadius) {
                particlePosition.normalize().multiplyScalar(sphereRadius);
                particleVelocity.reflect(particlePosition.clone().normalize());
            }

            // Update positions and velocities
            positions[i * 3] = particlePosition.x;
            positions[i * 3 + 1] = particlePosition.y;
            positions[i * 3 + 2] = particlePosition.z;
            velocities[i * 3] = particleVelocity.x;
            velocities[i * 3 + 1] = particleVelocity.y;
            velocities[i * 3 + 2] = particleVelocity.z;

            // Update color
            if (!colorsRef.current[i]) {
                console.warn(
                    `Color is undefined for particle ${i}. Initializing with default color.`
                );
                colorsRef.current[i] = DEFAULT_COLOR.clone();
            }
            if (!targetColorsRef.current[i]) {
                console.warn(
                    `Target color is undefined for particle ${i}. Initializing with default color.`
                );
                targetColorsRef.current[i] = DEFAULT_COLOR.clone();
            }
            colorsRef.current[i].lerp(
                targetColorsRef.current[i],
                colorTransitionSpeed
            );
        }
    });

    return (
        <>
            {articles.map((article: Article, index: number) => (
                <Particle
                    key={index}
                    index={index}
                    positions={positionsRef.current}
                    velocities={velocitiesRef.current}
                    articles={articles}
                    viewMode={viewMode}
                    color={colorsRef.current[index] || DEFAULT_COLOR}
                    setHoveredParticle={setHoveredParticle}
                    setSelectedArticle={setSelectedArticle}
                    highlightedWord={highlightedWord}
                    highlightColor={highlightColor}
                    clusterColor={clusterColor}
                />
            ))}
            <ConnectionLines
                articles={articles}
                positions={positionsRef.current}
                hoveredParticle={hoveredParticle}
                viewMode={viewMode}
                colorMap={colorMap}
                edgeColor={edgeColor}
            />
            {/* Add a plane to receive shadows */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -sphereRadius, 0]}
                receiveShadow
            >
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.2} />
            </mesh>
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
        <div className='fixed left-4 top-1/2 transform -translate-y-1/2 text-white p-6 w-96 max-h-[80vh] overflow-y-auto bg-black bg-opacity-75 rounded-lg shadow-lg'>
            <button
                onClick={onClose}
                className='absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200'
            >
                X
            </button>
            <div className='space-y-4'>
                <h2 className='text-2xl font-bold pr-8'>
                    {article.title || 'Untitled'}
                </h2>
                {article.url && (
                    <p>
                        <strong>URL:</strong>{' '}
                        <a
                            href={article.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-300 hover:underline'
                        >
                            {article.url}
                        </a>
                    </p>
                )}
                <p>
                    <strong>Author(s):</strong> {article.authors || 'Unknown'}
                </p>
                <p>
                    <strong>Source:</strong> {article.source || 'Unknown'}
                </p>
                <p>
                    <strong>Date:</strong>{' '}
                    {new Date(article.dateTime).toLocaleDateString()}
                </p>
                <div>
                    <strong>Content:</strong>
                    <p className='mt-2'>{article.body}</p>
                </div>
                {article.image && (
                    <div>
                        <strong>Image:</strong>
                        <img
                            src={article.image}
                            alt='Article image'
                            className='mt-2 w-full h-auto rounded'
                        />
                    </div>
                )}
                <div>
                    <h3 className='text-xl font-semibold'>Broad Claims:</h3>
                    <ul className='list-disc pl-5 space-y-1 mt-2'>
                        {article.broadClaims &&
                            Object.entries(article.broadClaims).map(
                                ([key, value]) =>
                                    value && (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    )
                            )}
                    </ul>
                </div>
                <div>
                    <h3 className='text-xl font-semibold'>Sub Claims:</h3>
                    <ul className='list-disc pl-5 space-y-1 mt-2'>
                        {article.subClaims &&
                            Object.entries(article.subClaims).map(
                                ([key, value]) =>
                                    value && (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    )
                            )}
                    </ul>
                </div>
                {/* Add any additional fields here */}
            </div>
        </div>
    );
};

export default InfoPanel;

interface ArticleParticleProps {
    articles: Article[];
    highlightedWord?: string;
    highlightColor: string;
    clusterColor: string; // Add this line
    edgeColor: string; // Add this line
}

const Scene: React.FC<{
    articles: Article[];
    viewMode: ViewMode;
    colorMap: Map<string, THREE.Color>;
    setSelectedArticle: (article: Article | null) => void;
    highlightedWord: string;
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
}> = ({
    articles,
    viewMode,
    colorMap,
    setSelectedArticle,
    highlightedWord,
    highlightColor,
    clusterColor,
    edgeColor,
}) => {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
            <directionalLight
                position={[5, 5, 5]}
                intensity={0.5}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
            <Swarm
                articles={articles}
                viewMode={viewMode}
                colorMap={colorMap}
                setSelectedArticle={setSelectedArticle}
                highlightedWord={highlightedWord}
                highlightColor={highlightColor}
                clusterColor={clusterColor}
                edgeColor={edgeColor}
            />
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
            />
        </>
    );
};

export const ArticleParticle: React.FC<ArticleParticleProps> = ({
    articles,
    highlightedWord = '',
    highlightColor,
    clusterColor,
    edgeColor,
}) => {
    const [viewMode, setViewMode] = useState<ViewMode>('soup');
    const [broadClaims, setBroadClaims] = useState<ViewMode[]>(['soup']);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);

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
        if (!articles || articles.length === 0) {
            setError('No articles available');
            return;
        }

        try {
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
        } catch (err) {
            setError(`Error processing articles: ${err}`);
        }
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

    if (error) {
        return <div className='text-white p-4'>{error}</div>;
    }

    if (!articles || articles.length === 0) {
        return <div className='text-white p-4'>No articles to display</div>;
    }

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <color attach='background' args={['#000']} />
                <Scene
                    articles={articles}
                    viewMode={viewMode}
                    colorMap={colorMap}
                    setSelectedArticle={handleArticleSelect}
                    highlightedWord={highlightedWord}
                    highlightColor={highlightColor}
                    clusterColor={clusterColor}
                    edgeColor={edgeColor}
                />
            </Canvas>
            <Button
                variant='primary'
                onClick={handleToggle}
                className='absolute bottom-10 left-1/2 transform -translate-x-1/2 p-10 text-xl text-white font-semibold'
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
