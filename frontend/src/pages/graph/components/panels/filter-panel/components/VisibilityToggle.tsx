import React from 'react';
import { PowerIcon, SunIcon } from '@heroicons/react/24/solid';
import { VisibilityToggleProps } from '../types/interfaces';

// VisibilityToggle Component: A toggle switch component that shows active/inactive states
// Props:
// - label: Text label to display when toggle is active
// - state: Object containing isActive boolean
// - onChange: Callback function to handle state changes
export const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
    label,
    state,
    onChange,
}) => {
    return (
        // Main container with vertical spacing
        <div className='space-y-2'>
            {/* Toggle button container with rounded corners and border */}
            <div className='flex rounded-lg overflow-hidden border border-neutral-700'>
                {/* Inactive/Power Off button */}
                <button
                    className={`flex items-center justify-center p-2 w-1/2 ${
                        // Conditional styling: red background when inactive, neutral when active
                        !state.isActive
                            ? 'bg-red-500/20 text-red-500'  // 20% opacity red background
                            : 'bg-neutral-800/50 text-neutral-500'  // 50% opacity neutral background
                    }`}
                    onClick={() => onChange({ isActive: false })}
                >
                    <PowerIcon className='size-4' />
                </button>

                {/* Active/Sun button */}
                <button
                    className={`flex items-center justify-center p-2 w-1/2 ${
                        // Conditional styling: green background when active, neutral when inactive
                        state.isActive
                            ? 'bg-green-500/20 text-green-500'  // 20% opacity green background
                            : 'bg-neutral-800/50 text-neutral-500'  // 50% opacity neutral background
                    }`}
                    onClick={() => onChange({ isActive: true })}
                >
                    <SunIcon className='size-4' />
                </button>
            </div>

            {/* Conditional label rendering - only shows when toggle is active */}
            {state.isActive && (
                <div className='text-sm text-neutral-400'>{label} By</div>
            )}
        </div>
    );
};