import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export type AnalysedArticle = {
    date: string;
    headline: string;
    published: string;
    url: string;
    content: string;
    tags: 'tag1' | 'tag2' | 'tag3';
};

interface ArticleVisualizerProps {
    articles: AnalysedArticle[];
}

const ArticleVisualizer: React.FC<ArticleVisualizerProps> = ({ articles }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    const mouseRef = useRef(new THREE.Vector2());

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer();

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Particle system
        const particleCount = articles.length;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const homes = new Float32Array(particleCount * 3);

        const colorMap = {
            tag1: new THREE.Color(0xff0000), // Red
            tag2: new THREE.Color(0x00ff00), // Green
            tag3: new THREE.Color(0x0000ff), // Blue
        };

        const homeBases = {
            tag1: new THREE.Vector3(-5, 0, 0),
            tag2: new THREE.Vector3(0, 5, 0),
            tag3: new THREE.Vector3(5, 0, 0),
        };

        articles.forEach((article, i) => {
            const index = i * 3;
            const homeBase = homeBases[article.tags];
            const color = colorMap[article.tags];

            // Set initial position near home base
            positions[index] = homeBase.x + (Math.random() - 0.5) * 2;
            positions[index + 1] = homeBase.y + (Math.random() - 0.5) * 2;
            positions[index + 2] = homeBase.z + (Math.random() - 0.5) * 2;

            // Set color
            colors[index] = color.r;
            colors[index + 1] = color.g;
            colors[index + 2] = color.b;

            // Set home base
            homes[index] = homeBase.x;
            homes[index + 1] = homeBase.y;
            homes[index + 2] = homeBase.z;

            // Initialize velocity
            velocities[index] = 0;
            velocities[index + 1] = 0;
            velocities[index + 2] = 0;
        });

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        );
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        const particles = new THREE.Points(geometry, material);
        particlesRef.current = particles;
        scene.add(particles);

        camera.position.z = 15;

        const animate = () => {
            requestAnimationFrame(animate);

            const positions = geometry.attributes.position
                .array as Float32Array;

            for (let i = 0; i < particleCount; i++) {
                const index = i * 3;
                const x = positions[index];
                const y = positions[index + 1];
                const z = positions[index + 2];

                // Gravitational force towards home base
                const homeX = homes[index];
                const homeY = homes[index + 1];
                const homeZ = homes[index + 2];

                const dx = homeX - x;
                const dy = homeY - y;
                const dz = homeZ - z;
                const distanceToHome = Math.sqrt(dx * dx + dy * dy + dz * dz);

                const gravityStrength = 0.01;
                velocities[index] += (dx * gravityStrength) / distanceToHome;
                velocities[index + 1] +=
                    (dy * gravityStrength) / distanceToHome;
                velocities[index + 2] +=
                    (dz * gravityStrength) / distanceToHome;

                // Mouse repulsion
                const mouseX = mouseRef.current.x * 10;
                const mouseY = mouseRef.current.y * 10;
                const dxMouse = x - mouseX;
                const dyMouse = y - mouseY;
                const distanceToMouse = Math.sqrt(
                    dxMouse * dxMouse + dyMouse * dyMouse
                );

                if (distanceToMouse < 2) {
                    const repulsionStrength = 0.05 / distanceToMouse;
                    velocities[index] += dxMouse * repulsionStrength;
                    velocities[index + 1] += dyMouse * repulsionStrength;
                }

                // Apply velocity
                positions[index] += velocities[index];
                positions[index + 1] += velocities[index + 1];
                positions[index + 2] += velocities[index + 2];

                // Apply damping
                velocities[index] *= 0.99;
                velocities[index + 1] *= 0.99;
                velocities[index + 2] *= 0.99;
            }

            geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (cameraRef.current && rendererRef.current) {
                cameraRef.current.aspect =
                    window.innerWidth / window.innerHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(
                    window.innerWidth,
                    window.innerHeight
                );
            }
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (mountRef.current && rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, [articles]);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ArticleVisualizer;
