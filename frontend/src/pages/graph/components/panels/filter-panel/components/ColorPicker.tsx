import React from 'react';
import { HexColorPicker } from 'react-colorful';

/**
 * Props interface for the ColorPicker component
 * @interface ColorPickerProps
 * @property {string} color - The current color value in hex format
 * @property {function} setColor - Callback function to update the color value
 * @property {React.RefObject<HTMLDivElement>} pickerRef - Reference to the picker container for handling outside clicks
 * @property {boolean} showPicker - Controls the visibility of the color picker popup
 * @property {function} setShowPicker - Callback function to toggle the picker visibility
 * @property {string} label - Label text to display next to the color swatch
 */
interface ColorPickerProps {
    color: string;
    setColor: (color: string) => void;
    pickerRef: React.RefObject<HTMLDivElement>;
    showPicker: boolean;
    setShowPicker: (show: boolean) => void;
    label: string;
}

/**
 * A color picker component that displays a color swatch button and a popup color picker
 * when clicked. Uses react-colorful for the color picker implementation.
 * 
 * @component
 * @param {ColorPickerProps} props - The component props
 * @returns {JSX.Element} The rendered ColorPicker component
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
    color,
    setColor,
    pickerRef,
    showPicker,
    setShowPicker,
    label,
}) => {
    return (
        // Container for the entire color picker component
        <div className='flex items-center gap-2 mb-4'>
            {/* Wrapper for the color swatch button and popup picker */}
            <div className='relative' ref={pickerRef}>
                {/* Color swatch button that toggles the picker visibility */}
                <button
                    className='w-8 h-8 rounded-full border border-neutral-500'
                    style={{ backgroundColor: color }}
                    onClick={() => setShowPicker(!showPicker)}
                />
                {/* Conditional render of the color picker popup */}
                {showPicker && (
                    <div className='absolute left-0 mt-2 z-10'>
                        <HexColorPicker color={color} onChange={setColor} />
                    </div>
                )}
            </div>
            {/* Label text displayed next to the color swatch */}
            <span className='text-light'>{label}</span>
        </div>
    );
};