import React from 'react';
import { EyeIcon } from '@heroicons/react/24/solid';
import { ResetButton } from '../ResetButton';
import { VisibilityToggle } from '../VisibilityToggle';
import { ColorPicker } from '../ColorPicker';
import { CommonDropdowns } from '../CommonDropdowns';
import { ClusterOptionsProps } from '../../types/interfaces';

/**
 * ClusterOptions Component
 * Provides a UI for controlling cluster visualization settings including visibility,
 * color selection, and other customization options.
 * 
 * @param {object} props
 * @param {object} props.highlightVisibility - Controls cluster visibility state
 * @param {function} props.onVisibilityChange - Handler for visibility toggle
 * @param {object} props.options - Current cluster configuration options
 * @param {function} props.setOptions - Updates cluster options
 * @param {string} props.color - Current cluster color value
 * @param {function} props.setColor - Updates cluster color
 * @param {object} props.colorPickerState - State management for color picker UI
 * @param {function} props.onReset - Resets all options to defaults
 */
export const ClusterOptions: React.FC<ClusterOptionsProps> = ({
    highlightVisibility,
    onVisibilityChange,
    options,
    setOptions,
    color,
    setColor,
    colorPickerState,
    onReset,
}) => {
    return (
        // Main container with vertical spacing
        <div className='space-y-3'>
            {/* Header section with title and reset control */}
            <div className='flex items-center justify-between mb-4'>
                <h2 className='flex gap-2 items-center font-semibold text-light'>
                    <EyeIcon className='size-4' />
                    Cluster Options
                </h2>
                {/* Reset button to restore default settings */}
                <ResetButton onClick={onReset} />
            </div>

            {/* Main visibility toggle for cluster display */}
            <VisibilityToggle
                label='Cluster'
                state={highlightVisibility}
                onChange={onVisibilityChange}
            />

            {/* Additional options shown only when cluster is visible */}
            {highlightVisibility.isActive && (
                <>
                    {/* Color selection interface */}
                    <ColorPicker
                        color={color}
                        setColor={setColor}
                        pickerRef={colorPickerState.clusterColorPickerRef}
                        showPicker={colorPickerState.showClusterColorPicker}
                        setShowPicker={colorPickerState.setShowClusterColorPicker}
                        label="Cluster color"
                    />
                    
                    {/* Additional cluster configuration options */}
                    <CommonDropdowns
                        type="cluster"
                        options={options}
                        setOptions={setOptions}
                    />
                </>
            )}
        </div>
    );
};