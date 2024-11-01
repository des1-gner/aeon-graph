/**
 * Defines the possible visibility states for elements
 * - 'on': Always visible
 * - 'hover': Only visible on hover
 * - 'off': Never visible
 */
export type VisibilityType = 'on' | 'hover' | 'off';

/**
 * Base interface defining common filtering options for data elements
 */
export interface FilterOptions {
    /** The main claim or assertion being made */
    broadClaim: string;
    
    /** A more specific or detailed claim related to the broad claim */
    subClaim: string;
    
    /** The origin or reference of the information */
    source: string;
    
    /** Reference to the research organization or think tank */
    think_tank_ref: string;
    
    /** Flag indicating whether this is a duplicate entry */
    isDuplicate: string;
    
    /** The main content or body text of the article */
    articleBody: string;
}

/**
 * Interface for highlight-specific options
 * Extends FilterOptions to include all base filtering capabilities
 * Used for controlling highlight behavior in the visualization
 */
export interface HighlightOptions extends FilterOptions {}

/**
 * Interface for cluster-specific options
 * Extends FilterOptions to include all base filtering capabilities
 * Used for controlling clustering behavior in the visualization
 */
export interface ClusterOptions extends FilterOptions {}

/**
 * Interface for edge-specific options
 * Extends FilterOptions and adds visibility control
 * Used for controlling the appearance and behavior of edges/connections
 * in the visualization
 */
export interface EdgeOptions extends FilterOptions {
    /** Controls the visibility state of the edge */
    visibility: VisibilityType;
}