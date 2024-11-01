// Import React library for creating React components
import React from 'react';

// Import the FilterOptionProps interface from types directory
import { FilterOptionProps } from '../types/interfaces';

/**
 * FilterOption Component
 * 
 * A reusable filter option wrapper component that provides consistent styling
 * and layout for filter controls in forms or search interfaces.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.label - Label text to display above the filter control
 * @param {React.ReactNode} props.children - Child components to render (typically form controls)
 * @returns {JSX.Element} Rendered FilterOption component
 *
 * @example
 * <FilterOption label="Category">
 *   <select>...</select>
 * </FilterOption>
 */
export const FilterOption: React.FC<FilterOptionProps> = ({ label, children }) => (
    <div className='space-y-1'>
        <label className='text-sm text-neutral-400'>{label}</label>
        {children}
    </div>
);