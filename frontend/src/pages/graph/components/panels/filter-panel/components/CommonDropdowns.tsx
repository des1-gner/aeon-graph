import { useState } from 'react';
import { MultiSelect } from './MultiSelect';
import { FilterOption } from './FilterOption';
import { CommonOptions, CommonDropdownsProps } from '../types/interfaces';
import { 
    broadClaims,
    subClaims,
    sources,
    murdochMedia 
} from '../constants/default';

/**
 * CommonDropdowns component provides a set of filter controls for article searching/filtering
 * including broad claims, sub claims, sources, and other filtering options.
 * 
 * @template T - Type extending CommonOptions interface
 * @param {Object} props - Component props
 * @param {T} props.options - Current filter options state
 * @param {Function} props.setOptions - Function to update filter options
 */
export function CommonDropdowns<T extends CommonOptions>({ 
    options,
    setOptions 
}: CommonDropdownsProps<T>) {
    // State for managing visual selection in multi-select components
    // These are needed because these fields can only have single values but use multi-select UI
    const [thinkTankVisualSelection, setThinkTankVisualSelection] = useState<string[]>([]);
    const [duplicateVisualSelection, setDuplicateVisualSelection] = useState<string[]>([]);

    /**
     * Handles changes for single-value filter options
     * @param {keyof CommonOptions} field - The field name to update
     * @param {string} value - The new value to set
     */
    const handleOptionChange = (field: keyof CommonOptions, value: string) => {
        setOptions((prev: T) => ({
            ...prev,
            [field]: value,
        }));
    };

    /**
     * Handles changes for multi-select filter options
     * Joins multiple values with commas or sets empty string if no values selected
     * @param {keyof CommonOptions} field - The field name to update
     * @param {string[]} values - Array of selected values
     */
    const handleMultiSelectChange = (field: keyof CommonOptions, values: string[]) => {
        setOptions((prev: T) => ({
            ...prev,
            [field]: values.length > 0 ? values.join(',') : '',
        }));
    };

    /**
     * Specialized handler for think tank reference filter
     * Only sets a value when exactly one option is selected
     * @param {string[]} values - Selected values from multi-select
     */
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

    /**
     * Specialized handler for duplicate article filter
     * Only sets a value when exactly one option is selected
     * @param {string[]} values - Selected values from multi-select
     */
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
            {/* Text search filter for article body */}
            <FilterOption label='Text Word in Article:'>
                <input
                    type='text'
                    value={options.articleBody}
                    placeholder='Enter text to filter...'
                    className='dark-text-field w-full'
                    onChange={(e) => handleOptionChange('articleBody', e.target.value)}
                />
            </FilterOption>

            {/* Broad claims multi-select filter */}
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

            {/* Sub claims multi-select filter */}
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

            {/* Sources multi-select filter with special group for Murdoch media */}
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

            {/* Think tank reference binary filter using multi-select UI */}
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

            {/* Article duplication status filter using multi-select UI */}
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