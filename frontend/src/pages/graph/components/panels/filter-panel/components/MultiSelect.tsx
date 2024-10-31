import React, { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { MultiSelectProps, MultiSelectOption } from '../types/interfaces';

export const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value = [],
    onChange,
    placeholder,
    groups = {},
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleGroupSelect = (groupOptions: ReadonlyArray<string>) => {
        const currentSet = new Set(value);
        const groupSet = new Set(groupOptions);
        const allSelected = groupOptions.every((option) => currentSet.has(option));

        if (allSelected) {
            const newValue = value.filter((v) => !groupSet.has(v));
            onChange(newValue);
        } else {
            // Convert readonly array to mutable array when combining
            const combinedArray = Array.from(new Set([...value, ...Array.from(groupOptions)]));
            onChange(combinedArray);
        }
    };

    return (
        <div className='relative' ref={dropdownRef}>
            <div
                className='dark-text-field w-full flex items-center justify-between cursor-pointer'
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className='flex flex-wrap gap-1 flex-1'>
                    {value.length === 0 ? (
                        <span className='text-neutral-500'>{placeholder}</span>
                    ) : (
                        <span className='text-neutral-200'>
                            {value.length} selected
                        </span>
                    )}
                </div>
                <ChevronDownIcon className='size-4' />
            </div>

            {isOpen && (
                <div className='absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                    {Object.entries(groups).map(([groupName, groupOptions]) => (
                        <div
                            key={groupName}
                            className='p-2 border-b border-neutral-700'
                        >
                            <label className='flex items-center gap-2 px-2 py-1 hover:bg-neutral-700 rounded cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={groupOptions.every((option) =>
                                        value.includes(option)
                                    )}
                                    onChange={() =>
                                        handleGroupSelect(groupOptions)
                                    }
                                    className='rounded border-neutral-500'
                                />
                                <span className='text-neutral-200'>
                                    {groupName}
                                </span>
                            </label>
                        </div>
                    ))}

                    {options.map((option: MultiSelectOption) => (
                        <label
                            key={option.value}
                            className='flex items-center gap-2 p-2 hover:bg-neutral-700 cursor-pointer'
                        >
                            <input
                                type='checkbox'
                                checked={value.includes(option.value)}
                                onChange={() => {
                                    const newValue = value.includes(
                                        option.value
                                    )
                                        ? value.filter(
                                              (v) => v !== option.value
                                          )
                                        : [...value, option.value];
                                    onChange(newValue);
                                }}
                                className='rounded border-neutral-500'
                            />
                            <span className='text-neutral-200'>
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};