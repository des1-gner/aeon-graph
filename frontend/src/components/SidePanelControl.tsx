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
    CursorArrowRaysIcon
} from '@heroicons/react/24/solid';
import { Button } from './Button';
import { AnimatePresence, motion } from 'framer-motion';
import { useArticles } from '../contexts/ArticlesContext';
import {
    broadClaims,
    dummyArticles,
    sources,
    subClaims,
} from '../types/article';
import { QuerySummaryModal } from './modals/QuerySummaryModal';
import { HexColorPicker } from 'react-colorful';
import { ArticleSearchModal } from './modals/ArticleSearchModal';

interface VisibilityState {
    isActive: boolean;
    mode?: 'on' | 'hover' | 'off';
}

const defaultOptions = {
    articleBody: '',
    broadClaim: '',
    subClaim: '',
    source: '',
    think_tank_ref: 'no',
    isDuplicate: 'no',
};

const defaultEdgeOptions = {
    ...defaultOptions,
    visibility: 'off' as const,
};

const DEFAULT_HIGHLIGHT_COLOR = '#FFFFFF';
const DEFAULT_CLUSTER_COLOR = '#FFFFFF';
const DEFAULT_EDGE_COLOR = '#FFFFFF';
const INACTIVE_COLOR = '#FFFFFF';

const ResetButton = ({ onClick }: { onClick: () => void }) => (
    <Button
        variant='secondary'
        onClick={onClick}
        className='flex items-center gap-1 px-2 py-1 text-sm'
    >
        <ArrowPathIcon className='size-3' />
        Reset
    </Button>
);

const VisibilityToggle = ({ 
    label,
    state,
    onChange
}: { 
    label: string;
    state: VisibilityState;
    onChange: (newState: VisibilityState) => void;
}) => {
    return (
        <div className="space-y-2">
            <div className="flex rounded-lg overflow-hidden border border-neutral-700">
                <button
                    className={`flex items-center justify-center p-2 w-1/2 ${!state.isActive ? 'bg-red-500/20 text-red-500' : 'bg-neutral-800/50 text-neutral-500'}`}
                    onClick={() => onChange({ isActive: false })}
                >
                    <PowerIcon className="size-4" />
                </button>
                <button
                    className={`flex items-center justify-center p-2 w-1/2 ${state.isActive ? 'bg-green-500/20 text-green-500' : 'bg-neutral-800/50 text-neutral-500'}`}
                    onClick={() => onChange({ isActive: true })}
                >
                    <SunIcon className="size-4" />
                </button>
            </div>
            {state.isActive && (
                <div className="text-sm text-neutral-400">{label} By</div>
            )}
        </div>
    );
};

const EdgeVisibilityToggle = ({ 
    state,
    onChange
}: { 
    state: VisibilityState;
    onChange: (newState: VisibilityState) => void;
}) => {
    return (
        <div className="space-y-2">
            <div className="flex rounded-lg overflow-hidden border border-neutral-700">
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${state.mode === 'off' ? 'bg-red-500/20 text-red-500' : 'bg-neutral-800/50 text-neutral-500'}`}
                    onClick={() => onChange({ isActive: false, mode: 'off' })}
                >
                    <PowerIcon className="size-4" />
                </button>
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${state.mode === 'hover' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-neutral-800/50 text-neutral-500'}`}
                    onClick={() => onChange({ isActive: true, mode: 'hover' })}
                >
                    <CursorArrowRaysIcon className="size-4" />
                </button>
                <button
                    className={`flex items-center justify-center p-2 w-1/3 ${state.mode === 'on' ? 'bg-green-500/20 text-green-500' : 'bg-neutral-800/50 text-neutral-500'}`}
                    onClick={() => onChange({ isActive: true, mode: 'on' })}
                >
                    <SunIcon className="size-4" />
                </button>
            </div>
            {state.mode !== 'off' && (
                <div className="text-sm text-neutral-400">Add New Edge By</div>
            )}
        </div>
    );
};

const FilterOption = ({ 
    label, 
    children 
}: { 
    label: string;
    children: React.ReactNode;
}) => (
    <div className="space-y-1">
        <label className="text-sm text-neutral-400">{label}</label>
        {children}
    </div>
);

