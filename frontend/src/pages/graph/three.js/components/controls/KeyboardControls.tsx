import React, { useEffect, useCallback, createContext, useContext, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_CONTROL_CONSTANTS } from '../../utils/constants';

// Destructure constants for camera control settings
const { KEY_CODES, MOVEMENT_SPEED, ROTATION_SPEED, ZOOM_SPEED } = CAMERA_CONTROL_CONSTANTS;

/**
 * Interface defining the shape of the keyboard controls context.
 * Contains state and setters for enabling/disabling controls and adjusting speeds.
 */
interface KeyboardControlsContextType {
  /** Flag to enable/disable keyboard controls */
  isEnabled: boolean;
  /** Function to toggle keyboard controls on/off */
  setIsEnabled: (enabled: boolean) => void;
  /** Current movement speed of the camera */
  movementSpeed: number;
  /** State setter for movement speed */
  setMovementSpeed: React.Dispatch<React.SetStateAction<number>>;
  /** Current rotation speed of the camera */
  rotationSpeed: number;
  /** State setter for rotation speed */
  setRotationSpeed: React.Dispatch<React.SetStateAction<number>>;
  /** Current zoom speed of the camera */
  zoomSpeed: number;
  /** State setter for zoom speed */
  setZoomSpeed: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Context for managing keyboard control settings across the application.
 * Initially undefined, will be populated by the provider.
 */
const KeyboardControlsContext = createContext<KeyboardControlsContextType | undefined>(undefined);

/**
 * Provider component that manages the state for keyboard controls.
 * Wraps child components with the KeyboardControlsContext.
 * 
 * @param children - Child components that will have access to the keyboard controls context
 */
export const KeyboardControlsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for enabling/disabling keyboard controls
  const [isEnabled, setIsEnabled] = useState(true);
  
  // States for different speed settings, initialized with constants
  // Explicitly type these as number to avoid literal type inference
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

/**
 * Custom hook to access the keyboard controls context.
 * Must be used within a KeyboardControlsProvider component.
 * 
 * @throws {Error} If used outside of a KeyboardControlsProvider
 * @returns {KeyboardControlsContextType} The keyboard controls context value
 */
export const useKeyboardControlsContext = () => {
  const context = useContext(KeyboardControlsContext);
  if (context === undefined) {
    throw new Error('useKeyboardControlsContext must be used within a KeyboardControlsProvider');
  }
  return context;
};