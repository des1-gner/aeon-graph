import { Dispatch, SetStateAction } from 'react';
import { ColorPickerState } from '../hooks/useColorPicker';

export type VisibilityType = 'on' | 'off' | 'hover';

export interface CommonOptions {
    articleBody: string;
    broadClaim: string;
    subClaim: string;
    source: string;
    think_tank_ref: string;
    isDuplicate: string;
}

export interface EdgeOptions extends CommonOptions {
    visibility: VisibilityType;
}

export interface VisibilityState {
    isActive: boolean;
    mode?: VisibilityType;
}

export interface MultiSelectOption {
    value: string;
    label: string;
}

export interface MultiSelectGroups {
    [key: string]: ReadonlyArray<string>;
}

export interface MultiSelectProps {
    options: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder: string;
    groups?: MultiSelectGroups;
}

export interface FilterOptionProps {
    label: string;
    children: React.ReactNode;
}

export interface VisibilityToggleProps {
    label: string;
    state: VisibilityState;
    onChange: (newState: VisibilityState) => void;
}

export interface EdgeVisibilityToggleProps {
    state: VisibilityState;
    onChange: (newState: VisibilityState) => void;
}

// Base props for all visualisation components
interface BaseVisualisationProps {
    color: string;
    setColor: (color: string) => void;
    colorPickerState: ColorPickerState;
    onReset: () => void;
    highlightVisibility: VisibilityState;
    onVisibilityChange: (newState: VisibilityState) => void;
}

export interface HighlightOptionsProps extends BaseVisualisationProps {
    options: CommonOptions;
    setOptions: Dispatch<SetStateAction<CommonOptions>>;
}

export interface ClusterOptionsProps extends BaseVisualisationProps {
    options: CommonOptions;
    setOptions: Dispatch<SetStateAction<CommonOptions>>;
}

export interface EdgeOptionsProps extends BaseVisualisationProps {
    options: EdgeOptions;
    setOptions: Dispatch<SetStateAction<EdgeOptions>>;
}

export interface EdgeOptions extends CommonOptions {
    visibility: VisibilityType;
}

export interface VisibilityState {
    isActive: boolean;
    mode?: VisibilityType;
}

export interface CommonDropdownsProps<T extends CommonOptions = CommonOptions> {
    type: 'highlight' | 'cluster' | 'edge';
    options: T;
    setOptions: Dispatch<SetStateAction<T>>;
}