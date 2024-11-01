/**
 * Color utility functions for converting and blending hex colors.
 */

/**
 * Converts a hexadecimal color string to RGB values normalized between 0 and 1.
 * @param hex - The hexadecimal color string (e.g., "#ff0000" or "ff0000")
 * @returns An object containing normalized RGB values, or null if invalid hex
 * 
 * @example
 * hexToRgb("#ff0000") // Returns { r: 1, g: 0, b: 0 }
 * hexToRgb("#00ff00") // Returns { r: 0, g: 1, b: 0 }
 */
export const hexToRgb = (hex: string) => {
    // Use regex to match and extract the red, green, and blue components
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
    return result ? {
        // Convert each pair of hex digits to decimal and normalize to 0-1 range
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : null;
};

/**
 * Blends two colors together using linear interpolation.
 * @param color1 - First hex color string
 * @param color2 - Second hex color string
 * @param ratio - Blend ratio between 0 and 1 (default: 0.5)
 *               0 = 100% color1, 1 = 100% color2
 * @returns Resulting hex color string
 * 
 * @example
 * blendColors("#ff0000", "#0000ff", 0.5) // Returns a purple color
 * blendColors("#ff0000", "#0000ff", 0.7) // Returns a more blue-leaning purple
 */
export const blendColors = (color1: string, color2: string, ratio: number = 0.5) => {
    // Convert both hex colors to RGB
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    // Return first color if conversion failed
    if (!c1 || !c2) return color1;
    
    // Linear interpolation between the RGB values
    const r = Math.round((c1.r * (1 - ratio) + c2.r * ratio) * 255);
    const g = Math.round((c1.g * (1 - ratio) + c2.g * ratio) * 255);
    const b = Math.round((c1.b * (1 - ratio) + c2.b * ratio) * 255);
    
    // Convert back to hex using bit operations and string manipulation
    // 1 << 24 adds leading zeros, slice(1) removes the first character
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
};