import React from 'react';
import { EyeIcon } from '@heroicons/react/24/solid';
import { ResetButton } from '../ResetButton';
import { EdgeVisibilityToggle } from '../EdgeVisibilityToggle';
import { ColorPicker } from '../ColorPicker';
import { CommonDropdowns } from '../CommonDropdowns';
import { EdgeOptionsProps } from '../../types/interfaces';
import type { EdgeOptions as EdgeOptionsType } from '../../types/interfaces';

/**
 * EdgeOptions Component
 * Provides a UI for configuring edge visualization options in a graph or network diagram
 * 
 * @component
 * @param props - Component properties
 * @param props.highlightVisibility - Controls the visibility state of edge highlights
 * @param props.onVisibilityChange - Callback function to handle visibility changes
 * @param props.options - Current edge options configuration
 * @param props.setOptions - Function to update edge options
 * @param props.color - Current selected edge color
 * @param props.setColor - Function to update edge color
 * @param props.colorPickerState - Object containing color picker related state and refs
 * @param props.onReset - Callback function to reset all options to default values
 */
export const EdgeOptions: React.FC<EdgeOptionsProps> = ({
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
        // Main container with vertical spacing between child elements
        <div className='space-y-3'>
            {/* Header section with title and reset button */}
            <div className='flex items-center justify-between mb-4'>
                <h2 className='flex gap-2 items-center font-semibold text-light'>
                    <EyeIcon className='size-4' />
                    Add New Edge
                </h2>
                <ResetButton onClick={onReset} />
            </div>

            {/* Toggle for edge visibility */}
            <EdgeVisibilityToggle
                state={highlightVisibility}
                onChange={onVisibilityChange}
            />

            {/* Conditional rendering of additional options when visibility is enabled */}
            {highlightVisibility.mode !== 'off' && (
                <>
                    {/* Color picker for edge customization */}
                    <ColorPicker
                        color={color}
                        setColor={setColor}
                        pickerRef={colorPickerState.edgeColorPickerRef}
                        showPicker={colorPickerState.showEdgeColorPicker}
                        setShowPicker={colorPickerState.setShowEdgeColorPicker}
                        label="Edge color"
                    />

                    {/* Common dropdown options for edge configuration */}
                    <CommonDropdowns<EdgeOptionsType>
                        type="edge"
                        options={options}
                        setOptions={setOptions}
                    />
                </>
            )}
        </div>
    );
};