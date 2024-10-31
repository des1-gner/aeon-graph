export type VisibilityType = 'on' | 'hover' | 'off';

export interface FilterOptions {
    broadClaim: string;
    subClaim: string;
    source: string;
    think_tank_ref: string;
    isDuplicate: string;
    articleBody: string;
}

export interface HighlightOptions extends FilterOptions {}
export interface ClusterOptions extends FilterOptions {}
export interface EdgeOptions extends FilterOptions {
    visibility: VisibilityType;
}
