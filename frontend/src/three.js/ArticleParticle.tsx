import React, {
    useRef,
    useMemo,
    forwardRef,
    ForwardedRef,
    useState,
    useEffect,
} from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Article } from '../types/article';
import { Text } from '@react-three/drei';
import { DetailedArticlePanel } from '../components/DetailedArticlePanel';

// Define ViewMode once at the top of the file
type ViewMode = 'highlight' | 'cluster';

interface LabelProps {
    title: string;
    source: string;
    position: THREE.Vector3;
    color: THREE.Color;
}

const Label = forwardRef<THREE.Group, LabelProps>(
    (
        { title, source, position, color }: LabelProps,
        ref: ForwardedRef<THREE.Group>
    ) => {
        const textRef = useRef<THREE.Mesh>(null);
        const materialRef = useRef<THREE.MeshBasicMaterial>(null);

        const material = useMemo(() => {
            return new THREE.MeshBasicMaterial({
                color: color,
                depthTest: false,
                depthWrite: false,
                transparent: true,
            });
        }, [color]);

        useFrame(({ camera }) => {
            if (ref && 'current' in ref && ref.current) {
                ref.current.quaternion.copy(camera.quaternion);
            }
            if (materialRef.current) {
                materialRef.current.color = color;
            }
        });

        return (
            <group ref={ref} position={position}>
                <Text
                    ref={textRef}
                    material={material}
                    position={[0, 0, 0]}
                    fontSize={0.15}
                    maxWidth={5}
                    anchorX='center'
                    anchorY='middle'
                    renderOrder={1}
                    font='fonts/EurostileBQ-Italic.otf'
                >
                    {`${title} | ${source}`}
                </Text>
            </group>
        );
    }
);

Label.displayName = 'Label';
// Update ParticleProps to include opacity
interface ParticleProps {
    index: number;
    positions: Float32Array;
    articles: Article[];
    highlightOptions: HighlightOptions;
    clusterOptions: FilterOptions;
    edgeOptions: EdgeOptions;
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
    setSelectedArticle: (
        article: Article | null,
        position?: THREE.Vector3
    ) => void;
    setHoveredParticle: (index: number | null) => void;
}

// Constants for particle appearance
const DEFAULT_COLOR = new THREE.Color(0.8, 0.8, 0.8); // Light grey for non-highlighted nodes
const DEFAULT_OPACITY = 0.3;
const ACTIVE_OPACITY = 1;

