import { useEffect, useRef, useState } from 'react';

export interface ColorPickerState {
    showHighlightColorPicker: boolean;
    showClusterColorPicker: boolean;
    showEdgeColorPicker: boolean;
    setShowHighlightColorPicker: (show: boolean) => void;
    setShowClusterColorPicker: (show: boolean) => void;
    setShowEdgeColorPicker: (show: boolean) => void;
    highlightColorPickerRef: React.RefObject<HTMLDivElement>;
    clusterColorPickerRef: React.RefObject<HTMLDivElement>;
    edgeColorPickerRef: React.RefObject<HTMLDivElement>;
}

export const useColorPicker = (): ColorPickerState => {
    const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
    const [showClusterColorPicker, setShowClusterColorPicker] = useState(false);
    const [showEdgeColorPicker, setShowEdgeColorPicker] = useState(false);

    const highlightColorPickerRef = useRef<HTMLDivElement>(null);
    const clusterColorPickerRef = useRef<HTMLDivElement>(null);
    const edgeColorPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                highlightColorPickerRef.current &&
                !highlightColorPickerRef.current.contains(event.target as Node)
            ) {
                setShowHighlightColorPicker(false);
            }
            if (
                clusterColorPickerRef.current &&
                !clusterColorPickerRef.current.contains(event.target as Node)
            ) {
                setShowClusterColorPicker(false);
            }
            if (
                edgeColorPickerRef.current &&
                !edgeColorPickerRef.current.contains(event.target as Node)
            ) {
                setShowEdgeColorPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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