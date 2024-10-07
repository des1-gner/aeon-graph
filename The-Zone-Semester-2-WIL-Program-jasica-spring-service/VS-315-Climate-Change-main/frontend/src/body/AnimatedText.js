import React, { useEffect, useRef } from 'react';
import './AnimatedText.css';

const AnimatedText = ({ initialTexts, texts, connections }) => {
    // References to store browser dimensions, canvas element, text elements, and animation frame ID
    const browserWidth = useRef(document.documentElement.clientWidth);
    const browserHeight = useRef(document.documentElement.clientHeight);
    const canvasRef = useRef(null);
    const textElements = useRef([]);
    const animationFrameId = useRef(null);
    const displayedTextsSet = useRef(new Set());

    useEffect(() => {
        // Select the container for animated text
        const container = document.querySelector(".container");
        const arr = [-1, 1]; // Array used to randomize text movement direction

        // Handle browser resize to adjust canvas size
        const handleResize = () => {
            browserWidth.current = document.documentElement.clientWidth;
            browserHeight.current = document.documentElement.clientHeight;
            resizeCanvas();
        };

        window.addEventListener('resize', handleResize);

        // Function to start text animation for each initial text
        function textAnimation(index = 0) {
            if (index >= initialTexts.length) return; // Stop if all initial texts are animated

            const initialText = initialTexts[index];
            const relatedTexts = getUniqueRelatedTexts(initialText, texts, connections).slice(0, 5);

            displayTextWithDelay(initialText, () => {
                relatedTexts.forEach((relatedText, idx) => {
                    displayTextWithDelay(relatedText, null, idx * 2000); // Delay each related text by 2 seconds
                });
                setTimeout(() => {
                    textAnimation(index + 1); // Proceed to next initial text
                }, (relatedTexts.length || 0) * 2000 + 2000); // Delay for related texts + 2 seconds
            });
        }

        // Get unique related texts for a given initial text based on connections
        function getUniqueRelatedTexts(initialText, texts, connections) {
            const relatedTextsSet = new Set();
            const relatedTexts = [];

            texts.forEach(textObj => {
                connections.forEach(conn => {
                    if ((conn.source.toLowerCase() === initialText.text.toLowerCase() && conn.target.toLowerCase() === textObj.text.toLowerCase()) ||
                        (conn.target.toLowerCase() === initialText.text.toLowerCase() && conn.source.toLowerCase() === textObj.text.toLowerCase())) {
                        if (!relatedTextsSet.has(textObj.text.toLowerCase()) && !displayedTextsSet.current.has(textObj.text.toLowerCase())) {
                            relatedTextsSet.add(textObj.text.toLowerCase());
                            relatedTexts.push(textObj);
                        }
                    }
                });
            });

            relatedTexts.forEach(text => displayedTextsSet.current.add(text.text.toLowerCase()));

            return relatedTexts;
        }

        // Display text element with a delay
        function displayTextWithDelay(textObj, callback, delay = 0) {
            setTimeout(() => {
                const { text, color } = textObj;
                const textElement = document.createElement("div");
                let posX, posY;
                let isOverlapping;

                // Ensure non-overlapping initial placement
                do {
                    posX = randomNum(0, browserWidth.current - 100);
                    posY = randomNum(0, browserHeight.current - 20);
                    isOverlapping = checkInitialOverlap(posX, posY, textElement);
                } while (isOverlapping);

                const textSpeedX = randomSpeed(0.1, 0.3, 0.1) * arr[randomNum(0, 1)];
                const textSpeedY = randomSpeed(0.1, 0.3, 0.1) * arr[randomNum(0, 1)];

                textElement.classList.add("text");
                textElement.style.left = `${posX}px`;
                textElement.style.top = `${posY}px`;
                textElement.textContent = text;

                // Apply the appropriate class based on the color
                if (color === '#7be9fd') {
                    textElement.classList.add("blue-text");
                } else if (color === '#999999') {
                    textElement.classList.add("gray-text");
                }

                container.appendChild(textElement);

                textElements.current.push({ element: textElement, posX, posY, textSpeedX, textSpeedY });

                if (callback) callback();
            }, delay);
        }

        // Check if the text element overlaps with any existing element
        function checkInitialOverlap(posX, posY, textElement) {
            return textElements.current.some(textObj =>
                posX < textObj.posX + textObj.element.offsetWidth &&
                posX + textElement.offsetWidth > textObj.posX &&
                posY < textObj.posY + textObj.element.offsetHeight &&
                posY + textElement.offsetHeight > textObj.posY
            );
        }

        textAnimation(); // Start text animation

        // Generate a random number within a range
        function randomNum(min, max) {
            return Math.floor(Math.random() * (max + 1 - min) + min);
        }

        // Generate a random speed for text movement
        function randomSpeed(min, max, threshold) {
            let speed = Math.random() * (max - min) + min;
            return Math.abs(speed) < threshold ? threshold : speed;
        }

        // Function to run the text animation
        function textRun() {
            const ctx = canvasRef.current.getContext('2d');

            function run() {
                ctx.clearRect(0, 0, browserWidth.current, browserHeight.current);
                textElements.current.forEach((textObj, i) => {
                    textObj.posX += textObj.textSpeedX;
                    textObj.posY += textObj.textSpeedY;

                    const textLeft = browserWidth.current - textObj.element.offsetWidth;
                    const textTop = browserHeight.current - textObj.element.offsetHeight;

                    // Check for boundary collisions
                    if (textObj.posX > textLeft) {
                        textObj.posX = textLeft;
                        textObj.textSpeedX = -textObj.textSpeedX;
                    } else if (textObj.posX < 0) {
                        textObj.posX = 0;
                        textObj.textSpeedX = -textObj.textSpeedX;
                    }

                    if (textObj.posY > textTop) {
                        textObj.posY = textTop;
                        textObj.textSpeedY = -textObj.textSpeedY;
                    } else if (textObj.posY < 0) {
                        textObj.posY = 0;
                        textObj.textSpeedY = -textObj.textSpeedY;
                    }

                    // Check for collisions with other text elements
                    textElements.current.forEach((otherTextObj, j) => {
                        if (i !== j) {
                            const overlapX = textObj.posX < otherTextObj.posX + otherTextObj.element.offsetWidth &&
                                textObj.posX + textObj.element.offsetWidth > otherTextObj.posX;
                            const overlapY = textObj.posY < otherTextObj.posY + otherTextObj.element.offsetHeight &&
                                textObj.posY + textObj.element.offsetHeight > otherTextObj.posY;

                            if (overlapX && overlapY) {
                                // Adjust speeds and directions to simulate "bouncing off" in different directions
                                const angle = Math.atan2(otherTextObj.posY - textObj.posY, otherTextObj.posX - textObj.posX);
                                const speed = Math.sqrt(textObj.textSpeedX * textObj.textSpeedX + textObj.textSpeedY * textObj.textSpeedY);
                                textObj.textSpeedX = -Math.cos(angle) * speed;
                                textObj.textSpeedY = -Math.sin(angle) * speed;

                                const otherSpeed = Math.sqrt(otherTextObj.textSpeedX * otherTextObj.textSpeedX + otherTextObj.textSpeedY * otherTextObj.textSpeedY);
                                otherTextObj.textSpeedX = Math.cos(angle) * otherSpeed;
                                otherTextObj.textSpeedY = Math.sin(angle) * otherSpeed;
                            }
                        }
                    });

                    textObj.element.style.left = `${textObj.posX}px`;
                    textObj.element.style.top = `${textObj.posY}px`;
                });

                // Draw connections between related text elements
                connections.forEach(({ source, target }) => {
                    const sourceObj = textElements.current.find(el => el.element.textContent.toLowerCase() === source.toLowerCase());
                    const targetObj = textElements.current.find(el => el.element.textContent.toLowerCase() === target.toLowerCase());

                    if (sourceObj && targetObj) {
                        ctx.beginPath();
                        ctx.moveTo(sourceObj.posX + sourceObj.element.offsetWidth / 2, sourceObj.posY + sourceObj.element.offsetHeight / 2);
                        ctx.lineTo(targetObj.posX + targetObj.element.offsetWidth / 2, targetObj.posY + targetObj.element.offsetHeight / 2);
                        ctx.strokeStyle = '#999999'; // Gray color for connection lines
                        ctx.stroke();
                    }
                });

                animationFrameId.current = requestAnimationFrame(run);
            }

            run(); // Start the animation loop
        }

        textRun(); // Start running the text

        // Resize the canvas to match the browser dimensions
        function resizeCanvas() {
            const canvas = canvasRef.current;
            canvas.width = browserWidth.current;
            canvas.height = browserHeight.current;
        }

        resizeCanvas(); // Initial resize

        // Cleanup function to remove event listeners and animation frames
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            textElements.current.forEach(({ element }) => {
                if (container.contains(element)) {
                    container.removeChild(element);
                }
            });
        };
    }, [initialTexts, texts, connections]);

    // Render the container and canvas for text animation
    return (
        <div className="container">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default AnimatedText;