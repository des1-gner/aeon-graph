import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const GravitySwarm = ({ particleColor = '#00ff00' }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const particleSystemRef = useRef(null);
    const audioContextRef = useRef(null);
    const gainNodeRef = useRef(null);
    const audioSourceRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2());
    const colorRef = useRef(new THREE.Color(particleColor));

    const [G, setG] = useState(5.0);
    const [escapeVelocity, setEscapeVelocity] = useState(0.25);
    const [mouseInfluenceRadius, setMouseInfluenceRadius] = useState(5);

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer();

        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        const particleCount = 10000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10;
            velocities[i] = (Math.random() - 0.5) * 0.1;
            colors[i] = 1;
        }

        particles.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        );
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Create a circular texture for particles
        const textureSize = 64;
        const canvas = document.createElement('canvas');
        canvas.width = textureSize;
        canvas.height = textureSize;
        const context = canvas.getContext('2d');
        context.beginPath();
        context.arc(
            textureSize / 2,
            textureSize / 2,
            textureSize / 2,
            0,
            2 * Math.PI
        );
        context.fillStyle = 'white';
        context.fill();

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            map: texture,
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: true,
            vertexColors: true,
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        particleSystemRef.current = particleSystem;
        scene.add(particleSystem);

        camera.position.z = 5;

        const animate = () => {
            requestAnimationFrame(animate);

            const positions = particles.attributes.position.array;
            const colors = particles.attributes.color.array;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouseRef.current, camera);
            const mouseIntersectPoint = new THREE.Vector3();
            raycaster.ray.at(camera.position.z, mouseIntersectPoint);

            let particlesInOrbit = 0;

            for (let i = 0; i < particleCount; i++) {
                const index = i * 3;
                let x = positions[index];
                let y = positions[index + 1];
                let z = positions[index + 2];

                const particlePosition = new THREE.Vector3(x, y, z);
                const distanceVector =
                    particlePosition.sub(mouseIntersectPoint);
                const distance = distanceVector.length();

                if (distance < mouseInfluenceRadius) {
                    particlesInOrbit++;

                    const force = G / (distance * distance);
                    const acceleration = force * 0.016;

                    const perpVector = new THREE.Vector3(
                        -distanceVector.y,
                        distanceVector.x,
                        0
                    ).normalize();
                    velocities[index] +=
                        perpVector.x * acceleration -
                        distanceVector.x * acceleration * 0.5;
                    velocities[index + 1] +=
                        perpVector.y * acceleration -
                        distanceVector.y * acceleration * 0.5;
                    velocities[index + 2] +=
                        perpVector.z * acceleration -
                        distanceVector.z * acceleration * 0.5;

                    const speed = Math.sqrt(
                        velocities[index] ** 2 +
                            velocities[index + 1] ** 2 +
                            velocities[index + 2] ** 2
                    );
                    const colorIntensity = Math.min(speed / escapeVelocity, 1);

                    const particleColor = new THREE.Color().lerpColors(
                        new THREE.Color(0xffffff), // White
                        colorRef.current, // Specified color
                        colorIntensity
                    );

                    colors[index] = particleColor.r;
                    colors[index + 1] = particleColor.g;
                    colors[index + 2] = particleColor.b;
                } else {
                    colors[index] = Math.min(1, colors[index] + 0.01);
                    colors[index + 1] = Math.min(1, colors[index + 1] + 0.01);
                    colors[index + 2] = Math.min(1, colors[index + 2] + 0.01);
                }

                positions[index] += velocities[index] * 0.016;
                positions[index + 1] += velocities[index + 1] * 0.016;
                positions[index + 2] += velocities[index + 2] * 0.016;

                velocities[index] *= 0.99;
                velocities[index + 1] *= 0.99;
                velocities[index + 2] *= 0.99;

                const newDistance = Math.sqrt(
                    positions[index] ** 2 +
                        positions[index + 1] ** 2 +
                        positions[index + 2] ** 2
                );
                if (newDistance > 10) {
                    const scale = 10 / newDistance;
                    positions[index] *= scale;
                    positions[index + 1] *= scale;
                    positions[index + 2] *= scale;
                }
            }

            if (
                gainNodeRef.current &&
                audioContextRef.current &&
                audioContextRef.current.state === 'running'
            ) {
                const volumePercentage = Math.min(
                    particlesInOrbit / particleCount,
                    1
                );
                const minVolume = 0.01;
                const maxVolume = 1.0;
                const volume =
                    minVolume + (maxVolume - minVolume) * volumePercentage;
                gainNodeRef.current.gain.setValueAtTime(
                    volume,
                    audioContextRef.current.currentTime
                );
            }

            particles.attributes.position.needsUpdate = true;
            particles.attributes.color.needsUpdate = true;
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        const handleMouseMove = (event) => {
            mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            mountRef.current.removeChild(renderer.domElement);
        };
    }, [G, escapeVelocity, mouseInfluenceRadius, particleColor]);

    useEffect(() => {
        colorRef.current.set(particleColor);
    }, [particleColor]);

    const initAudio = () => {
        const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        audioContextRef.current = audioContext;

        fetch('./musicFile.mp3')
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
            .then((decodedAudio) => {
                const audioSource = audioContext.createBufferSource();
                audioSource.buffer = decodedAudio;
                audioSource.loop = false;

                const gainNode = audioContext.createGain();
                gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);

                audioSource.connect(gainNode);
                gainNode.connect(audioContext.destination);

                audioSourceRef.current = audioSource;
                gainNodeRef.current = gainNode;

                audioSource.start();
            })
            .catch((error) => console.error('Error loading audio:', error));
    };

    const createSlider = (label, min, max, value, step, onChange) => (
        <div style={{ marginBottom: '10px' }}>
            <label style={{ color: 'white' }}>{label}: </label>
            <input
                type='range'
                min={min}
                max={max}
                value={value}
                step={step}
                onChange={onChange}
                style={{ width: '100%' }}
            />
            <span style={{ marginLeft: '5px', color: 'white' }}>{value}</span>
        </div>
    );

    return (
        <div>
            <div ref={mountRef} />
            <div
                style={{
                    position: 'absolute',
                    top: '40px',
                    right: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    padding: '10px',
                    borderRadius: '5px',
                }}
            >
                {createSlider('Gravity', 0, 10, G, 0.1, (e) =>
                    setG(parseFloat(e.target.value))
                )}
                {createSlider(
                    'Escape Velocity',
                    0,
                    1,
                    escapeVelocity,
                    0.01,
                    (e) => setEscapeVelocity(parseFloat(e.target.value))
                )}
                {createSlider(
                    'Mouse Influence Radius',
                    1,
                    10,
                    mouseInfluenceRadius,
                    0.1,
                    (e) => setMouseInfluenceRadius(parseFloat(e.target.value))
                )}
            </div>
        </div>
    );
};

export default GravitySwarm;
