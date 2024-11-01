import React from 'react';
import { EyeIcon } from '@heroicons/react/24/solid';
import { ResetButton } from '../ResetButton';
import { VisibilityToggle } from '../VisibilityToggle';
import { ColorPicker } from '../ColorPicker';
import { CommonDropdowns } from '../CommonDropdowns';
import { HighlightOptionsProps } from '../../types/interfaces';

/**
 * HighlightOptions Component
 * Provides a UI for configuring highlighting options in a visualization interface
 * 
 * @component
 * @param props - Component properties
 * @param props.highlightVisibility - Controls the visibility state of highlights
 * @param props.onVisibilityChange - Callback function to handle visibility toggle changes
 * @param props.options - Current highlight configuration options
 * @param props.setOptions - Function to update highlight options
 * @param props.color - Current selected highlight color
 * @param props.setColor - Function to update highlight color
 * @param props.colorPickerState - Object containing color picker related state and refs
 * @param props.onReset - Callback function to reset all options to default values
 */
export const HighlightOptions: React.FC<HighlightOptionsProps> = ({
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
        // Main container with vertical spacing between elements
        <div className='space-y-3'>
            {/* Header section with title and reset button */}
            <div className='flex items-center justify-between mb-4'>
                <h2 className='flex gap-2 items-center font-semibold text-light'>
                    <EyeIcon className='size-4' />
                    Highlight Options
                </h2>
                <ResetButton onClick={onReset} />
            </div>

            {/* Toggle for highlight visibility with label */}
            <VisibilityToggle
                label='Highlight'
                state={highlightVisibility}
                onChange={onVisibilityChange}
            />

            {/* Conditional rendering of additional options when highlights are active */}
            {highlightVisibility.isActive && (
                <>
                    {/* Color picker for highlight customization */}
                    <ColorPicker
                        color={color}
                        setColor={setColor}
                        pickerRef={colorPickerState.highlightColorPickerRef}
                        showPicker={colorPickerState.showHighlightColorPicker}
                        setShowPicker={colorPickerState.setShowHighlightColorPicker}
                        label="Highlight color"
                    />

                    {/* Common dropdown options for highlight configuration */}
                    <CommonDropdowns
                        type="highlight"
                        options={options}
                        setOptions={setOptions}
                    />
                </>
            )}
        </div>
    );
};