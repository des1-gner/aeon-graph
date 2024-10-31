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
    const [initialShowSearchQueryModal, setInitialShowSearchQueryModal] =
        useState(true);

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
        return <div className='bg-black min-h-screen'></div>;
    }

    return (
        <div className='bg-black min-h-screen relative'>
            {/* Disclaimer Layer */}
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

            {/* Main Content Layer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: disclaimerState.accepted ? 1 : 0 }}
                transition={{ duration: 2 }}
                className='absolute inset-0 z-0'
            >
                {/* Fullscreen button */}
                <motion.button
                    onClick={toggleFullScreen}
                    className='fixed bottom-4 left-4 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors duration-200'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {isFullScreen ? (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-8 w-8'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3'
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-8 w-8'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M5 5h2m-2 0v2m0-2l4 4m10-4h-2m2 0v2m0-2l-4 4M5 19h2m-2 0v-2m0 2l4-4m10 4h-2m2 0v-2m0 2l-4-4'
                            />
                        </svg>
                    )}
                </motion.button>

                <ArticleParticle
                    articles={articles || []}
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
                                    initialShowSearchQueryModal={
                                        initialShowSearchQueryModal
                                    }
                                    setInitialShowSearchQueryModal={
                                        setInitialShowSearchQueryModal
                                    }
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
