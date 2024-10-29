import React, { useEffect, useState, useRef } from 'react';
import { Toggle } from './Toggle';
import {
    AdjustmentsHorizontalIcon,
    CircleStackIcon,
    PaintBrushIcon,
    MagnifyingGlassIcon,
    ShareIcon,
    XMarkIcon,
    DocumentTextIcon,
    EyeIcon,
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

type SidePanelControlProps = {
    onClose?: () => void;
};

export const SidePanelControl = ({ onClose }: SidePanelControlProps) => {
    const [dataSourceIndex, setDataSourceIndex] = useState(0);
    const [showArticleSearchModal, setShowArticleSearchModal] = useState(false);
    const [visualisationOption, setVisualisationOption] = useState(0);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [nodeQty, setNodeQty] = useState<number>(0);
    const [showQuerySummaryModal, setShowQuerySummaryModal] = useState(false);

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

    // Separate state for showing each color picker
    const [showHighlightColorPicker, setShowHighlightColorPicker] =
        useState(false);
    const [showClusterColorPicker, setShowClusterColorPicker] = useState(false);
    const [showEdgeColorPicker, setShowEdgeColorPicker] = useState(false);

    // Separate refs for each color picker
    const highlightColorPickerRef = useRef<HTMLDivElement>(null);
    const clusterColorPickerRef = useRef<HTMLDivElement>(null);
    const edgeColorPickerRef = useRef<HTMLDivElement>(null);

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

    const renderVisualisationOptions = () => {
        switch (visualisationOption) {
            case 0: // Highlight
                return (
                    <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
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
                        <div>
                            <p className='text-light mb-1'>
                                Filter on Article Body:
                            </p>
                            <input
                                type='text'
                                value={highlightOptions.articleBody}
                                placeholder='E.g. wildfire'
                                className='dark-text-field w-full'
                                onChange={(e) =>
                                    handleOptionChange(
                                        'highlight',
                                        'articleBody',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        {renderCommonDropdowns('highlight')}
                    </div>
                );
                case 1: // Cluster
                return (
                    <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
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
                        <div>
                            <p className='text-light mb-1'>
                                Filter on Article Body:
                            </p>
                            <input
                                type='text'
                                value={clusterOptions.articleBody}
                                placeholder='E.g. wildfire'
                                className='dark-text-field w-full'
                                onChange={(e) =>
                                    handleOptionChange(
                                        'cluster',
                                        'articleBody',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        {renderCommonDropdowns('cluster')}
                    </div>
                );
            case 2: // Edges
                return (
                    <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
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
                        <div>
                            <p className='text-light mb-1'>Edge Visibility:</p>
                            <select
                                value={edgeOptions.visibility}
                                onChange={(e) =>
                                    handleOptionChange(
                                        'edge',
                                        'visibility',
                                        e.target.value
                                    )
                                }
                                className='dark-text-field w-full'
                            >
                                <option value='on'>On</option>
                                <option value='hover'>Hover</option>
                                <option value='off'>Off</option>
                            </select>
                        </div>
                        <div>
                            <p className='text-light mb-1'>
                                Filter on Article Body:
                            </p>
                            <input
                                type='text'
                                value={edgeOptions.articleBody}
                                placeholder='E.g. wildfire'
                                className='dark-text-field w-full'
                                onChange={(e) =>
                                    handleOptionChange(
                                        'edge',
                                        'articleBody',
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                        {renderCommonDropdowns('edge')}
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
                    <option value=''>Select broad claim</option>
                    {Object.entries(broadClaims).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
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
                    <option value=''>Select sub-claim</option>
                    {Object.entries(subClaims).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
                <select
                    value={options.source}
                    onChange={(e) =>
                        handleOptionChange(optionType, 'source', e.target.value)
                    }
                    className='dark-text-field w-full'
                >
                    <option value=''>Select source</option>
                    {sources.map((source) => (
                        <option key={source} value={source}>
                            {source}
                        </option>
                    ))}
                </select>
                <div className='flex gap-2'>
                    <select
                        value={options.think_tank_ref}
                        onChange={(e) =>
                            handleOptionChange(
                                optionType,
                                'think_tank_ref',
                                e.target.value
                            )
                        }
                        className='dark-text-field w-1/2'
                    >
                        <option value=''>Has thinktank reference</option>
                        <option value='yes'>Yes</option>
                        <option value='no'>No</option>
                    </select>
                    <select
                        value={options.isDuplicate}
                        onChange={(e) =>
                            handleOptionChange(
                                optionType,
                                'isDuplicate',
                                e.target.value
                            )
                        }
                        className='dark-text-field w-1/2'
                    >
                        <option value=''>Is a duplicate</option>
                        <option value='yes'>Yes</option>
                        <option value='no'>No</option>
                    </select>
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

                <div className='dark-card p-3 space-y-3'>
                    <h2 className='flex gap-2 items-center font-semibold text-light'>
                        <EyeIcon className='size-4' />
                        {visualisationOption === 0
                            ? 'Highlight'
                            : visualisationOption === 1
                            ? 'Cluster'
                            : 'Edges'}
                    </h2>
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
