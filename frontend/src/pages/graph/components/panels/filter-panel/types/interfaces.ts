import { Dispatch, SetStateAction } from 'react';
import { ColorPickerState } from '../hooks/useColorPicker';

// Defines the possible visibility states for UI elements
export type VisibilityType = 'on' | 'off' | 'hover';

/**
 * Base interface containing common options shared across different visualization types
 */
export interface CommonOptions {
    articleBody: string;      // The main content of the article
    broadClaim: string;       // The primary claim being analyzed
    subClaim: string;        // A supporting or sub-claim
    source: string;          // Source of the article/claim
    think_tank_ref: string;  // Reference to associated think tank
    isDuplicate: string;     // Flag indicating if this is a duplicate entry
}

/**
 * Extends CommonOptions with visibility control for edge-specific options
 */
export interface EdgeOptions extends CommonOptions {
    visibility: VisibilityType;  // Controls how the edge is displayed
}

/**
 * Represents the current visibility state of a UI element
 */
export interface VisibilityState {
    isActive: boolean;     // Whether the element is currently visible
    mode?: VisibilityType; // The type of visibility behavior
}

/**
 * Defines the structure for multi-select dropdown options
 */
export interface MultiSelectOption {
    value: string;  // The internal value used by the component
    label: string;  // The displayed text in the UI
}

/**
 * Defines groupings for multi-select options
 */
export interface MultiSelectGroups {
    [key: string]: ReadonlyArray<string>;  // Maps group names to arrays of option values
}

/**
 * Props for the MultiSelect component
 */
export interface MultiSelectProps {
    options: MultiSelectOption[];              // Available options to select from
    value: string[];                          // Currently selected values
    onChange: (value: string[]) => void;      // Handler for selection changes
    placeholder: string;                      // Placeholder text when nothing is selected
    groups?: MultiSelectGroups;               // Optional grouping configuration
}

/**
 * Props for the FilterOption component
 */
export interface FilterOptionProps {
    label: string;                 // Label text for the filter
    children: React.ReactNode;     // Child components within the filter
}

/**
 * Props for the VisibilityToggle component
 */
export interface VisibilityToggleProps {
    label: string;                                    // Label for the toggle
    state: VisibilityState;                          // Current visibility state
    onChange: (newState: VisibilityState) => void;   // Handler for state changes
}

/**
 * Props for the EdgeVisibilityToggle component
 */
export interface EdgeVisibilityToggleProps {
    state: VisibilityState;                          // Current visibility state
    onChange: (newState: VisibilityState) => void;   // Handler for state changes
}

/**
 * Base props shared across all visualization components
 */
interface BaseVisualisationProps {
    color: string;                             // Current color selection
    setColor: (color: string) => void;         // Color update handler
    colorPickerState: ColorPickerState;        // State of the color picker
    onReset: () => void;                       // Handler for resetting to defaults
    highlightVisibility: VisibilityState;      // Visibility state for highlights
    onVisibilityChange: (newState: VisibilityState) => void;  // Visibility change handler
}

/**
 * Props for the HighlightOptions component
 */
export interface HighlightOptionsProps extends BaseVisualisationProps {
    options: CommonOptions;                            // Current highlight options
    setOptions: Dispatch<SetStateAction<CommonOptions>>;  // Options update handler
}

/**
 * Props for the ClusterOptions component
 */
export interface ClusterOptionsProps extends BaseVisualisationProps {
    options: CommonOptions;                            // Current cluster options
    setOptions: Dispatch<SetStateAction<CommonOptions>>;  // Options update handler
}

/**
 * Props for the EdgeOptions component
 */
export interface EdgeOptionsProps extends BaseVisualisationProps {
    options: EdgeOptions;                              // Current edge options
    setOptions: Dispatch<SetStateAction<EdgeOptions>>; // Options update handler
}

/**
 * Props for common dropdown components with generic type support
 */
export interface CommonDropdownsProps<T extends CommonOptions = CommonOptions> {
    type: 'highlight' | 'cluster' | 'edge';    // Type of visualization
    options: T;                                // Current options
    setOptions: Dispatch<SetStateAction<T>>;   // Options update handler
}