import { useEffect, useState } from 'react';
import SidePanelControl from './components/SidePanelControl';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (e.x < 100 && e.y < 100) {
                setShowControls(true);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className='bg-black min-h-screen'>
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-100%' }}
                        transition={{ duration: 0.8 }} // Adjust the duration for speed
                    >
                        <div className='flex justify-start align-middle p-4'>
                            <SidePanelControl
                                onClose={() => setShowControls(false)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
