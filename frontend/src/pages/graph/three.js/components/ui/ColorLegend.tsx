// Import necessary dependencies from React
import React from 'react';
// Import UI constants and color utility function
import { UI_CONSTANTS } from '../../utils/constants';
import { blendColors } from '../../utils/colors';

// Define the props interface for the ColorLegend component
interface ColorLegendProps {
    highlightColor: string;    // Color used for highlighted elements
    clusterColor: string;      // Color used for clustered elements
    edgeColor: string;         // Color used for edges/connections
}

// KeyIcon component - renders an SVG key icon
// Used as a visual indicator for the legend section
const KeyIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        className="size-4 text-neutral-400"    // Sets icon size and color
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" 
        />
    </svg>
);

// ColorBox component - renders a colored square with a label
// Reusable component for each color entry in the legend
const ColorBox = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-2">
        {/* Colored square indicator */}
        <div 
            className="w-3 h-3 rounded"
            style={{ backgroundColor: color }}
        />
        {/* Label text */}
        <span className="text-sm text-neutral-400">{label}</span>
    </div>
);

// Main ColorLegend component
// Displays a floating legend showing different colors used in the graph
export const ColorLegend: React.FC<ColorLegendProps> = ({
    highlightColor,
    clusterColor,
    edgeColor
}) => {
    // Calculate the blended color for elements that are both highlighted and clustered
    const blendedColor = blendColors(highlightColor, clusterColor);

    return (
        // Container positioned at the bottom center of the viewport
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
            {/* Legend box with dark semi-transparent background and blur effect */}
            <div className="bg-neutral-900/90 backdrop-blur-sm border border-neutral-800 rounded-lg">
                <div className="p-3">
                    <div className="flex items-center gap-6">
                        {/* Legend header with key icon */}
                        <div className="flex items-center gap-2">
                            <KeyIcon />
                            <span className="text-sm font-medium text-neutral-400">Legend</span>
                        </div>
                        {/* Vertical divider */}
                        <div className="h-5 w-px bg-neutral-800" />
                        {/* Color boxes container */}
                        <div className="flex items-center gap-6">
                            {/* Individual color entries */}
                            <ColorBox color={highlightColor} label="Highlight" />
                            <ColorBox color={clusterColor} label="Cluster" />
                            <ColorBox color={blendedColor} label="Highlight + Cluster" />
                            <ColorBox color={edgeColor} label="Edge" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};