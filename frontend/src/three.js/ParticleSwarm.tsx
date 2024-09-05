import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import Button from '../components/Button';

interface ParticleUserData {
    velocity: THREE.Vector3;
    colorIndex: number;
    basePosition: THREE.Vector3;
}

type ParticleData = THREE.Mesh<
    THREE.SphereGeometry,
    THREE.MeshBasicMaterial
> & {
    userData: ParticleUserData;
};

const ParticleSwarm: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [organised, setOrganised] = useState<boolean>(false);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        const colors: number[] = [0xffffff, 0x30f8ff, 0xff8624, 0x73ff72];
        const categories = ['Air', 'Water', 'Fire', 'Earth'];
        const particles: ParticleData[] = [];
        const particleSystem = new THREE.Group();
        const textSprites: THREE.Sprite[] = [];

        const getCornerPosition = (colorIndex: number): THREE.Vector3 => {
            switch (colorIndex) {
                case 0:
                    return new THREE.Vector3(-4, 4, 0);
                case 1:
                    return new THREE.Vector3(4, 4, 0);
                case 2:
                    return new THREE.Vector3(-4, -4, 0);
                case 3:
                    return new THREE.Vector3(4, -4, 0);
                default:
                    return new THREE.Vector3(0, 0, 0);
            }
        };

        // Create particles
        for (let i = 0; i < 2000; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: colors[i % 4],
                blending: THREE.AdditiveBlending,
                transparent: true,
            });
            const particle = new THREE.Mesh(geometry, material) as ParticleData;

            particle.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );

            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                colorIndex: i % 4,
                basePosition: new THREE.Vector3(),
            };

            particles.push(particle);
            particleSystem.add(particle);
        }

        scene.add(particleSystem);
        camera.position.z = 10;

        // Create text sprites using a standard font
        categories.forEach((category, index) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 512;
            canvas.height = 512;

            if (context) {
                context.font = 'Bold 120px Arial, Helvetica, sans-serif';
                context.fillStyle = `#${colors[index]
                    .toString(16)
                    .padStart(6, '0')}`;
                context.textAlign = 'center';
                context.fillText(category, 256, 256);
            }

            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: 0,
            });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(4, 2, 1);
            sprite.position.copy(getCornerPosition(index));
            scene.add(sprite);
            textSprites.push(sprite);
        });

        const textAvoidanceRadius = 1.5; // Adjust this value to change the size of the text "bubble"

        const animate = () => {
            requestAnimationFrame(animate);

            particles.forEach((particle: ParticleData) => {
                if (organised) {
                    const cornerPosition = getCornerPosition(
                        particle.userData.colorIndex
                    );
                    if (particle.userData.basePosition.lengthSq() === 0) {
                        particle.userData.basePosition.set(
                            cornerPosition.x + (Math.random() - 0.5) * 2,
                            cornerPosition.y + (Math.random() - 0.5) * 2,
                            (Math.random() - 0.5) * 2
                        );
                    }
                    particle.position.lerp(
                        particle.userData.basePosition,
                        0.05
                    );

                    // Apply text avoidance
                    const textPosition = getCornerPosition(
                        particle.userData.colorIndex
                    );
                    const distanceToText =
                        particle.position.distanceTo(textPosition);
                    if (distanceToText < textAvoidanceRadius) {
                        const avoidanceForce = particle.position
                            .clone()
                            .sub(textPosition)
                            .normalize();
                        const avoidanceStrength =
                            (textAvoidanceRadius - distanceToText) /
                            textAvoidanceRadius;
                        particle.position.add(
                            avoidanceForce.multiplyScalar(
                                avoidanceStrength * 0.9
                            )
                        );
                    }

                    particle.position.x +=
                        Math.sin(
                            Date.now() * 0.001 + particle.userData.colorIndex
                        ) * 0.005;
                    particle.position.y +=
                        Math.cos(
                            Date.now() * 0.001 + particle.userData.colorIndex
                        ) * 0.005;
                } else {
                    particle.position.add(particle.userData.velocity);

                    if (Math.abs(particle.position.x) > 5)
                        particle.userData.velocity.x *= -1;
                    if (Math.abs(particle.position.y) > 5)
                        particle.userData.velocity.y *= -1;
                    if (Math.abs(particle.position.z) > 5)
                        particle.userData.velocity.z *= -1;

                    particle.userData.basePosition.set(0, 0, 0);
                }
            });

            // Fade in/out text sprites
            textSprites.forEach((sprite) => {
                if (organised) {
                    sprite.material.opacity = Math.min(
                        sprite.material.opacity + 0.01,
                        1
                    );
                } else {
                    sprite.material.opacity = Math.max(
                        sprite.material.opacity - 0.01,
                        0
                    );
                }
            });

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [organised]);

    return (
        <>
            <div ref={mountRef} className='absolute top-0 left-0' />
            <div className='absolute top-4 left-4 z-10'>
                <Button
                    variant='primary'
                    onClick={() => setOrganised(!organised)}
                    className='font-semibold'
                >
                    {organised ? 'Random' : 'Organise'}
                </Button>
            </div>
        </>
    );
};

export default ParticleSwarm;
