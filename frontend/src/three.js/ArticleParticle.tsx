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

// Add the correct type import for OrbitControls
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';


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
    clusterOptions: ClusterOptions;
    edgeOptions: EdgeOptions;
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
    setHoveredParticle: (index: number | null) => void;
}

interface ParticleState {
    color: THREE.Color;
    opacity: number;
    emissiveIntensity: number;
}

const Particle: React.FC<ParticleProps> = ({
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
    const groupRef = useRef<THREE.Group>(null);
    const currentColor = useRef(DEFAULT_COLOR.clone());
    const article = articles[index];

    const isHighlighted = useMemo(
        () => hasActiveFilters(highlightOptions) && matchesFilter(article, highlightOptions),
        [article, highlightOptions]
    );

    const isInCluster = useMemo(
        () => hasActiveFilters(clusterOptions) && matchesFilter(article, clusterOptions),
        [article, clusterOptions]
    );

    const getParticleState = () => {
        const hasActiveHighlight = hasActiveFilters(highlightOptions);
        const hasActiveCluster = hasActiveFilters(clusterOptions);

        // No active filters - all nodes visible and grey
        if (!hasActiveHighlight && !hasActiveCluster) {
            return {
                color: DEFAULT_COLOR,
                opacity: ACTIVE_OPACITY,
                emissiveIntensity: 0.2
            };
        }

        // Node matches both filters - blend colors
        if (isHighlighted && isInCluster) {
            const blendedColor = new THREE.Color(highlightColor)
                .lerp(new THREE.Color(clusterColor), 0.5);
            return {
                color: blendedColor,
                opacity: ACTIVE_OPACITY,
                emissiveIntensity: 1.5
            };
        }

        // Node matches highlight only
        if (isHighlighted) {
            return {
                color: new THREE.Color(highlightColor),
                opacity: ACTIVE_OPACITY,
                emissiveIntensity: 1.0
            };
        }

        // Node matches cluster only
        if (isInCluster) {
            return {
                color: new THREE.Color(clusterColor),
                opacity: ACTIVE_OPACITY,
                emissiveIntensity: 1.0
            };
        }

        // Node doesn't match any active filters - grey and transparent
        return {
            color: DEFAULT_COLOR,
            opacity: DEFAULT_OPACITY,
            emissiveIntensity: 0.2
        };
    };

    useFrame(({ camera }) => {
        if (meshRef.current && materialRef.current && groupRef.current) {
            const targetPosition = new THREE.Vector3(
                positions[index * 3],
                positions[index * 3 + 1],
                positions[index * 3 + 2]
            );

            meshRef.current.position.lerp(targetPosition, 0.1);
            groupRef.current.position.copy(targetPosition).add(new THREE.Vector3(0, -0.5, 0));
            groupRef.current.quaternion.copy(camera.quaternion);

            const { color, opacity, emissiveIntensity } = getParticleState();
            
            materialRef.current.color.lerp(color, 0.1);
            materialRef.current.emissive.lerp(color, 0.1);
            materialRef.current.opacity = opacity;
            materialRef.current.emissiveIntensity = emissiveIntensity;

            currentColor.current.copy(materialRef.current.color);
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
            <group ref={groupRef}>
                <Text
                    color={currentColor.current}
                    fontSize={0.15}
                    lineHeight={1}
                    letterSpacing={0.02}
                    textAlign="center"
                    font="fonts/eurostile-bold.ttf"
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

// Updated ConnectionLines Component
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
            <lineBasicMaterial ref={materialRef} transparent opacity={1} />
        </lineSegments>
    );
};

interface ArticleParticleProps {
    articles: Article[];
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;  // Changed from FilterOptions
    edgeOptions: EdgeOptions;
}

interface SwarmProps {
    articles: Article[];
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;
    edgeOptions: EdgeOptions;
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
}

// The Swarm component that handles the particle system
// Updated Swarm Component
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
    const positionsRef = useRef<Float32Array>(new Float32Array(articles.length * 3));
    const [hoveredParticle, setHoveredParticle] = useState<number | null>(null);
    const targetPositionsRef = useRef<Float32Array>(new Float32Array(articles.length * 3));
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize positions
    useEffect(() => {
        articles.forEach((_, i) => {
            const point = generateRandomPointInSphere(SPHERE_RADIUS - OUTER_SPHERE_PADDING);
            positionsRef.current[i * 3] = point.x;
            positionsRef.current[i * 3 + 1] = point.y;
            positionsRef.current[i * 3 + 2] = point.z;
            targetPositionsRef.current[i * 3] = point.x;
            targetPositionsRef.current[i * 3 + 1] = point.y;
            targetPositionsRef.current[i * 3 + 2] = point.z;
        });
        setIsInitialized(true);
    }, [articles]);

    // Handle clustering
    useEffect(() => {
        if (!isInitialized) return;

        const isClusterActive = hasActiveFilters(clusterOptions);

        articles.forEach((article, i) => {
            let targetPosition: THREE.Vector3;

            if (isClusterActive) {
                const matchesCluster = matchesFilter(article, clusterOptions);
                if (matchesCluster) {
                    // Place matching articles in inner cluster
                    targetPosition = generateRandomPointInSphere(CLUSTER_RADIUS);
                } else {
                    // Place non-matching articles in outer sphere
                    targetPosition = generateRandomPointOnOuterSphere(
                        CLUSTER_RADIUS,
                        SPHERE_RADIUS - OUTER_SPHERE_PADDING
                    );
                }
            } else {
                // When no clustering is active, distribute evenly
                targetPosition = generateRandomPointInSphere(SPHERE_RADIUS - OUTER_SPHERE_PADDING);
            }

            targetPositionsRef.current[i * 3] = targetPosition.x;
            targetPositionsRef.current[i * 3 + 1] = targetPosition.y;
            targetPositionsRef.current[i * 3 + 2] = targetPosition.z;
        });
    }, [articles, clusterOptions, isInitialized]);

    // Update particle positions
    useFrame(() => {
        if (!isInitialized) return;
        
        const LERP_FACTOR = 0.05;
        articles.forEach((_, i) => {
            positionsRef.current[i * 3] += (targetPositionsRef.current[i * 3] - positionsRef.current[i * 3]) * LERP_FACTOR;
            positionsRef.current[i * 3 + 1] += (targetPositionsRef.current[i * 3 + 1] - positionsRef.current[i * 3 + 1]) * LERP_FACTOR;
            positionsRef.current[i * 3 + 2] += (targetPositionsRef.current[i * 3 + 2] - positionsRef.current[i * 3 + 2]) * LERP_FACTOR;
        });
    });

    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
            {isInitialized && articles.map((_, index) => (
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

interface CameraControllerProps {
    target: THREE.Vector3 | null;
    resetView: boolean;
    onTransitionComplete?: () => void;
}

// Update the CameraController to handle transitions more smoothly
// Camera Controller Component with keyboard controls
const CameraController: React.FC<CameraControllerProps> = ({ target, resetView, onTransitionComplete }) => {
    const { camera, gl } = useThree();
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const targetRef = useRef<THREE.Vector3 | null>(null);
    const startTargetRef = useRef<THREE.Vector3 | null>(null);
    const transitionProgressRef = useRef(0);

    // Keyboard controls
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

    // Handle camera transitions
    useEffect(() => {
        if (target || resetView) {
            setIsTransitioning(true);
            startTargetRef.current = controlsRef.current?.target.clone() || new THREE.Vector3();
            targetRef.current = target ? target.clone() : new THREE.Vector3(0, 0, 0);
            transitionProgressRef.current = 0;
            
            if (camera.position.length() === 0) {
                camera.position.copy(DEFAULT_CAMERA_POSITION);
            }
        }
    }, [target, resetView, camera]);

    useFrame(() => {
        // Handle keyboard movement
        const moveForward = keys.current.ArrowUp || keys.current.KeyW;
        const moveBackward = keys.current.ArrowDown || keys.current.KeyS;
        const moveLeft = keys.current.ArrowLeft || keys.current.KeyA;
        const moveRight = keys.current.ArrowRight || keys.current.KeyD;

        // if (moveForward) camera.translateZ(-CAMERA_MOVE_SPEED);
        // if (moveBackward) camera.translateZ(CAMERA_MOVE_SPEED);
        // if (moveLeft) camera.translateX(-CAMERA_MOVE_SPEED);
        // if (moveRight) camera.translateX(CAMERA_MOVE_SPEED);

        // Handle transitions
        if (controlsRef.current && isTransitioning && targetRef.current && startTargetRef.current) {
            transitionProgressRef.current += 0.02;
            const progress = Math.min(1, transitionProgressRef.current);

            controlsRef.current.target.lerpVectors(
                startTargetRef.current,
                targetRef.current,
                progress
            );

            if (progress >= 1) {
                setIsTransitioning(false);
                targetRef.current = null;
                startTargetRef.current = null;
                transitionProgressRef.current = 0;
                onTransitionComplete?.();
            }

            controlsRef.current.update();
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
            minDistance={2}
            maxDistance={60}
            target0={new THREE.Vector3(0, 0, 0)}
        />
    );
};

// Main component that provides the Canvas context
// First, the main ArticleParticle component that provides the Canvas
// Main Article Particle Component
// Then update your ArticleParticle component's return statement:
interface ColorLegendProps {
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
  }
  
  const KeyIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth="1.5" 
      stroke="currentColor" 
      className="size-4 text-neutral-400"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" 
      />
    </svg>
  );
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : null;
  };
  
  const blendColors = (color1: string, color2: string, ratio: number = 0.5) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    if (!c1 || !c2) return color1;
  
    const r = Math.round((c1.r * (1 - ratio) + c2.r * ratio) * 255);
    const g = Math.round((c1.g * (1 - ratio) + c2.g * ratio) * 255);
    const b = Math.round((c1.b * (1 - ratio) + c2.b * ratio) * 255);
  
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
  };
  
  export const ColorLegend: React.FC<ColorLegendProps> = ({
    highlightColor,
    clusterColor,
    edgeColor
  }) => {
    const blendedColor = blendColors(highlightColor, clusterColor);
  
    const ColorBox = ({ color, label }: { color: string; label: string }) => (
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm text-neutral-400">{label}</span>
      </div>
    );
  
    return (
      <div className="fixed bottom-4 right-4 bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 rounded-lg z-10">
        <div className="p-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <KeyIcon />
              <span className="text-sm font-medium text-neutral-400">Legend</span>
            </div>
            <div className="h-5 w-px bg-neutral-800" />
            <div className="flex items-center gap-6">
              <ColorBox color={highlightColor} label="Highlight" />
              <ColorBox color={clusterColor} label="Cluster" />
              <ColorBox color={blendedColor} label="Highlight + Cluster" />
              <ColorBox color={edgeColor} label="Edge" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  
  // Keep all your existing code below this point, including the ArticleParticle component
  // Just make sure the ArticleParticle's return statement includes the ColorLegend:
  
  export const ArticleParticle: React.FC<{
    articles: Article[];
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;
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
    const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
    
    // Add a key that changes when articles change
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
                key={canvasKey} // Add key here to force remount
                camera={{ position: [0, 0, 30], fov: 60, near: 0.1, far: 1000 }}
                gl={{ antialias: true }}
            >
                <Swarm
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
  

// Update the Scene component props interface
interface SceneProps {
    articles: Article[];
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;  // Changed from FilterOptions
    edgeOptions: EdgeOptions;
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
}

// Scene component that uses Three.js hooks
// First, update the main Scene interface
const Scene: React.FC<{
    articles: Article[];
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;  // Changed from FilterOptions
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

    // Replace the first useEffect in Scene:
useEffect(() => {
    if (articles.length !== previousArticlesLengthRef.current || !isInitialized) {
        const existingPositions: THREE.Vector3[] = [];
        const minDistance = Math.max(1, (SPHERE_RADIUS * 2) / Math.cbrt(articles.length));
        
        articles.forEach((_, i) => {
            const position = findValidPosition(
                SPHERE_RADIUS - OUTER_SPHERE_PADDING,
                existingPositions,
                minDistance
            );
            
            // Store position for collision checking
            existingPositions.push(position.clone());
            
            // Update position arrays
            positionsRef.current[i * 3] = position.x;
            positionsRef.current[i * 3 + 1] = position.y;
            positionsRef.current[i * 3 + 2] = position.z;
            
            targetPositionsRef.current[i * 3] = position.x;
            targetPositionsRef.current[i * 3 + 1] = position.y;
            targetPositionsRef.current[i * 3 + 2] = position.z;
        });

        previousArticlesLengthRef.current = articles.length;
        setIsInitialized(true);
    }
}, [articles]);

// Replace the second useEffect in Scene (the clustering effect):
useEffect(() => {
    if (!isInitialized) return;

    const isClusterActive = hasActiveFilters(clusterOptions);
    const existingPositions: THREE.Vector3[] = [];
    
    if (isClusterActive) {
        const matchingArticles = articles.filter(article => 
            matchesFilter(article, clusterOptions)
        );
        
        const nonMatchingArticles = articles.filter(article => 
            !matchesFilter(article, clusterOptions)
        );
        
        // Calculate appropriate minimum distances based on number of particles
        const innerMinDistance = Math.max(0.5, (CLUSTER_RADIUS * 2) / Math.cbrt(matchingArticles.length));
        const outerMinDistance = Math.max(1, ((SPHERE_RADIUS - OUTER_SPHERE_PADDING) * 2) / Math.cbrt(nonMatchingArticles.length));
        
        // Position matching articles in inner cluster
        matchingArticles.forEach((article) => {
            const index = articles.indexOf(article);
            const position = findValidPosition(CLUSTER_RADIUS, existingPositions, innerMinDistance);
            
            existingPositions.push(position.clone());
            targetPositionsRef.current[index * 3] = position.x;
            targetPositionsRef.current[index * 3 + 1] = position.y;
            targetPositionsRef.current[index * 3 + 2] = position.z;
        });
        
        // Position non-matching articles in outer sphere
        nonMatchingArticles.forEach((article) => {
            const index = articles.indexOf(article);
            const position = findValidPosition(
                SPHERE_RADIUS - OUTER_SPHERE_PADDING,
                existingPositions,
                outerMinDistance
            );
            
            existingPositions.push(position.clone());
            targetPositionsRef.current[index * 3] = position.x;
            targetPositionsRef.current[index * 3 + 1] = position.y;
            targetPositionsRef.current[index * 3 + 2] = position.z;
        });
    } else {
        // When no clustering, distribute evenly throughout sphere
        const minDistance = Math.max(1, (SPHERE_RADIUS * 2) / Math.cbrt(articles.length));
        
        articles.forEach((_, i) => {
            const position = findValidPosition(
                SPHERE_RADIUS - OUTER_SPHERE_PADDING,
                existingPositions,
                minDistance
            );
            
            existingPositions.push(position.clone());
            targetPositionsRef.current[i * 3] = position.x;
            targetPositionsRef.current[i * 3 + 1] = position.y;
            targetPositionsRef.current[i * 3 + 2] = position.z;
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
                    clusterOptions={clusterOptions as ClusterOptions}  // Add type assertion here
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

interface ParticleProps {
    index: number;
    positions: Float32Array;
    articles: Article[];
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;
    edgeOptions: EdgeOptions;
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
    setHoveredParticle: (index: number | null) => void;
}

// Helper function to parse comma-separated string into array

// Update the FilterOptions interface to better document the expected format// Types and Interfaces
// Constants
// Constants
const SPHERE_RADIUS = 15;
const CLUSTER_RADIUS = 6;
const OUTER_SPHERE_PADDING = 2;
const DEFAULT_COLOR = new THREE.Color(0.8, 0.8, 0.8);
const DEFAULT_OPACITY = 0.3;
const ACTIVE_OPACITY = 1;
const CAMERA_MOVE_SPEED = 0.1;
const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 0, 40);

// Types
export type VisibilityType = 'on' | 'hover' | 'off';

interface FilterOptions {
    broadClaim: string;
    subClaim: string;
    source: string;
    think_tank_ref: string;
    isDuplicate: string;
    articleBody: string;
}

interface HighlightOptions extends FilterOptions {}
interface ClusterOptions extends FilterOptions {}
interface EdgeOptions extends FilterOptions {
    visibility: VisibilityType;
}

interface ParticleProps {
    index: number;
    positions: Float32Array;
    articles: Article[];
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;
    edgeOptions: EdgeOptions;
    highlightColor: string;
    clusterColor: string;
    edgeColor: string;
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
    setHoveredParticle: (index: number | null) => void;
}

// Utility Functions
const generateRandomPointInSphere = (radius: number): THREE.Vector3 => {
    // Use spherical coordinates for more even distribution
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    
    // Use cubic root for better radial distribution
    const r = Math.cbrt(Math.random()) * radius;
    
    // Convert to Cartesian coordinates
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
};

// Add these new utility functions:
const checkCollision = (
    position: THREE.Vector3,
    existingPositions: THREE.Vector3[],
    minDistance: number
): boolean => {
    return existingPositions.some(existing => 
        position.distanceTo(existing) < minDistance
    );
};

const findValidPosition = (
    radius: number,
    existingPositions: THREE.Vector3[],
    minDistance: number,
    maxAttempts: number = 50
): THREE.Vector3 => {
    let attempts = 0;
    let position: THREE.Vector3;
    
    do {
        position = generateRandomPointInSphere(radius);
        attempts++;
        
        if (attempts > maxAttempts) {
            // If we can't find a good spot, gradually reduce minimum distance
            minDistance *= 0.9;
            attempts = 0;
        }
    } while (
        checkCollision(position, existingPositions, minDistance) && 
        minDistance > 0.1
    );
    
    return position;
};

const generateRandomPointOnOuterSphere = (
    innerRadius: number,
    outerRadius: number
): THREE.Vector3 => {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = outerRadius;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
};

const parseFilterValue = (value: string): string[] => {
    return value ? value.split(',').filter(Boolean) : [];
};

const hasActiveFilters = (options: FilterOptions): boolean => {
    return (
        parseFilterValue(options.broadClaim).length > 0 ||
        parseFilterValue(options.subClaim).length > 0 ||
        parseFilterValue(options.source).length > 0 ||
        options.think_tank_ref !== '' ||
        options.isDuplicate !== '' ||
        (options.articleBody?.trim() || '') !== ''
    );
};

// Re-export the matchesFilter function for use in other components
export function matchesFilter(
    article: Article,
    filterOptions: FilterOptions | HighlightOptions | EdgeOptions
): boolean {
    if (!hasActiveFilters(filterOptions)) {
        return true;
    }
    
    // Handle broad claims
    const selectedBroadClaims = parseFilterValue(filterOptions.broadClaim);
    if (selectedBroadClaims.length > 0) {
        if (!article.broadClaims) return false;
        const hasMatchingBroadClaim = selectedBroadClaims.some(claimId => 
            article.broadClaims && claimId in article.broadClaims
        );
        if (!hasMatchingBroadClaim) return false;
    }

    // Handle sub claims
    const selectedSubClaims = parseFilterValue(filterOptions.subClaim);
    if (selectedSubClaims.length > 0) {
        if (!article.subClaims) return false;
        const hasMatchingSubClaim = selectedSubClaims.some(claimId => 
            article.subClaims && claimId in article.subClaims
        );
        if (!hasMatchingSubClaim) return false;
    }

    // Handle sources
    const selectedSources = parseFilterValue(filterOptions.source);
    if (selectedSources.length > 0) {
        if (!article.source) return false;
        if (!selectedSources.includes(article.source)) return false;
    }

    // Check think tank reference
    if (filterOptions.think_tank_ref !== '') {
        const hasThinkTankRef = article.think_tank_ref !== null && 
                               article.think_tank_ref !== undefined && 
                               article.think_tank_ref.trim() !== '';
        if (hasThinkTankRef !== (filterOptions.think_tank_ref === 'yes')) {
            return false;
        }
    }

    // Check duplicate status
    if (filterOptions.isDuplicate !== '') {
        const isDuplicateMatch = article.isDuplicate === (filterOptions.isDuplicate === 'yes');
        if (!isDuplicateMatch) {
            return false;
        }
    }

    // Check article body text
    if (filterOptions.articleBody && filterOptions.articleBody.trim() !== '') {
        if (!article.body || 
            !article.body.toLowerCase().includes(filterOptions.articleBody.toLowerCase().trim())) {
            return false;
        }
    }

    return true;
}