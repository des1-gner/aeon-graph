import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type AnalysedArticle = {
    date: string;
    headline: string;
    published: string;
    url: string;
    content: string;
    mainClaim?: 'main 1' | 'main 2' | 'main 3';
    subClaim: Array<'sub1' | 'sub2' | 'sub3'>;
};

type ViewMode = 'chaos' | 'main' | 'sub';

const SUB_POSITIONS = {
    sub1: new THREE.Vector3(-5, 0, 0),
    sub2: new THREE.Vector3(0, 5, 0),
    sub3: new THREE.Vector3(5, 0, 0),
};

const SUB_COLORS = {
    sub1: new THREE.Color(1, 1, 0), // Yellow
    sub2: new THREE.Color(0, 1, 1), // Cyan
    sub3: new THREE.Color(1, 0, 1), // Magenta
};

const generateCirclePositions = (
    centerX: number,
    centerY: number,
    radius: number,
    count: number
) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        positions.push(
            new THREE.Vector3(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius,
                0
            )
        );
    }
    return positions;
};

const MAIN_POSITIONS = {
    'main 1': generateCirclePositions(-5, 5, 2, 20),
    'main 2': generateCirclePositions(5, 5, 2, 20),
    'main 3': generateCirclePositions(0, -5, 2, 20),
};

const Particle = ({
    index,
    positions,
    velocities,
    articles,
    viewMode,
    color,
}: {
    index: number;
    positions: Float32Array;
    velocities: Float32Array;
    articles: AnalysedArticle[];
    viewMode: ViewMode;
    color: THREE.Color;
}) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            const position = new THREE.Vector3(
                positions[index * 3],
                positions[index * 3 + 1],
                positions[index * 3 + 2]
            );
            const quaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3(1, 1, 1);
            meshRef.current.setMatrixAt(
                0,
                new THREE.Matrix4().compose(position, quaternion, scale)
            );
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, 1]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color={color} />
        </instancedMesh>
    );
};

