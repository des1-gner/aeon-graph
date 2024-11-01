/**
 * Represents the state of common keyboard controls for games/applications
 * Each property is a boolean indicating whether the corresponding key is currently pressed
 */
export interface KeyboardControlsState {
    // Directional arrow keys
    ArrowUp: boolean;    // Up arrow key state
    ArrowDown: boolean;  // Down arrow key state
    ArrowLeft: boolean;  // Left arrow key state
    ArrowRight: boolean; // Right arrow key state
    
    // WASD keys (common alternative movement controls)
    KeyW: boolean;       // W key state (alternative to ArrowUp)
    KeyS: boolean;       // S key state (alternative to ArrowDown)
    KeyA: boolean;       // A key state (alternative to ArrowLeft)
    KeyD: boolean;       // D key state (alternative to ArrowRight)
  }