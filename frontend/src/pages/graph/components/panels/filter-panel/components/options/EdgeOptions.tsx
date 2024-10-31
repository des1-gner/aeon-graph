import React from 'react';
import { EyeIcon } from '@heroicons/react/24/solid';
import { ResetButton } from '../ResetButton';
import { EdgeVisibilityToggle } from '../EdgeVisibilityToggle';
import { ColorPicker } from '../ColorPicker';
import { CommonDropdowns } from '../CommonDropdowns';
import { EdgeOptionsProps } from '../../types/interfaces';
import type { EdgeOptions as EdgeOptionsType } from '../../types/interfaces';

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
        <div className='space-y-3'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='flex gap-2 items-center font-semibold text-light'>
                    <EyeIcon className='size-4' />
                    Add New Edge
                </h2>
                <ResetButton onClick={onReset} />
            </div>

            <EdgeVisibilityToggle
                state={highlightVisibility}
                onChange={onVisibilityChange}
            />

            {highlightVisibility.mode !== 'off' && (
                <>
                    <ColorPicker
                        color={color}
                        setColor={setColor}
                        pickerRef={colorPickerState.edgeColorPickerRef}
                        showPicker={colorPickerState.showEdgeColorPicker}
                        setShowPicker={colorPickerState.setShowEdgeColorPicker}
                        label="Edge color"
                    />
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