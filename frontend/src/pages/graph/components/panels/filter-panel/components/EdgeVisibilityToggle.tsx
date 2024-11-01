import React from 'react';
import { PowerIcon, CursorArrowRaysIcon, SunIcon } from '@heroicons/react/24/solid';
import { EdgeVisibilityToggleProps } from '../types/interfaces';

/**
 * EdgeVisibilityToggle Component
 * This component provides a three-state toggle for controlling edge visibility in a graph/network visualization
 * 
 * States:
 * - OFF (PowerIcon): Edges are hidden/disabled
 * - HOVER (CursorArrowRaysIcon): Edges appear on hover
 * - ON (SunIcon): Edges are always visible
 * 
 * @param {Object} props
 * @param {Object} props.state - Current state object containing mode and active status
 * @param {Function} props.onChange - Callback function to handle state changes
 */
export const EdgeVisibilityToggle: React.FC<EdgeVisibilityToggleProps> = ({
    state,
    onChange,
}) => {
    return (
        <div className='space-y-2'>
            {/* Toggle Button Container */}
            <div className='flex rounded-lg overflow-hidden border border-neutral-700'>
                {/* OFF Button */}
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${
                        state.mode === 'off'
                            ? 'bg-red-500/20 text-red-500'  // Active state styling
                            : 'bg-neutral-800/50 text-neutral-500'  // Inactive state styling
                    }`}
                    onClick={() => onChange({ isActive: false, mode: 'off' })}
                >
                    <PowerIcon className='size-4' />
                </button>

                {/* HOVER Button */}
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${
                        state.mode === 'hover'
                            ? 'bg-yellow-500/20 text-yellow-500'  // Active state styling
                            : 'bg-neutral-800/50 text-neutral-500'  // Inactive state styling
                    }`}
                    onClick={() => onChange({ isActive: true, mode: 'hover' })}
                >
                    <CursorArrowRaysIcon className='size-4' />
                </button>

                {/* ON Button */}
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${
                        state.mode === 'on'
                            ? 'bg-green-500/20 text-green-500'  // Active state styling
                            : 'bg-neutral-800/50 text-neutral-500'  // Inactive state styling
                    }`}
                    onClick={() => onChange({ isActive: true, mode: 'on' })}
                >
                    <SunIcon className='size-4' />
                </button>
            </div>

            {/* Conditional helper text - only shows when edges are enabled */}
            {state.mode !== 'off' && (
                <div className='text-sm text-neutral-400'>Add New Edge By</div>
            )}
        </div>
    );
};