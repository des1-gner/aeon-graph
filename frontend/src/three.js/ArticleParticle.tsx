import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type AnalysedArticle = {
    date: string;
    headline: string;
    published: string;
    url: string;
    content: string;
    tags: Array<'tag1' | 'tag2' | 'tag3'>;
};

const TAG_POSITIONS = {
    tag1: new THREE.Vector3(-5, 0, 0),
    tag2: new THREE.Vector3(0, 5, 0),
    tag3: new THREE.Vector3(5, 0, 0),
};

const TAG_COLORS = {
    tag1: new THREE.Color(1, 1, 0), // Yellow
    tag2: new THREE.Color(1, 0, 0), // Red
    tag3: new THREE.Color(0, 0, 1), // Blue
};

const Particle = ({
    index,
    positions,
    velocities,
    articles,
    isOrdered,
    color,
}: {
    index: number;
    positions: Float32Array;
    velocities: Float32Array;
    articles: AnalysedArticle[];
    isOrdered: boolean;
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
    isOrdered,
}: {
    articles: AnalysedArticle[];
    isOrdered: boolean;
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
            positionsRef.current[i * 3] = (Math.random() - 0.5) * 10;
            positionsRef.current[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positionsRef.current[i * 3 + 2] = (Math.random() - 0.5) * 10;
            velocitiesRef.current[i * 3] = (Math.random() - 0.5) * 0.02;
            velocitiesRef.current[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocitiesRef.current[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

            // Calculate color based on tags
            const article = articles[i];
            const averageColor = new THREE.Color(0, 0, 0);
            article.tags.forEach((tag) => {
                averageColor.add(TAG_COLORS[tag]);
            });
            averageColor.multiplyScalar(1 / article.tags.length);
            colorsRef.current[i] = averageColor;
        }
    }, [articles]);

    useEffect(() => {
        if (isOrdered) {
            for (let i = 0; i < articles.length; i++) {
                const article = articles[i];
                const tagPositions = article.tags.map(
                    (tag) => TAG_POSITIONS[tag]
                );
                const averagePosition = new THREE.Vector3();
                tagPositions.forEach((pos) => averagePosition.add(pos));
                averagePosition.divideScalar(tagPositions.length);

                targetPositionsRef.current[i * 3] = averagePosition.x;
                targetPositionsRef.current[i * 3 + 1] = averagePosition.y;
                targetPositionsRef.current[i * 3 + 2] = averagePosition.z;
            }
            isTransitioningRef.current = true;
            transitionProgressRef.current = 0;
        } else {
            isTransitioningRef.current = false;
        }
    }, [isOrdered, articles]);

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
            if (isOrdered) {
                const targetX = targetPositions[i * 3];
                const targetY = targetPositions[i * 3 + 1];
                const targetZ = targetPositions[i * 3 + 2];

                // Calculate direction to target
                const dx = targetX - positions[i * 3];
                const dy = targetY - positions[i * 3 + 1];
                const dz = targetZ - positions[i * 3 + 2];

                // Calculate distance to target
                const distanceToTarget = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (isTransitioningRef.current) {
                    // Smooth transition to target position
                    positions[i * 3] += dx * 0.05;
                    positions[i * 3 + 1] += dy * 0.05;
                    positions[i * 3 + 2] += dz * 0.05;
                } else {
                    // Grouped state behavior
                    // Adjust velocity based on distance to target
                    const attractionStrength = Math.min(
                        0.01,
                        distanceToTarget * 0.01
                    );
                    velocities[i * 3] += dx * attractionStrength;
                    velocities[i * 3 + 1] += dy * attractionStrength;
                    velocities[i * 3 + 2] += dz * attractionStrength;

                    // Add some randomness to velocity
                    velocities[i * 3] += (Math.random() - 0.5) * 0.005;
                    velocities[i * 3 + 1] += (Math.random() - 0.5) * 0.005;
                    velocities[i * 3 + 2] += (Math.random() - 0.5) * 0.005;

                    // Limit velocity
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

                    // Update position
                    positions[i * 3] += velocities[i * 3];
                    positions[i * 3 + 1] += velocities[i * 3 + 1];
                    positions[i * 3 + 2] += velocities[i * 3 + 2];

                    // Contain within a sphere around the target
                    if (distanceToTarget > 2) {
                        const factor = 2 / distanceToTarget;
                        positions[i * 3] =
                            targetX + (positions[i * 3] - targetX) * factor;
                        positions[i * 3 + 1] =
                            targetY + (positions[i * 3 + 1] - targetY) * factor;
                        positions[i * 3 + 2] =
                            targetZ + (positions[i * 3 + 2] - targetZ) * factor;
                    }
                }
            } else {
                // Chaotic movement (unchanged)
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];

                // Simple boundary check
                for (let j = 0; j < 3; j++) {
                    if (Math.abs(positions[i * 3 + j]) > 5) {
                        velocities[i * 3 + j] *= -1;
                    }
                }

                // Add small random acceleration
                velocities[i * 3] += (Math.random() - 0.5) * 0.01;
                velocities[i * 3 + 1] += (Math.random() - 0.5) * 0.01;
                velocities[i * 3 + 2] += (Math.random() - 0.5) * 0.01;

                // Limit velocity
                const speed = Math.sqrt(
                    velocities[i * 3] ** 2 +
                        velocities[i * 3 + 1] ** 2 +
                        velocities[i * 3 + 2] ** 2
                );
                if (speed > 0.1) {
                    velocities[i * 3] *= 0.1 / speed;
                    velocities[i * 3 + 1] *= 0.1 / speed;
                    velocities[i * 3 + 2] *= 0.1 / speed;
                }
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
                    isOrdered={isOrdered}
                    color={colorsRef.current[index]}
                />
            ))}
        </>
    );
};

const ArticleParticle = ({ articles }: { articles: AnalysedArticle[] }) => {
    const [isOrdered, setIsOrdered] = useState(false);

    const handleToggle = () => {
        setIsOrdered(!isOrdered);
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <color attach='background' args={['black']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Swarm articles={articles} isOrdered={isOrdered} />
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
                {isOrdered ? 'Chaos' : 'Order'}
            </button>
        </div>
    );
};

export default ArticleParticle;
