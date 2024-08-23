import {
    ArrowsPointingInIcon,
    ArrowsPointingOutIcon,
    MusicalNoteIcon,
    PauseIcon,
    XMarkIcon, // Import the XMarkIcon for the close button
} from '@heroicons/react/24/solid';

interface BottomPanelControlProps {
    onClose?: () => void;
    isPlaying: boolean;
    toggleMusic: () => void;
    toggleFullScreen: () => void;
    isFullScreen: boolean;
}

const BottomPanelControl = ({
    onClose,
    isPlaying,
    toggleMusic,
    toggleFullScreen,
    isFullScreen,
}: BottomPanelControlProps) => {
    return (
        <div className='bg-neutral-950 border border-neutral-700 p-4 rounded-lg shadow-lg w-fit z-10'>
            <div className='flex items-center justify-between'>
                <h1 className='text-base font-semibold text-light'>
                    Playback Controls
                </h1>
                <button
                    onClick={onClose}
                    className='text-gray-400 hover:text-gray-200'
                >
                    <XMarkIcon className='h-5 w-5' /> {/* Close button icon */}
                </button>
            </div>

            <div className='flex items-center justify-between mt-4 space-x-4'>
                {/* Left: Loop Playback and Toggle Playback */}
                <div className='flex space-x-4'>
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

                {/* Center: Playback Speed Slider */}
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

                {/* Right: Music and Fullscreen Buttons */}
                <div className='flex space-x-4'>
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

export default BottomPanelControl;