export const SidePanelControl = ({ onClose }: { onClose?: () => void }) => {
    const [dataSourceIndex, setDataSourceIndex] = useState(0);
    const [showArticleSearchModal, setShowArticleSearchModal] = useState(false);
    const [visualisationOption, setVisualisationOption] = useState(0);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [nodeQty, setNodeQty] = useState<number>(0);
    const [showQuerySummaryModal, setShowQuerySummaryModal] = useState(false);

    // Store previous colors to restore when reactivating
    const [prevHighlightColor, setPrevHighlightColor] = useState(DEFAULT_HIGHLIGHT_COLOR);
    const [prevClusterColor, setPrevClusterColor] = useState(DEFAULT_CLUSTER_COLOR);
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

    const [highlightVisibility, setHighlightVisibility] = useState<VisibilityState>({ 
        isActive: false 
    });
    const [clusterVisibility, setClusterVisibility] = useState<VisibilityState>({ 
        isActive: false 
    });
    const [edgeVisibility, setEdgeVisibility] = useState<VisibilityState>({ 
        isActive: false,
        mode: 'off'
    });

    const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
    const [showClusterColorPicker, setShowClusterColorPicker] = useState(false);
    const [showEdgeColorPicker, setShowEdgeColorPicker] = useState(false);

    const highlightColorPickerRef = useRef<HTMLDivElement>(null);
    const clusterColorPickerRef = useRef<HTMLDivElement>(null);
    const edgeColorPickerRef = useRef<HTMLDivElement>(null);

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
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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

    const resetHighlightOptions = () => {
        setHighlightOptions(defaultOptions);
        setPrevHighlightColor(DEFAULT_HIGHLIGHT_COLOR);
        setHighlightColor(highlightVisibility.isActive ? DEFAULT_HIGHLIGHT_COLOR : INACTIVE_COLOR);
        setHighlightVisibility({ isActive: false });
    };
    
    const resetClusterOptions = () => {
        setClusterOptions(defaultOptions);
        setPrevClusterColor(DEFAULT_CLUSTER_COLOR);
        setClusterColor(clusterVisibility.isActive ? DEFAULT_CLUSTER_COLOR : INACTIVE_COLOR);
        setClusterVisibility({ isActive: false });
    };
    
    const resetEdgeOptions = () => {
        setEdgeOptions(defaultEdgeOptions);
        setPrevEdgeColor(DEFAULT_EDGE_COLOR);
        setEdgeColor(edgeVisibility.mode !== 'off' ? DEFAULT_EDGE_COLOR : INACTIVE_COLOR);
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
        field: string,
        value: string
    ) => {
        switch (optionType) {
            case 'highlight':
                setHighlightOptions((prev) => ({ ...prev, [field]: value }));
                break;
            case 'cluster':
                setClusterOptions((prev) => ({ ...prev, [field]: value }));
                break;
            case 'edge':
                setEdgeOptions((prev) => ({ ...prev, [field]: value }));
                break;
        }
    };

    const renderCommonDropdowns = (
        optionType: 'highlight' | 'cluster' | 'edge',
        options: any
    ) => {
        return (
            <div className="space-y-3">
                <FilterOption label="Text Word in Article:">
                    <input
                        type="text"
                        value={options.articleBody}
                        placeholder="Enter text to filter..."
                        className="dark-text-field w-full"
                        onChange={(e) => handleOptionChange(optionType, 'articleBody', e.target.value)}
                    />
                </FilterOption>

                <FilterOption label="Article Contains the Broad Claim/s:">
                    <select
                        value={options.broadClaim}
                        onChange={(e) => handleOptionChange(optionType, 'broadClaim', e.target.value)}
                        className="dark-text-field w-full"
                    >
                        <option value="">Any broad claim</option>
                        {Object.entries(broadClaims).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </FilterOption>

                <FilterOption label="Article Contains the Sub Claim/s:">
                    <select
                        value={options.subClaim}
                        onChange={(e) => handleOptionChange(optionType, 'subClaim', e.target.value)}
                        className="dark-text-field w-full"
                    >
                        <option value="">Any sub-claim</option>
                        {Object.entries(subClaims).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </FilterOption>

                <FilterOption label="Article is from Source/s:">
                    <select
                        value={options.source}
                        onChange={(e) => handleOptionChange(optionType, 'source', e.target.value)}
                        className="dark-text-field w-full"
                    >
                        <option value="">Any source</option>
                        {sources.map((source) => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </select>
                </FilterOption>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`${optionType}-think-tank`}
                            checked={options.think_tank_ref === 'yes'}
                            onChange={(e) => handleOptionChange(optionType, 'think_tank_ref', e.target.checked ? 'yes' : 'no')}
                            className="rounded border-neutral-500"
                        />
                        <label htmlFor={`${optionType}-think-tank`} className="text-sm text-neutral-400">
                            Has Think Tank Reference
                        </label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`${optionType}-duplicate`}
                            checked={options.isDuplicate === 'yes'}
                            onChange={(e) => handleOptionChange(optionType, 'isDuplicate', e.target.checked ? 'yes' : 'no')}
                            className="rounded border-neutral-500"
                        />
                        <label htmlFor={`${optionType}-duplicate`} className="text-sm text-neutral-400">
                            Is Duplicate Article
                        </label>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <div
                        className="relative"
                        ref={optionType === 'highlight' ? highlightColorPickerRef : 
                              optionType === 'cluster' ? clusterColorPickerRef : 
                              edgeColorPickerRef}
                    >
                        <button
                            className="w-8 h-8 rounded-full border border-neutral-500"
                            style={{ 
                                backgroundColor: optionType === 'highlight' ? highlightColor :
                                                optionType === 'cluster' ? clusterColor :
                                                edgeColor 
                            }}
                            onClick={() => {
                                if (optionType === 'highlight') setShowHighlightColorPicker(!showHighlightColorPicker);
                                else if (optionType === 'cluster') setShowClusterColorPicker(!showClusterColorPicker);
                                else setShowEdgeColorPicker(!showEdgeColorPicker);
                            }}
                        />
                        {((optionType === 'highlight' && showHighlightColorPicker) ||
                          (optionType === 'cluster' && showClusterColorPicker) ||
                          (optionType === 'edge' && showEdgeColorPicker)) && (
                            <div className="absolute left-0 mt-2 z-10">
                                <HexColorPicker
                                    color={optionType === 'highlight' ? highlightColor :
                                           optionType === 'cluster' ? clusterColor :
                                           edgeColor}
                                    onChange={optionType === 'highlight' ? setHighlightColor :
                                            optionType === 'cluster' ? setClusterColor :
                                            setEdgeColor}
                                />
                            </div>
                        )}
                    </div>
                    <span className="text-light">
                        {optionType.charAt(0).toUpperCase() + optionType.slice(1)} color
                    </span>
                </div>
            </div>
        );
    };

    const renderVisualisationOptions = () => {
        switch (visualisationOption) {
            case 0: // Highlight
                return (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="flex gap-2 items-center font-semibold text-light">
                                <EyeIcon className="size-4" />
                                Highlight Options
                            </h2>
                            <ResetButton onClick={resetHighlightOptions} />
                        </div>

                        <VisibilityToggle
                            label="Highlight"
                            state={highlightVisibility}
                            onChange={handleHighlightVisibilityChange}
                        />
                        
                        {highlightVisibility.isActive && renderCommonDropdowns('highlight', highlightOptions)}
                    </div>
                );
            case 1: // Cluster
                return (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="flex gap-2 items-center font-semibold text-light">
                                <EyeIcon className="size-4" />
                                Cluster Options
                            </h2>
                            <ResetButton onClick={resetClusterOptions} />
                        </div>

                        <VisibilityToggle
                            label="Cluster"
                            state={clusterVisibility}
                            onChange={handleClusterVisibilityChange}
                        />

                        {clusterVisibility.isActive && renderCommonDropdowns('cluster', clusterOptions)}
                    </div>
                );
            case 2: // Add New Edge
                return (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="flex gap-2 items-center font-semibold text-light">
                                <EyeIcon className="size-4" />
                                Add New Edge
                            </h2>
                            <ResetButton onClick={resetEdgeOptions} />
                        </div>

                        <EdgeVisibilityToggle
                            state={edgeVisibility}
                            onChange={handleEdgeVisibilityChange}
                        />

                        {edgeVisibility.mode !== 'off' && renderCommonDropdowns('edge', edgeOptions)}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="backdrop-blur-xl border-neutral-700 border p-4 space-y-6 rounded-lg z-10 w-96">
                <div className="flex items-center justify-between">
                    <XMarkIcon
                        className="size-5 text-light cursor-pointer flex justify-start"
                        onClick={onClose}
                    />
                    <h1 className="flex gap-2 items-center font-semibold text-lg justify-center text-light">
                        <AdjustmentsHorizontalIcon className="size-5" />
                        Data controls
                    </h1>
                    <div />
                </div>

                <Toggle
                    header={[
                        'Data source',
                        <CircleStackIcon className="size-4" />,
                    ]}
                    toggleLabels={['Database', 'Demo']}
                    selectedIndex={dataSourceIndex}
                    onClick={(index) => handleDataSourceChange(index)}
                >
                    {dataSourceIndex === 0 && (
                        <div className="p-2">
                            <Button
                                variant="secondary"
                                className="flex items-center gap-2 justify-center w-full"
                                onClick={() => setShowArticleSearchModal(true)}
                            >
                                <MagnifyingGlassIcon className="size-4" />
                                Search
                            </Button>
                        </div>
                    )}
                </Toggle>

                <Toggle
                    header={[
                        'Visualisation options',
                        <PaintBrushIcon className="size-4" />,
                    ]}
                    toggleLabels={['Highlight', 'Cluster', 'Add New Edge']}
                    selectedIndex={visualisationOption}
                    onClick={(index) => setVisualisationOption(index)}
                />

                <div className="dark-card p-3">
                    {renderVisualisationOptions()}
                </div>

                <Button
                    variant="primary"
                    className="flex items-center gap-2 justify-center w-full"
                    onClick={() => setShowQuerySummaryModal(true)}
                >
                    <DocumentTextIcon className="size-4" />
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
                        className="fixed inset-0 z-50 flex items-center justify-center"
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
                        className="fixed inset-0 z-50 flex items-center justify-center"
                    >
                        <QuerySummaryModal
                            startDate={startDate}
                            endDate={endDate}
                            publishedBy=""
                            containing={searchQuery}
                            nodeLimit={nodeQty || 0}
                            onClose={() => setShowQuerySummaryModal(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SidePanelControl;