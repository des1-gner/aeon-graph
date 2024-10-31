import React from 'react';
import { EyeIcon } from '@heroicons/react/24/solid';
import { ResetButton } from '../ResetButton';
import { VisibilityToggle } from '../VisibilityToggle';
import { ColorPicker } from '../ColorPicker';
import { CommonDropdowns } from '../CommonDropdowns';
import { ClusterOptionsProps } from '../../types/interfaces';

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
        <div className='space-y-3'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className='flex gap-2 items-center font-semibold text-light'>
                    <EyeIcon className='size-4' />
                    Cluster Options
                </h2>
                <ResetButton onClick={onReset} />
            </div>

            <VisibilityToggle
                label='Cluster'
                state={highlightVisibility}
                onChange={onVisibilityChange}
            />

            {highlightVisibility.isActive && (
                <>
                    <ColorPicker
                        color={color}
                        setColor={setColor}
                        pickerRef={colorPickerState.clusterColorPickerRef}
                        showPicker={colorPickerState.showClusterColorPicker}
                        setShowPicker={colorPickerState.setShowClusterColorPicker}
                        label="Cluster color"
                    />
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