const Swarm = ({
    articles,
    viewMode,
}: {
    articles: AnalysedArticle[];
    viewMode: ViewMode;
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
    const isTransitioningRef = useRef<boolean>(false);

    useMemo(() => {
        for (let i = 0; i < articles.length; i++) {
            positionsRef.current[i * 3] = (Math.random() - 0.5) * 20;
            positionsRef.current[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positionsRef.current[i * 3 + 2] = (Math.random() - 0.5) * 20;
            velocitiesRef.current[i * 3] = (Math.random() - 0.5) * 0.1;
            velocitiesRef.current[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
            velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

            const article = articles[i];
            const averageColor = new THREE.Color(0, 0, 0);
            article.subClaim.forEach((sub) => {
                averageColor.add(SUB_COLORS[sub]);
            });
            averageColor.multiplyScalar(1 / article.subClaim.length);
            colorsRef.current[i] = averageColor;
        }
    }, [articles]);

    useEffect(() => {
        if (viewMode !== 'chaos') {
            const counts = {} as Record<string, number>;
            articles.forEach((article) => {
                if (viewMode === 'main' && article.mainClaim) {
                    counts[article.mainClaim] =
                        (counts[article.mainClaim] || 0) + 1;
                } else if (viewMode === 'sub') {
                    article.subClaim.forEach((sub) => {
                        counts[sub] = (counts[sub] || 0) + 1;
                    });
                }
            });

            articles.forEach((article, i) => {
                let targetPosition: THREE.Vector3;
                if (viewMode === 'main' && article.mainClaim) {
                    const positions = MAIN_POSITIONS[article.mainClaim];
                    const index = counts[article.mainClaim] % positions.length;
                    counts[article.mainClaim]--;
                    targetPosition = positions[index];
                } else if (viewMode === 'sub') {
                    const subPositions = article.subClaim.map((sub) => {
                        return SUB_POSITIONS[sub];
                    });
                    targetPosition = new THREE.Vector3();
                    subPositions.forEach((pos) => targetPosition.add(pos));
                    targetPosition.divideScalar(subPositions.length);
                } else {
                    targetPosition = new THREE.Vector3(
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 20,
                        (Math.random() - 0.5) * 20
                    );
                }

                targetPositionsRef.current[i * 3] = targetPosition.x;
                targetPositionsRef.current[i * 3 + 1] = targetPosition.y;
                targetPositionsRef.current[i * 3 + 2] = targetPosition.z;
            });

            isTransitioningRef.current = true;
            transitionProgressRef.current = 0;
        } else {
            isTransitioningRef.current = false;
        }
    }, [viewMode, articles]);

    useFrame(() => {
        const positions = positionsRef.current;
        const velocities = velocitiesRef.current;
        const targetPositions = targetPositionsRef.current;

        if (isTransitioningRef.current) {
            transitionProgressRef.current += 0.01;
            if (transitionProgressRef.current >= 1) {
                isTransitioningRef.current = false;
                transitionProgressRef.current = 1;
            }
        }

        for (let i = 0; i < articles.length; i++) {
            if (viewMode !== 'chaos') {
                const targetX = targetPositions[i * 3];
                const targetY = targetPositions[i * 3 + 1];
                const targetZ = targetPositions[i * 3 + 2];

                const dx = targetX - positions[i * 3];
                const dy = targetY - positions[i * 3 + 1];
                const dz = targetZ - positions[i * 3 + 2];

                const distanceToTarget = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (isTransitioningRef.current) {
                    positions[i * 3] += dx * 0.05;
                    positions[i * 3 + 1] += dy * 0.05;
                    positions[i * 3 + 2] += dz * 0.05;
                } else {
                    const attractionStrength = Math.min(
                        0.01,
                        distanceToTarget * 0.01
                    );
                    velocities[i * 3] += dx * attractionStrength;
                    velocities[i * 3 + 1] += dy * attractionStrength;
                    velocities[i * 3 + 2] += dz * attractionStrength;

                    velocities[i * 3] += (Math.random() - 0.5) * 0.005;
                    velocities[i * 3 + 1] += (Math.random() - 0.5) * 0.005;
                    velocities[i * 3 + 2] += (Math.random() - 0.5) * 0.005;

                    const speed = Math.sqrt(
                        velocities[i * 3] ** 2 +
                            velocities[i * 3 + 1] ** 2 +
                            velocities[i * 3 + 2] ** 2
                    );
                    const maxSpeed = 0.05;
                    if (speed > maxSpeed) {
                        velocities[i * 3] *= maxSpeed / speed;
                        velocities[i * 3 + 1] *= maxSpeed / speed;
                        velocities[i * 3 + 2] *= maxSpeed / speed;
                    }

                    positions[i * 3] += velocities[i * 3];
                    positions[i * 3 + 1] += velocities[i * 3 + 1];
                    positions[i * 3 + 2] += velocities[i * 3 + 2];

                    if (distanceToTarget > 1) {
                        const factor = 1 / distanceToTarget;
                        positions[i * 3] =
                            targetX + (positions[i * 3] - targetX) * factor;
                        positions[i * 3 + 1] =
                            targetY + (positions[i * 3 + 1] - targetY) * factor;
                        positions[i * 3 + 2] =
                            targetZ + (positions[i * 3 + 2] - targetZ) * factor;
                    }
                }
            } else {
                // Enhanced chaotic movement with collisions and repulsion
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

                // Apply repulsion forces from other particles
                for (let j = 0; j < articles.length; j++) {
                    if (i !== j) {
                        const otherPosition = new THREE.Vector3(
                            positions[j * 3],
                            positions[j * 3 + 1],
                            positions[j * 3 + 2]
                        );
                        const direction = particlePosition
                            .clone()
                            .sub(otherPosition);
                        const distance = direction.length();

                        if (distance < 0.5) {
                            // Repulsion radius
                            const repulsionForce = direction
                                .normalize()
                                .multiplyScalar(0.01 / (distance * distance));
                            particleVelocity.add(repulsionForce);
                        }
                    }
                }

                // Update position
                particlePosition.add(particleVelocity);

                // Boundary check and bounce
                const bounceStrength = 0.8;
                for (let axis = 0; axis < 3; axis++) {
                    if (Math.abs(particlePosition.getComponent(axis)) > 10) {
                        particlePosition.setComponent(
                            axis,
                            Math.sign(particlePosition.getComponent(axis)) * 10
                        );
                        particleVelocity.setComponent(
                            axis,
                            -particleVelocity.getComponent(axis) *
                                bounceStrength
                        );
                    }
                }

                // Add random acceleration
                particleVelocity.add(
                    new THREE.Vector3(
                        (Math.random() - 0.5) * 0.03,
                        (Math.random() - 0.5) * 0.03,
                        (Math.random() - 0.5) * 0.03
                    )
                );

                // Limit speed
                const maxSpeed = 0.2;
                if (particleVelocity.length() > maxSpeed) {
                    particleVelocity.normalize().multiplyScalar(maxSpeed);
                }

                // Update position and velocity arrays
                positions[i * 3] = particlePosition.x;
                positions[i * 3 + 1] = particlePosition.y;
                positions[i * 3 + 2] = particlePosition.z;
                velocities[i * 3] = particleVelocity.x;
                velocities[i * 3 + 1] = particleVelocity.y;
                velocities[i * 3 + 2] = particleVelocity.z;
            }
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
                />
            ))}
        </>
    );
};

const ArticleParticle = ({ articles }: { articles: AnalysedArticle[] }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('chaos');

    const handleToggle = () => {
        setViewMode((current) => {
            switch (current) {
                case 'chaos':
                    return 'main';
                case 'main':
                    return 'sub';
                case 'sub':
                    return 'chaos';
            }
        });
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <color attach='background' args={['black']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Swarm articles={articles} viewMode={viewMode} />
            </Canvas>
            <button
                onClick={handleToggle}
                style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    padding: '10px',
                    fontSize: '16px',
                }}
            >
                {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
            </button>
        </div>
    );
};

export default ArticleParticle;
