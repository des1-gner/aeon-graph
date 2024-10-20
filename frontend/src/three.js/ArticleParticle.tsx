import React, { useRef, useMemo, forwardRef, ForwardedRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button } from '../components/Button';
import { Article } from '../types/article';
import { Text } from '@react-three/drei';

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

// Define ViewMode once at the top of the file
type ViewMode = 'highlight' | 'cluster';

const DEFAULT_COLOR = new THREE.Color(0.5, 0.5, 0.5);
const DEFAULT_OPACITY = 0.3;
const ACTIVE_OPACITY = 1;

interface LabelProps {
    title: string;
    source: string;
    position: THREE.Vector3;
    color: THREE.Color;
  }
  
  const Label = forwardRef<THREE.Group, LabelProps>(
    ({ title, source, position, color }: LabelProps, ref: ForwardedRef<THREE.Group>) => {
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
            anchorX="center"
            anchorY="middle"
            renderOrder={1}
            font="fonts/EurostileBQ-Italic.otf"
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
  setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
  setHoveredParticle: (index: number | null) => void;
}

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

    useFrame(() => {
        if (meshRef.current && materialRef.current && labelRef.current) {
            const targetPosition = new THREE.Vector3(
                positions[index * 3],
                positions[index * 3 + 1],
                positions[index * 3 + 2]
            );

            // Smooth transition for position
            meshRef.current.position.lerp(targetPosition, 0.1);
            labelRef.current.position.copy(meshRef.current.position);

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
          <group ref={labelRef} position={[0, -0.3, 0]}>
        <Text
          color={DEFAULT_COLOR}
          fontSize={0.1}
          maxWidth={2}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          font="fonts/EurostileBQ-Italic.otf"
          anchorX="center"
          anchorY="middle"
        >
          {article.title || 'Untitled'}
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

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
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

            if (hoveredParticle !== null) {
                const hoveredArticle = articles[hoveredParticle];
                
                articles.forEach((article, index) => {
                    if (index !== hoveredParticle && 
                        matchesFilter(hoveredArticle, edgeOptions) && 
                        matchesFilter(article, edgeOptions)) {
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

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
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

interface SwarmProps {
  articles: Article[];
  setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
  highlightOptions: HighlightOptions;
  clusterOptions: FilterOptions;
  edgeOptions: EdgeOptions;
  highlightColor: string;
  clusterColor: string;
  edgeColor: string;
}
  
  const SPHERE_RADIUS = 10;
  const CLUSTER_RADIUS = 4;
  
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
    setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
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
  const positionsRef = useRef<Float32Array>(new Float32Array(articles.length * 3));
  const [hoveredParticle, setHoveredParticle] = useState<number | null>(null);

    const targetPositionsRef = useRef<Float32Array>(new Float32Array(articles.length * 3));

      
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
  
      // Initialize positions
      useEffect(() => {
          articles.forEach((_, i) => {
              const point = generateRandomPointOnSphere(SPHERE_RADIUS);
              positionsRef.current[i * 3] = point.x;
              positionsRef.current[i * 3 + 1] = point.y;
              positionsRef.current[i * 3 + 2] = point.z;
              targetPositionsRef.current[i * 3] = point.x;
              targetPositionsRef.current[i * 3 + 1] = point.y;
              targetPositionsRef.current[i * 3 + 2] = point.z;
          });
      }, [articles]);
  
      // Update target positions only when cluster options change
      useEffect(() => {
          if (Object.keys(clusterOptions).some(key => clusterOptions[key as keyof typeof clusterOptions])) {
              const clusterCenter = generateRandomPointOnSphere(CLUSTER_RADIUS);
              articles.forEach((article, i) => {
                  if (matchesFilter(article, clusterOptions)) {
                      const offset = new THREE.Vector3(
                          (Math.random() - 0.5) * 2,
                          (Math.random() - 0.5) * 2,
                          (Math.random() - 0.5) * 2
                      );
                      const targetPosition = clusterCenter.clone().add(offset);
                      targetPositionsRef.current[i * 3] = targetPosition.x;
                      targetPositionsRef.current[i * 3 + 1] = targetPosition.y;
                      targetPositionsRef.current[i * 3 + 2] = targetPosition.z;
                  }
              });
          } else {
              // Reset to original positions if no clustering
              articles.forEach((_, i) => {
                  const point = generateRandomPointOnSphere(SPHERE_RADIUS);
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

      // Update the handleParticleClick function
    const handleParticleClick = (article: Article | null, position?: THREE.Vector3) => {
      setSelectedArticle(article, position);
  };
      
  
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

// CameraController component
const CameraController: React.FC<{ target: THREE.Vector3 | null; resetView: boolean }> = ({ target, resetView }) => {
    const { camera, gl } = useThree();
    const controlsRef = useRef<any>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const targetRef = useRef<THREE.Vector3 | null>(null);

    useEffect(() => {
        if (target || resetView) {
            setIsTransitioning(true);
            targetRef.current = target ? target.clone() : new THREE.Vector3(0, 0, 0);
        }
    }, [target, resetView]);

    useFrame(() => {
        if (controlsRef.current && isTransitioning) {
            const controls = controlsRef.current;

            if (targetRef.current) {
                const targetPosition = targetRef.current.clone().add(new THREE.Vector3(0, 0, 5));
                camera.position.lerp(targetPosition, 0.05);
                controls.target.lerp(targetRef.current, 0.05);

                if (camera.position.distanceTo(targetPosition) < 0.1 &&
                    controls.target.distanceTo(targetRef.current) < 0.1) {
                    setIsTransitioning(false);
                    targetRef.current = null;
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
        />
    );
};

  
interface SceneProps {
  articles: Article[];
  setSelectedArticle: (article: Article | null, position?: THREE.Vector3) => void;
  highlightOptions: HighlightOptions;
  clusterOptions: FilterOptions;
  edgeOptions: EdgeOptions;
  highlightColor: string;
  clusterColor: string;
  edgeColor: string;
}

const Scene: React.FC<SceneProps> = ({
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
              setSelectedArticle={handleParticleClick}
              highlightOptions={highlightOptions}
              clusterOptions={clusterOptions}
              edgeOptions={edgeOptions}
              highlightColor={highlightColor}
              clusterColor={clusterColor}
              edgeColor={edgeColor}
          />
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
    hasThinktankReference: string;
    isDuplicate: string;
}

interface HighlightOptions extends FilterOptions {
    articleBody: string;
}

interface EdgeOptions extends FilterOptions {
    visibility: string;
}
  
  
export const ArticleParticle: React.FC<ArticleParticleProps> = ({
    articles,
    highlightColor,
    clusterColor,
    edgeColor,
    highlightOptions,
    clusterOptions,
    edgeOptions,
}) => {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const handleArticleSelect = (article: Article | null, position?: THREE.Vector3) => {
        setSelectedArticle(article);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <Scene
                    articles={articles}
                    setSelectedArticle={handleArticleSelect}
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

    // Helper function to check if an article matches the filter options
    function matchesFilter(article: Article, filterOptions: FilterOptions | HighlightOptions | EdgeOptions): boolean {
        if (filterOptions.broadClaim && (!article.broadClaims || !(filterOptions.broadClaim in article.broadClaims))) {
          return false;
        }
        if (filterOptions.subClaim && (!article.subClaims || !(filterOptions.subClaim in article.subClaims))) {
          return false;
        }
        if (filterOptions.source && article.source !== filterOptions.source) {
          return false;
        }
        if (filterOptions.hasThinktankReference !== '') {
          const hasReference = (article as any).hasThinktankReference === (filterOptions.hasThinktankReference === 'yes');
          if (!hasReference) {
            return false;
          }
        }
        if (filterOptions.isDuplicate !== '') {
          const isDuplicateMatch = article.isDuplicate === (filterOptions.isDuplicate === 'yes');
          if (!isDuplicateMatch) {
            return false;
          }
        }
        if ('articleBody' in filterOptions && filterOptions.articleBody && article.body && 
            !article.body.toLowerCase().includes(filterOptions.articleBody.toLowerCase())) {
          return false;
        }
        return true;
      }
      