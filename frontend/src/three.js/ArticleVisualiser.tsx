import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { AnalysedArticle } from '../types/analysedArticle';

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
        const homes = new Float32Array(particleCount * 6); // Store two home bases

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
            const homeIndex = i * 6;

            // Handle multiple tags
            const tag1 = article.tags[0];
            const tag2 = article.tags[1];
            const homeBase1 = homeBases[tag1];
            const homeBase2 = tag2 ? homeBases[tag2] : homeBase1;

            // Set initial position between home bases
            positions[index] =
                (homeBase1.x + homeBase2.x) / 2 + (Math.random() - 0.5) * 2;
            positions[index + 1] =
                (homeBase1.y + homeBase2.y) / 2 + (Math.random() - 0.5) * 2;
            positions[index + 2] =
                (homeBase1.z + homeBase2.z) / 2 + (Math.random() - 0.5) * 2;

            // Set color (blend if two tags)
            const color1 = colorMap[tag1];
            const color2 = tag2 ? colorMap[tag2] : color1;
            colors[index] = (color1.r + color2.r) / 2;
            colors[index + 1] = (color1.g + color2.g) / 2;
            colors[index + 2] = (color1.b + color2.b) / 2;

            // Set home bases
            homes[homeIndex] = homeBase1.x;
            homes[homeIndex + 1] = homeBase1.y;
            homes[homeIndex + 2] = homeBase1.z;
            homes[homeIndex + 3] = homeBase2.x;
            homes[homeIndex + 4] = homeBase2.y;
            homes[homeIndex + 5] = homeBase2.z;

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
                const homeIndex = i * 6;
                const x = positions[index];
                const y = positions[index + 1];
                const z = positions[index + 2];

                // Gravitational force towards home bases
                const homeX1 = homes[homeIndex];
                const homeY1 = homes[homeIndex + 1];
                const homeZ1 = homes[homeIndex + 2];
                const homeX2 = homes[homeIndex + 3];
                const homeY2 = homes[homeIndex + 4];
                const homeZ2 = homes[homeIndex + 5];

                // Calculate forces for both home bases
                const calculateForce = (hx: number, hy: number, hz: number) => {
                    const dx = hx - x;
                    const dy = hy - y;
                    const dz = hz - z;
                    const distanceToHome = Math.sqrt(
                        dx * dx + dy * dy + dz * dz
                    );
                    const gravityStrength = 0.005;
                    return {
                        fx: (dx * gravityStrength) / distanceToHome,
                        fy: (dy * gravityStrength) / distanceToHome,
                        fz: (dz * gravityStrength) / distanceToHome,
                    };
                };

                const force1 = calculateForce(homeX1, homeY1, homeZ1);
                const force2 = calculateForce(homeX2, homeY2, homeZ2);

                // Apply combined forces
                velocities[index] += (force1.fx + force2.fx) / 2;
                velocities[index + 1] += (force1.fy + force2.fy) / 2;
                velocities[index + 2] += (force1.fz + force2.fz) / 2;

                // Mouse repulsion (unchanged)
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
