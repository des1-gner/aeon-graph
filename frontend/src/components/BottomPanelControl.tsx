import {
    ArrowsPointingInIcon,
    ArrowsPointingOutIcon,
    MusicalNoteIcon,
    PauseIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';

/**
 * Props interface for the BottomPanelControl component
 * @interface BottomPanelControlProps
 * @property {() => void} [onClose] - Optional callback function to handle panel closure
 * @property {boolean} isPlaying - Current state of music playback
 * @property {() => void} toggleMusic - Function to toggle music play/pause
 * @property {() => void} toggleFullScreen - Function to toggle fullscreen mode
 * @property {boolean} isFullScreen - Current state of fullscreen mode
 */
type BottomPanelControlProps = {
    onClose?: () => void;
    isPlaying: boolean;
    toggleMusic: () => void;
    toggleFullScreen: () => void;
    isFullScreen: boolean;
};

/**
 * A control panel component that provides playback controls, music toggle, and fullscreen functionality
 * Features include:
 * - Loop playback toggle
 * - Playback toggle
 * - Playback speed control
 * - Music play/pause
 * - Fullscreen toggle
 * 
 * @component
 * @param {BottomPanelControlProps} props - Component props
 * @returns {JSX.Element} Rendered bottom panel control component
 */
export const BottomPanelControl = ({
    onClose,
    isPlaying,
    toggleMusic,
    toggleFullScreen,
    isFullScreen,
}: BottomPanelControlProps) => {
    return (
        // Main container with backdrop blur and border styling
        <div className='backdrop-blur-xl border border-neutral-700 p-4 rounded-lg shadow-lg w-fit z-10'>
            {/* Header section with title and close button */}
            <div className='flex items-center justify-between'>
                <h1 className='text-base font-semibold text-light'>
                    Playback Controls
                </h1>
                <button
                    onClick={onClose}
                    className='text-gray-400 hover:text-gray-200'
                >
                    <XMarkIcon className='h-5 w-5' />
                </button>
            </div>

            {/* Controls container */}
            <div className='flex items-center justify-between mt-4 space-x-4'>
                {/* Left section: Loop and Toggle Playback controls */}
                <div className='flex space-x-4'>
                    {/* Loop Playback toggle */}
                    <div className='flex flex-col items-center'>
                        <span className='text-gray-400 text-sm mb-1'>
                            Loop Playback
                        </span>
                        <div className='relative inline-block w-10'>
                            <input
                                type='checkbox'
                                name='loopPlayback'
                                id='loopPlayback'
                                className='toggle-checkbox absolute block w-6 h-6 rounded-full bg-neutral-950 border-4 border-neutral-700 appearance-none cursor-pointer'
                            />
                            <label
                                htmlFor='loopPlayback'
                                className='toggle-label block overflow-hidden h-6 rounded-full bg-neutral-700 cursor-pointer'
                            ></label>
                        </div>
                    </div>

                    {/* Toggle Playback switch */}
                    <div className='flex flex-col items-center'>
                        <span className='text-gray-400 text-sm mb-1'>
                            Toggle Playback
                        </span>
                        <div className='relative inline-block w-10'>
                            <input
                                type='checkbox'
                                name='togglePlayback'
                                id='togglePlayback'
                                className='toggle-checkbox absolute block w-6 h-6 rounded-full bg-neutral-950 border-4 border-neutral-700 appearance-none cursor-pointer'
                            />
                            <label
                                htmlFor='togglePlayback'
                                className='toggle-label block overflow-hidden h-6 rounded-full bg-neutral-700 cursor-pointer'
                            ></label>
                        </div>
                    </div>
                </div>

                {/* Center section: Playback Speed slider */}
                <div className='flex flex-col items-center mx-4'>
                    <span className='text-gray-400 text-sm mb-2'>
                        Playback Speed
                    </span>
                    <div className='flex items-center'>
                        <span className='text-sm'>🐢</span>
                        <input
                            type='range'
                            min='0.5'
                            max='2'
                            step='0.1'
                            className='w-24 mx-4 accent-neutral-700'
                        />
                        <span className='text-sm'>🐇</span>
                    </div>
                </div>

                {/* Right section: Music and Fullscreen controls */}
                <div className='flex space-x-4'>
                    {/* Music toggle button */}
                    <div className='flex flex-col items-center'>
                        <span className='text-gray-400 mb-2 text-sm'>
                            Music
                        </span>
                        <button
                            onClick={toggleMusic}
                            className='flex items-center justify-center w-10 h-10 border-2 border-neutral-700 bg-neutral-950 rounded-lg hover:border-neutral-500 hover:bg-neutral-900'
                        >
                            {isPlaying ? (
                                <PauseIcon className='h-5 w-5 text-light' />
                            ) : (
                                <MusicalNoteIcon className='h-5 w-5 text-light' />
                            )}
                        </button>
                    </div>

                    {/* Fullscreen toggle button */}
                    <div className='flex flex-col items-center'>
                        <span className='text-gray-400 mb-2 text-sm'>
                            Fullscreen
                        </span>
                        <button
                            onClick={toggleFullScreen}
                            className='flex items-center justify-center w-10 h-10 border-2 border-neutral-700 bg-neutral-950 rounded-lg hover:border-neutral-500 hover:bg-neutral-900'
                        >
                            {isFullScreen ? (
                                <ArrowsPointingInIcon className='h-5 w-5 text-light' />
                            ) : (
                                <ArrowsPointingOutIcon className='h-5 w-5 text-light' />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};