export const Particle: React.FC<ParticleProps> = ({
    index,
    positions,
    articles,
    highlightOptions,
    clusterOptions,
    edgeOptions,
    highlightColor,
    clusterColor,
    edgeColor,
    setSelectedArticle,
    setHoveredParticle,
  }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
    const labelRef = useRef<THREE.Group>(null);
    const article = articles[index];
  
    const isHighlighted = useMemo(() => matchesFilter(article, highlightOptions), [article, highlightOptions]);
    const isInCluster = useMemo(() => matchesFilter(article, clusterOptions), [article, clusterOptions]);
    const isEdgeVisible = useMemo(() => matchesFilter(article, edgeOptions), [article, edgeOptions]);
  
    const getTargetColor = () => {
      if (isHighlighted) return new THREE.Color(highlightColor);
      if (isInCluster) return new THREE.Color(clusterColor);
      if (isEdgeVisible) return new THREE.Color(edgeColor);
      return DEFAULT_COLOR;
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
  
        let targetColor: THREE.Color;
        let targetOpacity: number;
        let targetEmissiveIntensity: number;
  
        if (isHighlighted) {
          targetColor = new THREE.Color(highlightColor);
          targetOpacity = ACTIVE_OPACITY;
          targetEmissiveIntensity = 2;
        } else if (isInCluster) {
          targetColor = new THREE.Color(clusterColor);
          targetOpacity = ACTIVE_OPACITY;
          targetEmissiveIntensity = 1;
        } else if (isEdgeVisible) {
          targetColor = new THREE.Color(edgeColor);
          targetOpacity = ACTIVE_OPACITY;
          targetEmissiveIntensity = 0.5;
        } else {
          targetColor = DEFAULT_COLOR;
          targetOpacity = DEFAULT_OPACITY;
          targetEmissiveIntensity = 0.2;
        }
  
        materialRef.current.color.lerp(targetColor, 0.1);
        materialRef.current.emissive.lerp(targetColor, 0.1);
        materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1);
        materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, targetEmissiveIntensity, 0.1);
      }
    });
  
    return (
      <group>
        <mesh
          ref={meshRef}
          onClick={(event) => {
            event.stopPropagation();
            if (meshRef.current) {
              setSelectedArticle(article, meshRef.current.position);
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
            color={getTargetColor()}
            fontSize={0.15}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            font="fonts/EurostileBQ-Italic.otf"
            anchorX="center"
            anchorY="middle"
            whiteSpace="nowrap"
          >
            {`${article.title || 'Untitled'} | ${article.source || 'Unknown Source'}`}
          </Text>
        </group>
      </group>
    );
  };
export type { ViewMode };

interface ConnectionLinesProps {
    articles: Article[];
    positions: Float32Array;
    edgeOptions: EdgeOptions;
    edgeColor: string;
    hoveredParticle: number | null;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({
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

            if (edgeOptions.visibility === 'on') {
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
                hoveredParticle !== null
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
            materialRef.current.opacity =
                edgeOptions.visibility === 'hover' ? 0.5 : 1;
        }
    });

    return (
        <lineSegments ref={lineRef}>
            <bufferGeometry />
            <lineBasicMaterial ref={materialRef} transparent opacity={1} />
        </lineSegments>
    );
};

const SPHERE_RADIUS = 15;
const CLUSTER_RADIUS = 6; // Reduced from 8 to 5 to keep cluster more central
const OUTER_SPHERE_PADDING = 2; // Add padding to keep outer nodes away from the sphere's edge

interface ArticleParticleProps {
    articles: Article[];
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
    highlightOptions: HighlightOptions;
    clusterOptions: FilterOptions;
    edgeOptions: EdgeOptions;
}

interface SwarmProps {
    articles: Article[];
    setSelectedArticle: (
        article: Article | null,
        position?: THREE.Vector3
    ) => void;
    highlightOptions: HighlightOptions;
    clusterOptions: FilterOptions;
    edgeOptions: EdgeOptions;
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
}

export const Swarm: React.FC<SwarmProps> = ({
    articles,
    setSelectedArticle,
    highlightOptions,
    clusterOptions,
    edgeOptions,
    highlightColor,
    clusterColor,
    edgeColor,
}) => {
    const positionsRef = useRef<Float32Array>(
        new Float32Array(articles.length * 3)
    );
    const [hoveredParticle, setHoveredParticle] = useState<number | null>(null);
    const targetPositionsRef = useRef<Float32Array>(
        new Float32Array(articles.length * 3)
    );

    const generateRandomPointInSphere = (radius: number): THREE.Vector3 => {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * radius;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
    };

    const generateRandomPointOnOuterSphere = (
        innerRadius: number,
        outerRadius: number
    ): THREE.Vector3 => {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = outerRadius - innerRadius; // Distance between inner and outer spheres
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        return new THREE.Vector3(x, y, z)
            .normalize()
            .multiplyScalar(outerRadius);
    };

    // Initialize positions
    useEffect(() => {
        articles.forEach((_, i) => {
            const point = generateRandomPointInSphere(
                SPHERE_RADIUS - OUTER_SPHERE_PADDING
            );
            positionsRef.current[i * 3] = point.x;
            positionsRef.current[i * 3 + 1] = point.y;
            positionsRef.current[i * 3 + 2] = point.z;
            targetPositionsRef.current[i * 3] = point.x;
            targetPositionsRef.current[i * 3 + 1] = point.y;
            targetPositionsRef.current[i * 3 + 2] = point.z;
        });
    }, [articles]);

    // Update target positions when cluster options change
    useEffect(() => {
        const isClusterActive = Object.values(clusterOptions).some(
            (value) => value !== ''
        );

        if (isClusterActive) {
            const clusterCenter = new THREE.Vector3(0, 0, 0);
            const clusterArticles = articles.filter((article) =>
                matchesFilter(article, clusterOptions)
            );
            const nonClusterArticles = articles.filter(
                (article) => !matchesFilter(article, clusterOptions)
            );

            // Position cluster articles
            clusterArticles.forEach((article, i) => {
                const index = articles.indexOf(article);
                const offset = generateRandomPointInSphere(CLUSTER_RADIUS);
                const targetPosition = clusterCenter.clone().add(offset);
                targetPositionsRef.current[index * 3] = targetPosition.x;
                targetPositionsRef.current[index * 3 + 1] = targetPosition.y;
                targetPositionsRef.current[index * 3 + 2] = targetPosition.z;
            });

            // Position non-cluster articles on the outer sphere
            nonClusterArticles.forEach((article, i) => {
                const index = articles.indexOf(article);
                const outerPosition = generateRandomPointOnOuterSphere(
                    CLUSTER_RADIUS,
                    SPHERE_RADIUS - OUTER_SPHERE_PADDING
                );
                targetPositionsRef.current[index * 3] = outerPosition.x;
                targetPositionsRef.current[index * 3 + 1] = outerPosition.y;
                targetPositionsRef.current[index * 3 + 2] = outerPosition.z;
            });
        } else {
            // Reset to original positions if no clustering
            articles.forEach((_, i) => {
                const point = generateRandomPointInSphere(
                    SPHERE_RADIUS - OUTER_SPHERE_PADDING
                );
                targetPositionsRef.current[i * 3] = point.x;
                targetPositionsRef.current[i * 3 + 1] = point.y;
                targetPositionsRef.current[i * 3 + 2] = point.z;
            });
        }
    }, [articles, clusterOptions]);

    useFrame(() => {
        articles.forEach((_, i) => {
            const currentPosition = new THREE.Vector3(
                positionsRef.current[i * 3],
                positionsRef.current[i * 3 + 1],
                positionsRef.current[i * 3 + 2]
            );
            const targetPosition = new THREE.Vector3(
                targetPositionsRef.current[i * 3],
                targetPositionsRef.current[i * 3 + 1],
                targetPositionsRef.current[i * 3 + 2]
            );

            currentPosition.lerp(targetPosition, 0.05);

            positionsRef.current[i * 3] = currentPosition.x;
            positionsRef.current[i * 3 + 1] = currentPosition.y;
            positionsRef.current[i * 3 + 2] = currentPosition.z;
        });
    });

    return (
        <>
            {articles.map((article, index) => (
                <Particle
                    key={index}
                    index={index}
                    positions={positionsRef.current}
                    articles={articles}
                    highlightOptions={highlightOptions}
                    clusterOptions={clusterOptions}
                    edgeOptions={edgeOptions}
                    highlightColor={highlightColor}
                    clusterColor={clusterColor}
                    edgeColor={edgeColor}
                    setSelectedArticle={setSelectedArticle}
                    setHoveredParticle={setHoveredParticle}
                />
            ))}
            <ConnectionLines
                articles={articles}
                positions={positionsRef.current}
                edgeOptions={edgeOptions}
                edgeColor={edgeColor}
                hoveredParticle={hoveredParticle}
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

    return <DetailedArticlePanel article={article} onClose={onClose} />;
};

export default InfoPanel;

// Add this new custom hook for keyboard controls
const useKeyboardControls = (speed = 0.1) => {
    const { camera } = useThree();
    const keys = useRef({
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        KeyW: false,
        KeyS: false,
        KeyA: false,
        KeyD: false,
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code in keys.current) {
                keys.current[event.code as keyof typeof keys.current] = true;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code in keys.current) {
                keys.current[event.code as keyof typeof keys.current] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useFrame(() => {
        const moveForward = keys.current.ArrowUp || keys.current.KeyW;
        const moveBackward = keys.current.ArrowDown || keys.current.KeyS;
        const moveLeft = keys.current.ArrowLeft || keys.current.KeyA;
        const moveRight = keys.current.ArrowRight || keys.current.KeyD;

        if (moveForward) camera.translateZ(-speed);
        if (moveBackward) camera.translateZ(speed);
        if (moveLeft) camera.translateX(-speed);
        if (moveRight) camera.translateX(speed);
    });
};

// Update the CameraController to handle transitions more smoothly
const CameraController: React.FC<{
    target: THREE.Vector3 | null;
    resetView: boolean;
    onTransitionComplete?: () => void;
}> = ({ target, resetView, onTransitionComplete }) => {
    const { camera, gl } = useThree();
    const controlsRef = useRef<any>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const targetRef = useRef<THREE.Vector3 | null>(null);
    const startTargetRef = useRef<THREE.Vector3 | null>(null);
    const transitionProgressRef = useRef(0);
    const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 0, 40); // Further away default position
    const TRANSITION_SPEED = 0.02; // Slower transition speed (was 0.05)

    useEffect(() => {
        if (target || resetView) {
            setIsTransitioning(true);
            startTargetRef.current = controlsRef.current?.target.clone() || new THREE.Vector3();
            targetRef.current = target ? target.clone() : new THREE.Vector3(0, 0, 0);
            transitionProgressRef.current = 0;
            
            // Set initial camera position if it hasn't been set
            if (camera.position.length() === 0) {
                camera.position.copy(DEFAULT_CAMERA_POSITION);
            }
        }
    }, [target, resetView]);

    useFrame(() => {
        if (controlsRef.current && isTransitioning) {
            const controls = controlsRef.current;

            if (targetRef.current && startTargetRef.current) {
                transitionProgressRef.current += TRANSITION_SPEED;
                const progress = Math.min(1, transitionProgressRef.current);

                // Only move the orbit controls target, not the camera position
                controls.target.lerpVectors(startTargetRef.current, targetRef.current, progress);

                // Check if transition is complete
                if (progress >= 1) {
                    setIsTransitioning(false);
                    targetRef.current = null;
                    startTargetRef.current = null;
                    transitionProgressRef.current = 0;
                    onTransitionComplete?.();
                }
            }

            controls.update();
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            args={[camera, gl.domElement]}
            enableDamping
            dampingFactor={0.25}
            enableZoom={true}
            enableRotate={true}
            enablePan={true}
            minDistance={2} // Increased minimum distance
            maxDistance={60} // Increased maximum distance
            target0={new THREE.Vector3(0, 0, 0)} // Default target when reset
        />
    );
};

// Main component that provides the Canvas context
export const ArticleParticle: React.FC<{
    articles: Article[];
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
    highlightOptions: HighlightOptions;
    clusterOptions: FilterOptions;
    edgeOptions: EdgeOptions;
}> = ({
    articles,
    highlightColor,
    clusterColor,
    edgeColor,
    highlightOptions,
    clusterOptions,
    edgeOptions,
}) => {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Canvas
                camera={{ position: [0, 0, 30], fov: 60, near: 0.1, far: 1000 }}
                gl={{ antialias: true }}
            >
                <Scene
                    articles={articles}
                    setSelectedArticle={setSelectedArticle}
                    highlightOptions={highlightOptions}
                    clusterOptions={clusterOptions}
                    edgeOptions={edgeOptions}
                    highlightColor={highlightColor}
                    clusterColor={clusterColor}
                    edgeColor={edgeColor}
                />
            </Canvas>
            {selectedArticle && (
                <InfoPanel
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                />
            )}
        </div>
    );
};

// Scene component that uses Three.js hooks
const Scene: React.FC<{
    articles: Article[];
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
    highlightOptions: HighlightOptions;
    clusterOptions: FilterOptions;
    edgeOptions: EdgeOptions;
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
}> = ({
    articles,
    setSelectedArticle,
    highlightOptions,
    clusterOptions,
    edgeOptions,
    highlightColor,
    clusterColor,
    edgeColor,
}) => {
    const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
    const [resetView, setResetView] = useState(false);
    const [hoveredParticle, setHoveredParticle] = useState<number | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const positionsRef = useRef<Float32Array>(new Float32Array(articles.length * 3));
    const targetPositionsRef = useRef<Float32Array>(new Float32Array(articles.length * 3));
    const previousArticlesLengthRef = useRef<number>(0);

    const generateRandomPointInSphere = (radius: number): THREE.Vector3 => {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * radius;
        return new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
    };

    useEffect(() => {
        if (articles.length !== previousArticlesLengthRef.current || !isInitialized) {
            articles.forEach((_, i) => {
                const randomPoint = generateRandomPointInSphere(SPHERE_RADIUS - OUTER_SPHERE_PADDING);
                
                positionsRef.current[i * 3] = randomPoint.x;
                positionsRef.current[i * 3 + 1] = randomPoint.y;
                positionsRef.current[i * 3 + 2] = randomPoint.z;
                
                targetPositionsRef.current[i * 3] = randomPoint.x;
                targetPositionsRef.current[i * 3 + 1] = randomPoint.y;
                targetPositionsRef.current[i * 3 + 2] = randomPoint.z;
            });

            previousArticlesLengthRef.current = articles.length;
            setIsInitialized(true);
        }
    }, [articles]);

    useEffect(() => {
        if (!isInitialized) return;

        const isClusterActive = Object.values(clusterOptions).some(value => value !== '');
        const clusterCenter = new THREE.Vector3(0, 0, 0);

        if (isClusterActive) {
            const clusterArticles = articles.filter(article => matchesFilter(article, clusterOptions));
            const nonClusterArticles = articles.filter(article => !matchesFilter(article, clusterOptions));

            clusterArticles.forEach((article) => {
                const index = articles.indexOf(article);
                const offset = generateRandomPointInSphere(CLUSTER_RADIUS);
                const targetPosition = clusterCenter.clone().add(offset);
                
                targetPositionsRef.current[index * 3] = targetPosition.x;
                targetPositionsRef.current[index * 3 + 1] = targetPosition.y;
                targetPositionsRef.current[index * 3 + 2] = targetPosition.z;
            });

            nonClusterArticles.forEach((article) => {
                const index = articles.indexOf(article);
                const outerPoint = generateRandomPointInSphere(SPHERE_RADIUS - OUTER_SPHERE_PADDING)
                    .normalize()
                    .multiplyScalar(SPHERE_RADIUS - OUTER_SPHERE_PADDING);
                
                targetPositionsRef.current[index * 3] = outerPoint.x;
                targetPositionsRef.current[index * 3 + 1] = outerPoint.y;
                targetPositionsRef.current[index * 3 + 2] = outerPoint.z;
            });
        } else {
            articles.forEach((_, i) => {
                const randomPoint = generateRandomPointInSphere(SPHERE_RADIUS - OUTER_SPHERE_PADDING);
                targetPositionsRef.current[i * 3] = randomPoint.x;
                targetPositionsRef.current[i * 3 + 1] = randomPoint.y;
                targetPositionsRef.current[i * 3 + 2] = randomPoint.z;
            });
        }
    }, [articles, clusterOptions, isInitialized]);

    useFrame(() => {
        if (!isInitialized) return;

        const LERP_FACTOR = 0.05;
        for (let i = 0; i < articles.length; i++) {
            positionsRef.current[i * 3] += (targetPositionsRef.current[i * 3] - positionsRef.current[i * 3]) * LERP_FACTOR;
            positionsRef.current[i * 3 + 1] += (targetPositionsRef.current[i * 3 + 1] - positionsRef.current[i * 3 + 1]) * LERP_FACTOR;
            positionsRef.current[i * 3 + 2] += (targetPositionsRef.current[i * 3 + 2] - positionsRef.current[i * 3 + 2]) * LERP_FACTOR;
        }
    });

    const handleBackgroundClick = () => {
        setSelectedArticle(null);
        setResetView(true);
        setCameraTarget(null);
    };

    const handleParticleClick = (article: Article | null, position?: THREE.Vector3) => {
        setSelectedArticle(article, position);
        if (position) {
            setCameraTarget(position);
            setResetView(false);
        }
    };

    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
            {isInitialized && articles.map((article, index) => (
                <Particle
                    key={index}
                    index={index}
                    positions={positionsRef.current}
                    articles={articles}
                    highlightOptions={highlightOptions}
                    clusterOptions={clusterOptions}
                    edgeOptions={edgeOptions}
                    highlightColor={highlightColor}
                    clusterColor={clusterColor}
                    edgeColor={edgeColor}
                    setSelectedArticle={handleParticleClick}
                    setHoveredParticle={setHoveredParticle}
                />
            ))}
            {isInitialized && (
                <ConnectionLines
                    articles={articles}
                    positions={positionsRef.current}
                    edgeOptions={edgeOptions}
                    edgeColor={edgeColor}
                    hoveredParticle={hoveredParticle}
                />
            )}
            <CameraController target={cameraTarget} resetView={resetView} />
            <mesh position={[0, 0, -1]} onClick={handleBackgroundClick}>
                <planeGeometry args={[1000, 1000]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </>
    );
};

interface ArticleParticleProps {
    articles: Article[];
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
    highlightOptions: HighlightOptions;
    clusterOptions: FilterOptions;
    edgeOptions: EdgeOptions;
}

interface FilterOptions {
    broadClaim: string;
    subClaim: string;
    source: string;
    think_tank_ref: string;
    isDuplicate: string;
}

interface HighlightOptions extends FilterOptions {
    articleBody: string;
}

interface EdgeOptions extends FilterOptions {
    visibility: string;
}

// Helper function to check if an article matches the filter options
export function matchesFilter(
    article: Article,
    filterOptions: FilterOptions | HighlightOptions | EdgeOptions
): boolean {
    if (
        filterOptions.broadClaim &&
        (!article.broadClaims ||
            !(filterOptions.broadClaim in article.broadClaims))
    ) {
        return false;
    }
    if (
        filterOptions.subClaim &&
        (!article.subClaims || !(filterOptions.subClaim in article.subClaims))
    ) {
        return false;
    }
    if (filterOptions.source && article.source !== filterOptions.source) {
        return false;
    }
    if (filterOptions.think_tank_ref !== '') {
        const hasThinkTankRef =
            article.think_tank_ref !== null &&
            article.think_tank_ref !== undefined &&
            article.think_tank_ref.trim() !== '';
        if (hasThinkTankRef !== (filterOptions.think_tank_ref === 'yes')) {
            return false;
        }
    }
    if (filterOptions.isDuplicate !== '') {
        const isDuplicateMatch =
            article.isDuplicate === (filterOptions.isDuplicate === 'yes');
        if (!isDuplicateMatch) {
            return false;
        }
    }
    if (
        'articleBody' in filterOptions &&
        filterOptions.articleBody &&
        article.body &&
        !article.body
            .toLowerCase()
            .includes(filterOptions.articleBody.toLowerCase())
    ) {
        return false;
    }
    return true;
}
