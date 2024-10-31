import React from 'react';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
    color: string;
    setColor: (color: string) => void;
    pickerRef: React.RefObject<HTMLDivElement>;
    showPicker: boolean;
    setShowPicker: (show: boolean) => void;
    label: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
    color,
    setColor,
    pickerRef,
    showPicker,
    setShowPicker,
    label,
}) => {
    return (
        <div className='flex items-center gap-2 mb-4'>
            <div className='relative' ref={pickerRef}>
                <button
                    className='w-8 h-8 rounded-full border border-neutral-500'
                    style={{ backgroundColor: color }}
                    onClick={() => setShowPicker(!showPicker)}
                />
                {showPicker && (
                    <div className='absolute left-0 mt-2 z-10'>
                        <HexColorPicker color={color} onChange={setColor} />
                    </div>
                )}
            </div>
            <span className='text-light'>{label}</span>
        </div>
    );
};