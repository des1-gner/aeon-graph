import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import BottomPanelControl from './components/BottomPanelControl';
import SidePanelControl from './components/SidePanelControl';
import { BroadClaimVisualiser } from './three.js/BroadClaimVisualiser';
import { dummyDbArticles } from './types/dbArticle';
import { useArticles } from './contexts/ArticlesContext';

function App() {
    const [showSideControls, setShowSideControls] = useState(true);
    const [showBottomControls, setShowBottomControls] = useState(true);
    const { articles, setArticles } = useArticles();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Bottom Panel Fullscreen
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(
                    `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
                );
            });
        } else {
            document.exitFullscreen();
        }
        setIsFullScreen(!isFullScreen);
    };

    // Bottom Panel Music
    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const handleSidePanelMouseMove = (e: MouseEvent) => {
            // Changed to detect top right corner
            if (e.clientX > window.innerWidth - 100 && e.clientY < 100) {
                setShowSideControls(true);
            }

            if (e.clientY > window.innerHeight - 50) {
                setShowBottomControls(true);
            }
        };

        // Hovering about a certain point allows the bottom panel to pop up
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY < window.innerHeight - 50) {
                setShowBottomControls(true);
            }
        };

        window.addEventListener('mousemove', handleSidePanelMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleSidePanelMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className='bg-black min-h-screen'>
            <BroadClaimVisualiser articles={articles!} />
            <AnimatePresence>
                {showSideControls && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.8 }}
                        className='fixed top-0 right-0 z-10'
                    >
                        <div className='p-4'>
                            <SidePanelControl
                                onClose={() => setShowSideControls(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showBottomControls && (
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ duration: 0.8 }}
                        className='fixed bottom-0 flex justify-center left-0 right-0'
                    >
                        <div className='p-4'>
                            <BottomPanelControl
                                onClose={() => setShowBottomControls(false)}
                                isPlaying={isPlaying}
                                toggleMusic={toggleMusic}
                                toggleFullScreen={toggleFullScreen}
                                isFullScreen={isFullScreen}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <audio ref={audioRef} src='/music/ambient-spring-forest.mp3' loop />
        </div>
    );
}

export default App;
