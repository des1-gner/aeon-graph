import { useEffect, useRef, useState } from 'react';

/**
 * Interface defining the state and controls for three color pickers:
 * highlight, cluster, and edge colors
 */
export interface ColorPickerState {
    // Visibility state for each color picker
    showHighlightColorPicker: boolean;
    showClusterColorPicker: boolean;
    showEdgeColorPicker: boolean;
    
    // Functions to control visibility of each color picker
    setShowHighlightColorPicker: (show: boolean) => void;
    setShowClusterColorPicker: (show: boolean) => void;
    setShowEdgeColorPicker: (show: boolean) => void;
    
    // Refs to track DOM elements for click-outside detection
    highlightColorPickerRef: React.RefObject<HTMLDivElement>;
    clusterColorPickerRef: React.RefObject<HTMLDivElement>;
    edgeColorPickerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Custom hook to manage the state and behavior of three color pickers.
 * Provides functionality for showing/hiding pickers and handling click-outside behavior.
 * 
 * @returns {ColorPickerState} Object containing state and controls for all color pickers
 */
export const useColorPicker = (): ColorPickerState => {
    // State for tracking visibility of each color picker
    const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
    const [showClusterColorPicker, setShowClusterColorPicker] = useState(false);
    const [showEdgeColorPicker, setShowEdgeColorPicker] = useState(false);
    
    // Refs to store references to the DOM elements of each color picker
    const highlightColorPickerRef = useRef<HTMLDivElement>(null);
    const clusterColorPickerRef = useRef<HTMLDivElement>(null);
    const edgeColorPickerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        /**
         * Handler for clicking outside of color pickers
         * Closes any open color picker when clicking outside its bounds
         * 
         * @param {MouseEvent} event - The mouse event triggered by clicking
         */
        const handleClickOutside = (event: MouseEvent) => {
            // Check if click is outside highlight color picker
            if (
                highlightColorPickerRef.current &&
                !highlightColorPickerRef.current.contains(event.target as Node)
            ) {
                setShowHighlightColorPicker(false);
            }
            
            // Check if click is outside cluster color picker
            if (
                clusterColorPickerRef.current &&
                !clusterColorPickerRef.current.contains(event.target as Node)
            ) {
                setShowClusterColorPicker(false);
            }
            
            // Check if click is outside edge color picker
            if (
                edgeColorPickerRef.current &&
                !edgeColorPickerRef.current.contains(event.target as Node)
            ) {
                setShowEdgeColorPicker(false);
            }
        };

        // Add event listener for mousedown events
        document.addEventListener('mousedown', handleClickOutside);
        
        // Cleanup function to remove event listener when component unmounts
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []); // Empty dependency array as this effect should only run once on mount

    // Return all state and controls needed for the color pickers
    return {
        showHighlightColorPicker,
        showClusterColorPicker,
        showEdgeColorPicker,
        setShowHighlightColorPicker,
        setShowClusterColorPicker,
        setShowEdgeColorPicker,
        highlightColorPickerRef,
        clusterColorPickerRef,
        edgeColorPickerRef,
    };
};