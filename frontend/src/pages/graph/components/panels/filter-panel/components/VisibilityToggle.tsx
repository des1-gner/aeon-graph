import React from 'react';
import { PowerIcon, SunIcon } from '@heroicons/react/24/solid';
import { VisibilityToggleProps } from '../types/interfaces';

export const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
    label,
    state,
    onChange,
}) => {
    return (
        <div className='space-y-2'>
            <div className='flex rounded-lg overflow-hidden border border-neutral-700'>
                <button
                    className={`flex items-center justify-center p-2 w-1/2 ${
                        !state.isActive
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-neutral-800/50 text-neutral-500'
                    }`}
                    onClick={() => onChange({ isActive: false })}
                >
                    <PowerIcon className='size-4' />
                </button>
                <button
                    className={`flex items-center justify-center p-2 w-1/2 ${
                        state.isActive
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-neutral-800/50 text-neutral-500'
                    }`}
                    onClick={() => onChange({ isActive: true })}
                >
                    <SunIcon className='size-4' />
                </button>
            </div>
            {state.isActive && (
                <div className='text-sm text-neutral-400'>{label} By</div>
            )}
        </div>
    );
};