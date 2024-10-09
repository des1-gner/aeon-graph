import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import DisclaimerPopup from './components/DisclaimerPopup'; //Imported DisclaimerPopup component 
import { BottomPanelControl } from './components/BottomPanelControl';
import { SidePanelControl } from './components/SidePanelControl';
import { ArticleParticle } from './three.js/ArticleParticle';
import { useArticles } from './contexts/ArticlesContext';
import { dummyArticles } from './types/article';

function App() {
    const [showSideControls, setShowSideControls] = useState(true);
    const [showBottomControls, setShowBottomControls] = useState(true);
    const { articles } = useArticles();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false); // Controls disclaimer visibility
    const [disclaimerOpacity, setDisclaimerOpacity] = useState(1);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleEnterSite = () => {
        setIsDisclaimerAccepted(false); // Hide home page to show main content
    };

    const handleDisclaimerAccept = () => {
        setDisclaimerOpacity(0);
        setTimeout(() => {
          setIsDisclaimerAccepted(true);
        }, 2000);
      };

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

    // Render DisclaimerPopup first if it has not been accepted yet
    if (!isDisclaimerAccepted) {
        return <DisclaimerPopup onAccept={handleDisclaimerAccept} />;
    }

    return (
        <div className='bg-black min-h-screen'>
            <ArticleParticle articles={articles ? articles : dummyArticles} />
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
            {/* <AnimatePresence>
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
            </AnimatePresence> */}
            <audio ref={audioRef} src='/music/ambient-spring-forest.mp3' loop />
        </div>
    );
}

export default App;
