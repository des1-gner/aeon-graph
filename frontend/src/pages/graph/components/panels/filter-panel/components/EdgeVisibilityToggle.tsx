import React from 'react';
import { PowerIcon, CursorArrowRaysIcon, SunIcon } from '@heroicons/react/24/solid';
import { EdgeVisibilityToggleProps } from '../types/interfaces';

export const EdgeVisibilityToggle: React.FC<EdgeVisibilityToggleProps> = ({
    state,
    onChange,
}) => {
    return (
        <div className='space-y-2'>
            <div className='flex rounded-lg overflow-hidden border border-neutral-700'>
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${
                        state.mode === 'off'
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-neutral-800/50 text-neutral-500'
                    }`}
                    onClick={() => onChange({ isActive: false, mode: 'off' })}
                >
                    <PowerIcon className='size-4' />
                </button>
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${
                        state.mode === 'hover'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-neutral-800/50 text-neutral-500'
                    }`}
                    onClick={() => onChange({ isActive: true, mode: 'hover' })}
                >
                    <CursorArrowRaysIcon className='size-4' />
                </button>
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${
                        state.mode === 'on'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-neutral-800/50 text-neutral-500'
                    }`}
                    onClick={() => onChange({ isActive: true, mode: 'on' })}
                >
                    <SunIcon className='size-4' />
                </button>
            </div>
            {state.mode !== 'off' && (
                <div className='text-sm text-neutral-400'>Add New Edge By</div>
            )}
        </div>
    );
};