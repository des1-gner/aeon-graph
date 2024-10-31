// src/pages/graph/three.js/utils/colors.ts
export const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : null;
};

export const blendColors = (color1: string, color2: string, ratio: number = 0.5) => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    if (!c1 || !c2) return color1;

    const r = Math.round((c1.r * (1 - ratio) + c2.r * ratio) * 255);
    const g = Math.round((c1.g * (1 - ratio) + c2.g * ratio) * 255);
    const b = Math.round((c1.b * (1 - ratio) + c2.b * ratio) * 255);

    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
};