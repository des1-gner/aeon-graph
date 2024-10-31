import React from 'react';
import { MultiSelect } from './MultiSelect';
import { FilterOption } from './FilterOption';
import { CommonOptions, CommonDropdownsProps } from '../types/interfaces';
import { 
    broadClaims,
    subClaims,
    sources,
    murdochMedia 
} from '../constants/default';

export function CommonDropdowns<T extends CommonOptions>({ 
    type,
    options,
    setOptions 
}: CommonDropdownsProps<T>) {
    const handleOptionChange = (field: keyof CommonOptions, value: string) => {
        setOptions((prev: T) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleMultiSelectChange = (field: keyof CommonOptions, values: string[]) => {
        setOptions((prev: T) => ({
            ...prev,
            [field]: values.length > 0 ? values.join(',') : '',  // Return empty string if no values
        }));
    };

    return (
        <div className='space-y-3'>
            <FilterOption label='Text Word in Article:'>
                <input
                    type='text'
                    value={options.articleBody}
                    placeholder='Enter text to filter...'
                    className='dark-text-field w-full'
                    onChange={(e) => handleOptionChange('articleBody', e.target.value)}
                />
            </FilterOption>

            <FilterOption label='Article Contains the Broad Claim/s:'>
                <MultiSelect
                    options={Object.entries(broadClaims).map(([key, value]) => ({
                        value: key,
                        label: value,
                    }))}
                    value={options.broadClaim ? options.broadClaim.split(',').filter(Boolean) : []}
                    onChange={(value: string[]) => handleMultiSelectChange('broadClaim', value)}
                    placeholder='Select broad claims...'
                    groups={{
                        'Any Claims': Object.keys(broadClaims)
                    }}
                />
            </FilterOption>

            <FilterOption label='Article Contains the Sub Claim/s:'>
                <MultiSelect
                    options={Object.entries(subClaims).map(([key, value]) => ({
                        value: key,
                        label: value,
                    }))}
                    value={options.subClaim ? options.subClaim.split(',').filter(Boolean) : []}
                    onChange={(value: string[]) => handleMultiSelectChange('subClaim', value)}
                    placeholder='Select sub-claims...'
                    groups={{
                        'Any SubClaims': Object.keys(subClaims)
                    }}
                />
            </FilterOption>

            <FilterOption label='Article is from Source/s:'>
                <MultiSelect
                    options={sources.map((source) => ({
                        value: source,
                        label: source,
                    }))}
                    value={options.source ? options.source.split(',').filter(Boolean) : []}
                    onChange={(value: string[]) => handleMultiSelectChange('source', value)}
                    placeholder='Select sources...'
                    groups={{
                        'All Murdoch Owned Media': Array.from(murdochMedia)
                    }}
                />
            </FilterOption>

            <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                    <input
                        type='checkbox'
                        id={`${type}-think-tank`}
                        checked={options.think_tank_ref === 'yes'}
                        onChange={(e) =>
                            handleOptionChange('think_tank_ref', e.target.checked ? 'yes' : 'no')
                        }
                        className='rounded border-neutral-500'
                    />
                    <label
                        htmlFor={`${type}-think-tank`}
                        className='text-sm text-neutral-400'
                    >
                        Contains Think Tank Reference
                    </label>
                </div>
                <div className='flex items-center gap-2'>
                    <input
                        type='checkbox'
                        id={`${type}-duplicate`}
                        checked={options.isDuplicate === 'yes'}
                        onChange={(e) =>
                            handleOptionChange('isDuplicate', e.target.checked ? 'yes' : 'no')
                        }
                        className='rounded border-neutral-500'
                    />
                    <label
                        htmlFor={`${type}-duplicate`}
                        className='text-sm text-neutral-400'
                    >
                        Article is published on more than one source
                    </label>
                </div>
            </div>
        </div>
    );
}