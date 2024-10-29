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
    think_tank_ref: '',
    isDuplicate: '',
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
    isEdgeMode = false,
    state,
    onChange
}: { 
    isEdgeMode?: boolean;
    state: VisibilityState;
    onChange: (newState: VisibilityState) => void;
}) => {
    if (isEdgeMode) {
        return (
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
        );
    }

    return (
        <button
            className={`flex items-center justify-center p-2 rounded-lg border border-neutral-700 w-full
                ${state.isActive 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-red-500/20 text-red-500'}`}
            onClick={() => onChange({ isActive: !state.isActive })}
        >
            <PowerIcon className="size-4 mr-2" />
            {state.isActive ? 'Active' : 'Inactive'}
        </button>
    );
};

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

    // Handle visibility changes with color management
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

    // ... (renderCommonDropdowns remains the same)

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
                            state={highlightVisibility}
                            onChange={handleHighlightVisibilityChange}
                        />
                        
                        {highlightVisibility.isActive && (
                            <>
                                {renderCommonDropdowns('highlight')}
                                
                                <div className='flex items-center gap-2 mt-4'>
                                    <div
                                        className='relative'
                                        ref={highlightColorPickerRef}
                                    >
                                        <button
                                            className='w-8 h-8 rounded-full border border-neutral-500'
                                            style={{ backgroundColor: highlightColor }}
                                            onClick={() =>
                                                setShowHighlightColorPicker(
                                                    !showHighlightColorPicker
                                                )
                                            }
                                        />
                                        {showHighlightColorPicker && (
                                            <div className='absolute left-0 mt-2 z-10'>
                                                <HexColorPicker
                                                    color={highlightColor}
                                                    onChange={setHighlightColor}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <span className='text-light'>Highlight color</span>
                                </div>
                            </>
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
                            state={clusterVisibility}
                            onChange={handleClusterVisibilityChange}
                        />

                        {clusterVisibility.isActive && (
                            <>
                                {renderCommonDropdowns('cluster')}
                                
                                <div className='flex items-center gap-2 mt-4'>
                                    <div
                                        className='relative'
                                        ref={clusterColorPickerRef}
                                    >
                                        <button
                                            className='w-8 h-8 rounded-full border border-neutral-500'
                                            style={{ backgroundColor: clusterColor }}
                                            onClick={() =>
                                                setShowClusterColorPicker(
                                                    !showClusterColorPicker
                                                )
                                            }
                                        />
                                        {showClusterColorPicker && (
                                            <div className='absolute left-0 mt-2 z-10'>
                                                <HexColorPicker
                                                    color={clusterColor}
                                                    onChange={setClusterColor}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <span className='text-light'>Cluster color</span>
                                </div>
                            </>
                        )}
                    </div>
                );
            case 2: // Edges
                return (
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between mb-4'>
                            <h2 className='flex gap-2 items-center font-semibold text-light'>
                                <EyeIcon className='size-4' />
                                Edge Options
                            </h2>
                            <ResetButton onClick={resetEdgeOptions} />
                        </div>

                        <VisibilityToggle
                            isEdgeMode={true}
                            state={edgeVisibility}
                            onChange={handleEdgeVisibilityChange}
                        />

                        {edgeVisibility.mode !== 'off' && (
                            <>
                                {renderCommonDropdowns('edge')}
                                
                                <div className='flex items-center gap-2 mt-4'>
                                    <div className='relative' ref={edgeColorPickerRef}>
                                    <button
                                            className='w-8 h-8 rounded-full border border-neutral-500'
                                            style={{ backgroundColor: edgeColor }}
                                            onClick={() =>
                                                setShowEdgeColorPicker(
                                                    !showEdgeColorPicker
                                                )
                                            }
                                        />
                                        {showEdgeColorPicker && (
                                            <div className='absolute left-0 mt-2 z-10'>
                                                <HexColorPicker
                                                    color={edgeColor}
                                                    onChange={setEdgeColor}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <span className='text-light'>Edge color</span>
                                </div>
                            </>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const renderCommonDropdowns = (
        optionType: 'highlight' | 'cluster' | 'edge'
    ) => {
        const options =
            optionType === 'highlight'
                ? highlightOptions
                : optionType === 'cluster'
                ? clusterOptions
                : edgeOptions;

        return (
            <div className='space-y-3'>
                <div className='space-y-1'>
                    <label className='text-sm text-neutral-400'>Article Body Filter</label>
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
                </div>

                <div className='space-y-1'>
                    <label className='text-sm text-neutral-400'>Broad Claim</label>
                    <select
                        value={options.broadClaim}
                        onChange={(e) =>
                            handleOptionChange(
                                optionType,
                                'broadClaim',
                                e.target.value
                            )
                        }
                        className='dark-text-field w-full'
                    >
                        <option value=''>Any broad claim</option>
                        {Object.entries(broadClaims).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='space-y-1'>
                    <label className='text-sm text-neutral-400'>Sub Claim</label>
                    <select
                        value={options.subClaim}
                        onChange={(e) =>
                            handleOptionChange(
                                optionType,
                                'subClaim',
                                e.target.value
                            )
                        }
                        className='dark-text-field w-full'
                    >
                        <option value=''>Any sub-claim</option>
                        {Object.entries(subClaims).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='space-y-1'>
                    <label className='text-sm text-neutral-400'>Source</label>
                    <select
                        value={options.source}
                        onChange={(e) =>
                            handleOptionChange(optionType, 'source', e.target.value)
                        }
                        className='dark-text-field w-full'
                    >
                        <option value=''>Any source</option>
                        {sources.map((source) => (
                            <option key={source} value={source}>
                                {source}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='flex gap-2'>
                    <div className='w-1/2 space-y-1'>
                        <label className='text-sm text-neutral-400'>Think Tank Reference</label>
                        <select
                            value={options.think_tank_ref}
                            onChange={(e) =>
                                handleOptionChange(
                                    optionType,
                                    'think_tank_ref',
                                    e.target.value
                                )
                            }
                            className='dark-text-field w-full'
                        >
                            <option value=''>Any reference</option>
                            <option value='yes'>Yes</option>
                            <option value='no'>No</option>
                        </select>
                    </div>
                    <div className='w-1/2 space-y-1'>
                        <label className='text-sm text-neutral-400'>Duplicate Status</label>
                        <select
                            value={options.isDuplicate}
                            onChange={(e) =>
                                handleOptionChange(
                                    optionType,
                                    'isDuplicate',
                                    e.target.value
                                )
                            }
                            className='dark-text-field w-full'
                        >
                            <option value=''>Any status</option>
                            <option value='yes'>Is duplicate</option>
                            <option value='no'>Not duplicate</option>
                        </select>
                    </div>
                </div>
            </div>
        );
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
                        <CircleStackIcon className='size-4' />,
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
                        <PaintBrushIcon className='size-4' />,
                    ]}
                    toggleLabels={['Highlight', 'Cluster', 'Edges']}
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
                            publishedBy=''
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