import React, { useEffect, useState, useRef } from 'react';
import { Toggle } from './Toggle';
import {
    AdjustmentsHorizontalIcon,
    CircleStackIcon,
    PaintBrushIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    DocumentTextIcon,
    EyeIcon,
    ArrowPathIcon,
    PowerIcon,
    SunIcon,
    CursorArrowRaysIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/solid';
import { Button } from './Button';
import { AnimatePresence, motion } from 'framer-motion';
import {
    useArticles,
    EdgeOptions as ContextEdgeOptions,
    VisibilityType as ContextVisibilityType,
} from '../contexts/ArticlesContext';
import {
    broadClaims,
    dummyArticles,
    sources,
    subClaims,
} from '../types/article';
import { QuerySummaryModal } from './modals/QuerySummaryModal';
import { HexColorPicker } from 'react-colorful';
import { ArticleSearchModal } from './modals/ArticleSearchModal';

// Constants
const DEFAULT_HIGHLIGHT_COLOR = '#FF0000';
const DEFAULT_CLUSTER_COLOR = '#00FF00';
const DEFAULT_EDGE_COLOR = '#0000FF';
const INACTIVE_COLOR = '#FFFFFF';

const murdochMedia = [
    'theaustralian.com.au',
    'news.com.au',
    'heraldsun.com.au',
    'skynews.com.au',
    'dailytelegraph.com.au',
    'couriermail.com.au',
    'nypost.com',
    'wsj.com',
    'foxnews.com',
];

// Interfaces using imported types
interface CommonOptions {
    articleBody: string;
    broadClaim: string;
    subClaim: string;
    source: string;
    think_tank_ref: string;
    isDuplicate: string;
}

interface MultiSelectOption {
    value: string;
    label: string;
}

interface MultiSelectGroups {
    [key: string]: string[];
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder: string;
    groups?: MultiSelectGroups;
}

interface VisibilityState {
    isActive: boolean;
    mode?: ContextVisibilityType;
}

// Helper Components
const MultiSelect: React.FC<MultiSelectProps> = ({
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
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleGroupSelect = (groupOptions: string[]) => {
        const currentSet = new Set(value);
        const groupSet = new Set(groupOptions);

        const allSelected = groupOptions.every((option) =>
            currentSet.has(option)
        );

        if (allSelected) {
            const newValue = value.filter((v) => !groupSet.has(v));
            onChange(newValue);
        } else {
            const combinedArray = Array.from(
                new Set([...value, ...groupOptions])
            );
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

                    {options.map((option) => (
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

const ResetButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <Button
        variant='secondary'
        onClick={onClick}
        className='flex items-center gap-1 px-2 py-1 text-sm'
    >
        <ArrowPathIcon className='size-3' />
        Reset
    </Button>
);

const FilterOption: React.FC<{
    label: string;
    children: React.ReactNode;
}> = ({ label, children }) => (
    <div className='space-y-1'>
        <label className='text-sm text-neutral-400'>{label}</label>
        {children}
    </div>
);

const VisibilityToggle: React.FC<{
    label: string;
    state: VisibilityState;
    onChange: (newState: VisibilityState) => void;
}> = ({ label, state, onChange }) => {
    return (
        <div className='space-y-2'>
            <div className='flex rounded-lg overflow-hidden border border-neutral-700'>
                <button
                    className={`flex items-center justify-center p-2 w-1/2 ${
                        !state.isActive
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-neutral-800/50 text-neutral-500'
                    }`}
                    onClick={() => onChange({ isActive: false })}
                >
                    <PowerIcon className='size-4' />
                </button>
                <button
                    className={`flex items-center justify-center p-2 w-1/2 ${
                        state.isActive
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-neutral-800/50 text-neutral-500'
                    }`}
                    onClick={() => onChange({ isActive: true })}
                >
                    <SunIcon className='size-4' />
                </button>
            </div>
            {state.isActive && (
                <div className='text-sm text-neutral-400'>{label} By</div>
            )}
        </div>
    );
};

const EdgeVisibilityToggle: React.FC<{
    state: VisibilityState;
    onChange: (newState: VisibilityState) => void;
}> = ({ state, onChange }) => {
    return (
        <div className='space-y-2'>
            <div className='flex rounded-lg overflow-hidden border border-neutral-700'>
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${
                        state.mode === 'off'
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-neutral-800/50 text-neutral-500'
                    }`}
                    onClick={() => onChange({ isActive: false, mode: 'off' })}
                >
                    <PowerIcon className='size-4' />
                </button>
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${
                        state.mode === 'hover'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-neutral-800/50 text-neutral-500'
                    }`}
                    onClick={() => onChange({ isActive: true, mode: 'hover' })}
                >
                    <CursorArrowRaysIcon className='size-4' />
                </button>
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${
                        state.mode === 'on'
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-neutral-800/50 text-neutral-500'
                    }`}
                    onClick={() => onChange({ isActive: true, mode: 'on' })}
                >
                    <SunIcon className='size-4' />
                </button>
            </div>
            {state.mode !== 'off' && (
                <div className='text-sm text-neutral-400'>Add New Edge By</div>
            )}
        </div>
    );
};

// Default options
const defaultOptions: CommonOptions = {
    articleBody: '',
    broadClaim: '',
    subClaim: '',
    source: '',
    think_tank_ref: '',
    isDuplicate: '',
};

const defaultEdgeOptions: ContextEdgeOptions = {
    ...defaultOptions,
    visibility: 'off',
};

// Main Component
export const SidePanelControl: React.FC<{
    onClose?: () => void;
    initialShowSearchQueryModal: boolean;
    setInitialShowSearchQueryModal: (value: boolean) => void;
}> = ({
    onClose,
    initialShowSearchQueryModal,
    setInitialShowSearchQueryModal,
}) => {
    const [dataSourceIndex, setDataSourceIndex] = useState(0);
    const [showArticleSearchModal, setShowArticleSearchModal] = useState(false);
    const [visualisationOption, setVisualisationOption] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [nodeQty, setNodeQty] = useState<number>(0);
    const [showQuerySummaryModal, setShowQuerySummaryModal] = useState(false);

    const [prevHighlightColor, setPrevHighlightColor] = useState(
        DEFAULT_HIGHLIGHT_COLOR
    );
    const [prevClusterColor, setPrevClusterColor] = useState(
        DEFAULT_CLUSTER_COLOR
    );
    const [prevEdgeColor, setPrevEdgeColor] = useState(DEFAULT_EDGE_COLOR);

    const {
        articles,
        setArticles,
        highlightColor,
        setHighlightColor,
        clusterColor,
        setClusterColor,
        edgeColor,
        setEdgeColor,
        highlightOptions,
        setHighlightOptions,
        clusterOptions,
        setClusterOptions,
        edgeOptions,
        setEdgeOptions,
    } = useArticles();

    const [highlightVisibility, setHighlightVisibility] =
        useState<VisibilityState>({ isActive: false });
    const [clusterVisibility, setClusterVisibility] = useState<VisibilityState>(
        { isActive: false }
    );
    const [edgeVisibility, setEdgeVisibility] = useState<VisibilityState>({
        isActive: false,
        mode: 'off',
    });

    const [showHighlightColorPicker, setShowHighlightColorPicker] =
        useState(false);
    const [showClusterColorPicker, setShowClusterColorPicker] = useState(false);
    const [showEdgeColorPicker, setShowEdgeColorPicker] = useState(false);

    const highlightColorPickerRef = useRef<HTMLDivElement>(null);
    const clusterColorPickerRef = useRef<HTMLDivElement>(null);
    const edgeColorPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialShowSearchQueryModal) {
            setShowArticleSearchModal(true);
            setInitialShowSearchQueryModal(false);
        }
    }, []);

    // Add this useEffect at the top level of the component (BLOODY GENIUS FIX LOL)
    useEffect(() => {
        resetHighlightOptions();
        resetClusterOptions();
        resetEdgeOptions();
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                highlightColorPickerRef.current &&
                !highlightColorPickerRef.current.contains(event.target as Node)
            ) {
                setShowHighlightColorPicker(false);
            }
            if (
                clusterColorPickerRef.current &&
                !clusterColorPickerRef.current.contains(event.target as Node)
            ) {
                setShowClusterColorPicker(false);
            }
            if (
                edgeColorPickerRef.current &&
                !edgeColorPickerRef.current.contains(event.target as Node)
            ) {
                setShowEdgeColorPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleHighlightVisibilityChange = (newState: VisibilityState) => {
        if (newState.isActive) {
            setHighlightColor(prevHighlightColor);
        } else {
            setPrevHighlightColor(highlightColor);
            setHighlightColor(INACTIVE_COLOR);
        }
        setHighlightVisibility(newState);
    };

    const handleClusterVisibilityChange = (newState: VisibilityState) => {
        if (newState.isActive) {
            setClusterColor(prevClusterColor);
        } else {
            setPrevClusterColor(clusterColor);
            setClusterColor(INACTIVE_COLOR);
        }
        setClusterVisibility(newState);
    };

    const handleEdgeVisibilityChange = (newState: VisibilityState) => {
        if (newState.mode !== 'off') {
            setEdgeColor(prevEdgeColor);
        } else {
            setPrevEdgeColor(edgeColor);
            setEdgeColor(INACTIVE_COLOR);
        }
        setEdgeVisibility(newState);
        if (newState.mode) {
            handleOptionChange('edge', 'visibility', newState.mode);
        }
    };

    // Update the reset functions to use the new default colors:
    const resetHighlightOptions = () => {
        setHighlightOptions(defaultOptions);
        setPrevHighlightColor(DEFAULT_HIGHLIGHT_COLOR);
        setHighlightColor(
            highlightVisibility.isActive
                ? DEFAULT_HIGHLIGHT_COLOR
                : INACTIVE_COLOR
        );
        setHighlightVisibility({ isActive: false });
    };

    const resetClusterOptions = () => {
        setClusterOptions(defaultOptions);
        setPrevClusterColor(DEFAULT_CLUSTER_COLOR);
        setClusterColor(
            clusterVisibility.isActive ? DEFAULT_CLUSTER_COLOR : INACTIVE_COLOR
        );
        setClusterVisibility({ isActive: false });
    };

    const resetEdgeOptions = () => {
        setEdgeOptions(defaultEdgeOptions);
        setPrevEdgeColor(DEFAULT_EDGE_COLOR);
        setEdgeColor(
            edgeVisibility.mode !== 'off' ? DEFAULT_EDGE_COLOR : INACTIVE_COLOR
        );
        setEdgeVisibility({ isActive: false, mode: 'off' });
    };

    const handleDataSourceChange = (index: number) => {
        setDataSourceIndex(index);
        if (index === 1) {
            setArticles(dummyArticles);
        }
    };

    const handleOptionChange = (
        optionType: 'highlight' | 'cluster' | 'edge',
        field: keyof CommonOptions | 'visibility',
        value: string
    ) => {
        switch (optionType) {
            case 'highlight':
                setHighlightOptions((prev: CommonOptions) => ({
                    ...prev,
                    [field]: value,
                }));
                break;
            case 'cluster':
                setClusterOptions((prev: CommonOptions) => ({
                    ...prev,
                    [field]: value,
                }));
                break;
            case 'edge':
                setEdgeOptions((prev: ContextEdgeOptions) => {
                    if (field === 'visibility') {
                        // Type guard for visibility values
                        const visibilityValue = value as ContextVisibilityType;
                        if (
                            visibilityValue === 'on' ||
                            visibilityValue === 'hover' ||
                            visibilityValue === 'off'
                        ) {
                            return {
                                ...prev,
                                visibility: visibilityValue,
                            };
                        }
                        return prev;
                    }
                    // For other fields, update normally
                    return {
                        ...prev,
                        [field]: value,
                    };
                });
                break;
        }
    };

    const renderCommonDropdowns = (
        optionType: 'highlight' | 'cluster' | 'edge',
        options: CommonOptions
    ) => {
        return (
            <div className='space-y-3'>
                {/* Color Picker moved to top */}
                <div className='flex items-center gap-2 mb-4'>
                    <div
                        className='relative'
                        ref={
                            optionType === 'highlight'
                                ? highlightColorPickerRef
                                : optionType === 'cluster'
                                ? clusterColorPickerRef
                                : edgeColorPickerRef
                        }
                    >
                        <button
                            className='w-8 h-8 rounded-full border border-neutral-500'
                            style={{
                                backgroundColor:
                                    optionType === 'highlight'
                                        ? highlightColor
                                        : optionType === 'cluster'
                                        ? clusterColor
                                        : edgeColor,
                            }}
                            onClick={() => {
                                if (optionType === 'highlight')
                                    setShowHighlightColorPicker(
                                        !showHighlightColorPicker
                                    );
                                else if (optionType === 'cluster')
                                    setShowClusterColorPicker(
                                        !showClusterColorPicker
                                    );
                                else
                                    setShowEdgeColorPicker(
                                        !showEdgeColorPicker
                                    );
                            }}
                        />
                        {((optionType === 'highlight' &&
                            showHighlightColorPicker) ||
                            (optionType === 'cluster' &&
                                showClusterColorPicker) ||
                            (optionType === 'edge' && showEdgeColorPicker)) && (
                            <div className='absolute left-0 mt-2 z-10'>
                                <HexColorPicker
                                    color={
                                        optionType === 'highlight'
                                            ? highlightColor
                                            : optionType === 'cluster'
                                            ? clusterColor
                                            : edgeColor
                                    }
                                    onChange={
                                        optionType === 'highlight'
                                            ? setHighlightColor
                                            : optionType === 'cluster'
                                            ? setClusterColor
                                            : setEdgeColor
                                    }
                                />
                            </div>
                        )}
                    </div>
                    <span className='text-light'>
                        {optionType.charAt(0).toUpperCase() +
                            optionType.slice(1)}{' '}
                        color
                    </span>
                </div>

                <FilterOption label='Text Word in Article:'>
                    <input
                        type='text'
                        value={options.articleBody}
                        placeholder='Enter text to filter...'
                        className='dark-text-field w-full'
                        onChange={(e) =>
                            handleOptionChange(
                                optionType,
                                'articleBody',
                                e.target.value
                            )
                        }
                    />
                </FilterOption>

                <FilterOption label='Article Contains the Broad Claim/s:'>
                    <MultiSelect
                        options={Object.entries(broadClaims).map(
                            ([key, value]) => ({
                                value: key,
                                label: value,
                            })
                        )}
                        value={
                            options.broadClaim
                                ? options.broadClaim.split(',').filter(Boolean)
                                : []
                        }
                        onChange={(value) =>
                            handleOptionChange(
                                optionType,
                                'broadClaim',
                                value.join(',')
                            )
                        }
                        placeholder='Select broad claims...'
                    />
                </FilterOption>

                <FilterOption label='Article Contains the Sub Claim/s:'>
                    <MultiSelect
                        options={Object.entries(subClaims).map(
                            ([key, value]) => ({
                                value: key,
                                label: value,
                            })
                        )}
                        value={
                            options.subClaim
                                ? options.subClaim.split(',').filter(Boolean)
                                : []
                        }
                        onChange={(value) =>
                            handleOptionChange(
                                optionType,
                                'subClaim',
                                value.join(',')
                            )
                        }
                        placeholder='Select sub-claims...'
                    />
                </FilterOption>

                <FilterOption label='Article is from Source/s:'>
                    <MultiSelect
                        options={sources.map((source) => ({
                            value: source,
                            label: source,
                        }))}
                        groups={{
                            'All Murdoch Owned Media': [...murdochMedia],
                        }}
                        value={
                            options.source
                                ? options.source.split(',').filter(Boolean)
                                : []
                        }
                        onChange={(value) =>
                            handleOptionChange(
                                optionType,
                                'source',
                                value.join(',')
                            )
                        }
                        placeholder='Select sources...'
                    />
                </FilterOption>

                <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            id={`${optionType}-think-tank`}
                            checked={options.think_tank_ref === 'yes'}
                            onChange={(e) =>
                                handleOptionChange(
                                    optionType,
                                    'think_tank_ref',
                                    e.target.checked ? 'yes' : 'no'
                                )
                            }
                            className='rounded border-neutral-500'
                        />
                        <label
                            htmlFor={`${optionType}-think-tank`}
                            className='text-sm text-neutral-400'
                        >
                            Contains Think Tank Reference
                        </label>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input
                            type='checkbox'
                            id={`${optionType}-duplicate`}
                            checked={options.isDuplicate === 'yes'}
                            onChange={(e) =>
                                handleOptionChange(
                                    optionType,
                                    'isDuplicate',
                                    e.target.checked ? 'yes' : 'no'
                                )
                            }
                            className='rounded border-neutral-500'
                        />
                        <label
                            htmlFor={`${optionType}-duplicate`}
                            className='text-sm text-neutral-400'
                        >
                            Article is published on more than one source
                        </label>
                    </div>
                </div>
            </div>
        );
    };

    const renderVisualisationOptions = () => {
        switch (visualisationOption) {
            case 0: // Highlight
                return (
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='flex gap-2 items-center font-semibold text-light'>
                                <EyeIcon className='size-4' />
                                Highlight Options
                            </h2>
                            <ResetButton onClick={resetHighlightOptions} />
                        </div>

                        <VisibilityToggle
                            label='Highlight'
                            state={highlightVisibility}
                            onChange={handleHighlightVisibilityChange}
                        />

                        {highlightVisibility.isActive &&
                            renderCommonDropdowns(
                                'highlight',
                                highlightOptions
                            )}
                    </div>
                );
            case 1: // Cluster
                return (
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='flex gap-2 items-center font-semibold text-light'>
                                <EyeIcon className='size-4' />
                                Cluster Options
                            </h2>
                            <ResetButton onClick={resetClusterOptions} />
                        </div>

                        <VisibilityToggle
                            label='Cluster'
                            state={clusterVisibility}
                            onChange={handleClusterVisibilityChange}
                        />

                        {clusterVisibility.isActive &&
                            renderCommonDropdowns('cluster', clusterOptions)}
                    </div>
                );
            case 2: // Add New Edge
                return (
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='flex gap-2 items-center font-semibold text-light'>
                                <EyeIcon className='size-4' />
                                Add New Edge
                            </h2>
                            <ResetButton onClick={resetEdgeOptions} />
                        </div>

                        <EdgeVisibilityToggle
                            state={edgeVisibility}
                            onChange={handleEdgeVisibilityChange}
                        />

                        {edgeVisibility.mode !== 'off' &&
                            renderCommonDropdowns('edge', edgeOptions)}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className='backdrop-blur-xl border-neutral-700 border p-4 space-y-6 rounded-lg z-10 w-96'>
                <div className='flex items-center justify-between'>
                    <XMarkIcon
                        className='size-5 text-light cursor-pointer flex justify-start'
                        onClick={onClose}
                    />
                    <h1 className='flex gap-2 items-center font-semibold text-lg justify-center text-light'>
                        <AdjustmentsHorizontalIcon className='size-5' />
                        Data controls
                    </h1>
                    <div />
                </div>

                <Toggle
                    header={[
                        'Data source',
                        <CircleStackIcon
                            className='size-4'
                            key='data-source-icon'
                        />,
                    ]}
                    toggleLabels={['Database', 'Demo']}
                    selectedIndex={dataSourceIndex}
                    onClick={(index) => handleDataSourceChange(index)}
                >
                    {dataSourceIndex === 0 && (
                        <div className='p-2'>
                            <Button
                                variant='secondary'
                                className='flex items-center gap-2 justify-center w-full'
                                onClick={() => setShowArticleSearchModal(true)}
                            >
                                <MagnifyingGlassIcon className='size-4' />
                                Search
                            </Button>
                        </div>
                    )}
                </Toggle>

                <Toggle
                    header={[
                        'Visualisation options',
                        <PaintBrushIcon
                            className='size-4'
                            key='visualisation-icon'
                        />,
                    ]}
                    toggleLabels={['Highlight', 'Cluster', 'Add New Edge']}
                    selectedIndex={visualisationOption}
                    onClick={(index) => setVisualisationOption(index)}
                />

                <div className='dark-card p-3'>
                    {renderVisualisationOptions()}
                </div>

                <Button
                    variant='primary'
                    className='flex items-center gap-2 justify-center w-full'
                    onClick={() => setShowQuerySummaryModal(true)}
                >
                    <DocumentTextIcon className='size-4' />
                    Query summary
                </Button>
            </div>

            <AnimatePresence>
                {showArticleSearchModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className='fixed inset-0 z-50 flex items-center justify-center'
                    >
                        <ArticleSearchModal
                            onClose={() => setShowArticleSearchModal(false)}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            nodeQty={nodeQty}
                            setNodeQty={setNodeQty}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showQuerySummaryModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className='fixed inset-0 z-50 flex items-center justify-center'
                    >
                        <QuerySummaryModal
                            startDate={startDate}
                            endDate={endDate}
                            publishedBy={searchQuery} // or appropriate value
                            containing={searchQuery}
                            nodeLimit={nodeQty}
                            onClose={() => setShowQuerySummaryModal(false)}
                            highlightOptions={highlightOptions}
                            clusterOptions={clusterOptions}
                            edgeOptions={edgeOptions}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SidePanelControl;
