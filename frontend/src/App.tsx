import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import DisclaimerPopup from './components/DisclaimerPopup';
import { BottomPanelControl } from './components/BottomPanelControl';
import { SidePanelControl } from './components/SidePanelControl';
import { ArticleParticle } from './three.js/ArticleParticle';
import { useArticles } from './contexts/ArticlesContext';
import { dummyArticles } from './types/article';

function App() {
    const [showSideControls, setShowSideControls] = useState(true);
    const [showBottomControls, setShowBottomControls] = useState(true);
    const {
        articles,
        highlightedWord,
        highlightColor,
        clusterColor,
        edgeColor,
        highlightOptions,
        clusterOptions,
        edgeOptions,
    } = useArticles();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [disclaimerState, setDisclaimerState] = useState(() => {
        const accepted =
            sessionStorage.getItem('disclaimerAccepted') === 'true';
        return {
            accepted,
            show: !accepted,
            transitioning: false,
        };
    });
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 100);
    }, []);

    const handleDisclaimerAccept = () => {
        setDisclaimerState((prev) => ({ ...prev, transitioning: true }));
        setTimeout(() => {
            setDisclaimerState({
                accepted: true,
                show: false,
                transitioning: false,
            });
            sessionStorage.setItem('disclaimerAccepted', 'true');
        }, 2000);
    };

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
            if (e.clientX > window.innerWidth - 100 && e.clientY < 100) {
                setShowSideControls(true);
            }

            if (e.clientY > window.innerHeight - 50) {
                setShowBottomControls(true);
            }
        };

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

    if (isLoading) {
        return <div className='bg-black min-h-screen'></div>; // Or a loading spinner
    }

    return (
        <div className='bg-black min-h-screen relative'>
            <AnimatePresence>
                {disclaimerState.show && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{
                            opacity: disclaimerState.transitioning ? 0 : 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className='absolute inset-0 z-50'
                    >
                        <DisclaimerPopup onAccept={handleDisclaimerAccept} />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: disclaimerState.accepted ? 1 : 0 }}
                transition={{ duration: 2 }}
                className='absolute inset-0 z-0'
            >
                <ArticleParticle
                    articles={articles || dummyArticles}
                    highlightColor={highlightColor}
                    clusterColor={clusterColor}
                    edgeColor={edgeColor}
                    highlightOptions={highlightOptions}
                    clusterOptions={clusterOptions}
                    edgeOptions={edgeOptions}
                />

                <AnimatePresence>
                    {showSideControls && (
                        <motion.div
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ duration: 0.8 }}
                            className='fixed top-0 right-0 z-20'
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
                            className='fixed bottom-0 flex justify-center left-0 right-0 z-20'
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

                <audio
                    ref={audioRef}
                    src='/music/ambient-spring-forest.mp3'
                    loop
                />
            </motion.div>
        </div>
    );
}

export default App;
