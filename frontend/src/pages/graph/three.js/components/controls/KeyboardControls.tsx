import React, { useEffect, useCallback, createContext, useContext, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_CONTROL_CONSTANTS } from '../../utils/constants';

const {
    KEY_CODES,
    MOVEMENT_SPEED,
    ROTATION_SPEED,
    ZOOM_SPEED
} = CAMERA_CONTROL_CONSTANTS;

interface KeyboardControlsContextType {
    isEnabled: boolean;
    setIsEnabled: (enabled: boolean) => void;
    movementSpeed: number;
    setMovementSpeed: React.Dispatch<React.SetStateAction<number>>;
    rotationSpeed: number;
    setRotationSpeed: React.Dispatch<React.SetStateAction<number>>;
    zoomSpeed: number;
    setZoomSpeed: React.Dispatch<React.SetStateAction<number>>;
}

const KeyboardControlsContext = createContext<KeyboardControlsContextType | undefined>(undefined);

export const KeyboardControlsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [movementSpeed, setMovementSpeed] = useState<number>(MOVEMENT_SPEED);
    const [rotationSpeed, setRotationSpeed] = useState<number>(ROTATION_SPEED);
    const [zoomSpeed, setZoomSpeed] = useState<number>(ZOOM_SPEED);

    return (
        <KeyboardControlsContext.Provider
            value={{
                isEnabled,
                setIsEnabled,
                movementSpeed,
                setMovementSpeed,
                rotationSpeed,
                setRotationSpeed,
                zoomSpeed,
                setZoomSpeed,
            }}
        >
            {children}
        </KeyboardControlsContext.Provider>
    );
};


export const useKeyboardControlsContext = () => {
    const context = useContext(KeyboardControlsContext);
    if (context === undefined) {
        throw new Error('useKeyboardControlsContext must be used within a KeyboardControlsProvider');
    }
    return context;
};