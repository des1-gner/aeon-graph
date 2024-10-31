import React from 'react';
import { FilterOptionProps } from '../types/interfaces';

export const FilterOption: React.FC<FilterOptionProps> = ({ label, children }) => (
    <div className='space-y-1'>
        <label className='text-sm text-neutral-400'>{label}</label>
        {children}
    </div>
);