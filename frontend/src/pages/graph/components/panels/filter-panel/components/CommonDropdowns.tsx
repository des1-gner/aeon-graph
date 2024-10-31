import React, { useState } from 'react';
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
    // Track visual selection state separately from actual values
    const [thinkTankVisualSelection, setThinkTankVisualSelection] = useState<string[]>([]);
    const [duplicateVisualSelection, setDuplicateVisualSelection] = useState<string[]>([]);

    const handleOptionChange = (field: keyof CommonOptions, value: string) => {
        setOptions((prev: T) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleMultiSelectChange = (field: keyof CommonOptions, values: string[]) => {
        setOptions((prev: T) => ({
            ...prev,
            [field]: values.length > 0 ? values.join(',') : '',
        }));
    };

    const handleThinkTankChange = (values: string[]) => {
        setThinkTankVisualSelection(values);
        // If both or none are selected, set empty string
        if (values.length !== 1) {
            setOptions((prev: T) => ({
                ...prev,
                think_tank_ref: '',
            }));
        } else {
            setOptions((prev: T) => ({
                ...prev,
                think_tank_ref: values[0],
            }));
        }
    };

    const handleDuplicateChange = (values: string[]) => {
        setDuplicateVisualSelection(values);
        // If both or none are selected, set empty string
        if (values.length !== 1) {
            setOptions((prev: T) => ({
                ...prev,
                isDuplicate: '',
            }));
        } else {
            setOptions((prev: T) => ({
                ...prev,
                isDuplicate: values[0],
            }));
        }
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
                        'Any Sources': sources,
                        'All Murdoch Owned Media': Array.from(murdochMedia)
                    }}
                />
            </FilterOption>

            <FilterOption label='Think Tank Reference:'>
                <MultiSelect
                    options={[
                        { value: 'yes', label: 'True' },
                        { value: 'no', label: 'False' }
                    ]}
                    value={thinkTankVisualSelection}
                    onChange={handleThinkTankChange}
                    placeholder='Select think tank reference options...'
                />
            </FilterOption>

            <FilterOption label='Article Publication Type:'>
                <MultiSelect
                    options={[
                        { value: 'yes', label: 'Duplicate' },
                        { value: 'no', label: 'Unique' }
                    ]}
                    value={duplicateVisualSelection}
                    onChange={handleDuplicateChange}
                    placeholder='Select publication type...'
                />
            </FilterOption>
        </div>
    );
}