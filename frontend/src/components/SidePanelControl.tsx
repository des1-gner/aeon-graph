import React, { useState, useEffect, useRef } from 'react';
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
    const [nodeLimitIndex, setNodeLimitIndex] = useState(0);
    const [showArticleSearchModal, setShowArticleSearchModal] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [nodeQty, setNodeQty] = useState<number | undefined>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [showQuerySummaryModal, setShowQuerySummaryModal] = useState(false);

    const [selectedBroadClaim, setSelectedBroadClaim] = useState('');
    const [selectedSubClaim, setSelectedSubClaim] = useState('');
    const [selectedSource, setSelectedSource] = useState('');
    const [hasThinktankReference, setHasThinktankReference] = useState('');
    const [isDuplicate, setIsDuplicate] = useState('');

    const {
        articles,
        setArticles,
        highlightedWord,
        setHighlightedWord,
        highlightColor,
        setHighlightColor,
        clusterColor,
        setClusterColor,
        edgeColor,
        setEdgeColor,
    } = useArticles();

    // Separate refs for each color picker
    const highlightColorPickerRef = useRef<HTMLDivElement>(null);
    const clusterColorPickerRef = useRef<HTMLDivElement>(null);
    const edgeColorPickerRef = useRef<HTMLDivElement>(null);

    // Separate state for showing each color picker
    const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
    const [showClusterColorPicker, setShowClusterColorPicker] = useState(false);
    const [showEdgeColorPicker, setShowEdgeColorPicker] = useState(false);

    useEffect(() => {
        setShowArticleSearchModal(true);
    }, []);

    const handleDataSourceChange = (index: number) => {
        setDataSourceIndex(index);
        if (index === 1) {
            setArticles(dummyArticles);
        }
    };

    useEffect(() => {
        setNodeQty(articles?.length || 0);
    }, [articles]);

    const handleLimitNodes = () => {
        if (nodeQty! < articles!.length) {
            let limitedArticles;
            switch (nodeLimitIndex) {
                case 0:
                    limitedArticles = [...articles!].sort((a, b) => {
                        return (
                            new Date(b.dateTime).getTime() -
                            new Date(a.dateTime).getTime()
                        );
                    });
                    break;
                case 1:
                    limitedArticles = [...articles!].sort((a, b) => {
                        return (
                            new Date(a.dateTime).getTime() -
                            new Date(b.dateTime).getTime()
                        );
                    });
                    break;
                case 2:
                    limitedArticles = [...articles!].sort(
                        () => 0.5 - Math.random()
                    );
                    break;
                default:
                    limitedArticles = [...articles!];
            }
            setArticles(limitedArticles.slice(0, nodeQty));
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

    const renderVisualisationOptions = () => (
        <div className='space-y-3'>
            <div className='flex items-center gap-2'>
                <div className='relative' ref={highlightColorPickerRef}>
                    <button
                        className='w-8 h-8 rounded-full border border-neutral-500'
                        style={{ backgroundColor: highlightColor }}
                        onClick={() => setShowHighlightColorPicker(!showHighlightColorPicker)}
                    />
                    {showHighlightColorPicker && (
                        <div className='absolute left-0 mt-2 z-10'>
                            <HexColorPicker color={highlightColor} onChange={setHighlightColor} />
                        </div>
                    )}
                </div>
                <span className='text-light'>Highlight color</span>
            </div>
            <div>
                <p className='text-light mb-1'>Filter on Article Body:</p>
                <input
                    type='text'
                    value={highlightedWord}
                    placeholder='E.g. wildfire'
                    className='dark-text-field w-full'
                    onChange={(e) => setHighlightedWord(e.target.value)}
                />
            </div>
            <div className='flex items-center gap-2'>
                <div className='relative' ref={clusterColorPickerRef}>
                    <button
                        className='w-8 h-8 rounded-full border border-neutral-500'
                        style={{ backgroundColor: clusterColor }}
                        onClick={() => setShowClusterColorPicker(!showClusterColorPicker)}
                    />
                    {showClusterColorPicker && (
                        <div className='absolute left-0 mt-2 z-10'>
                            <HexColorPicker color={clusterColor} onChange={setClusterColor} />
                        </div>
                    )}
                </div>
                <span className='text-light'>Cluster color</span>
            </div>
            <div className='flex items-center gap-2'>
                <div className='relative' ref={edgeColorPickerRef}>
                    <button
                        className='w-8 h-8 rounded-full border border-neutral-500'
                        style={{ backgroundColor: edgeColor }}
                        onClick={() => setShowEdgeColorPicker(!showEdgeColorPicker)}
                    />
                    {showEdgeColorPicker && (
                        <div className='absolute left-0 mt-2 z-10'>
                            <HexColorPicker color={edgeColor} onChange={setEdgeColor} />
                        </div>
                    )}
                </div>
                <span className='text-light'>Edge color</span>
            </div>
            {renderCommonDropdowns()}
        </div>
    );

    const renderCommonDropdowns = () => (
        <div className='space-y-3'>
            <select
                value={selectedBroadClaim}
                onChange={(e) => setSelectedBroadClaim(e.target.value)}
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
                value={selectedSubClaim}
                onChange={(e) => setSelectedSubClaim(e.target.value)}
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
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
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
                    value={hasThinktankReference}
                    onChange={(e) => setHasThinktankReference(e.target.value)}
                    className='dark-text-field w-1/2'
                >
                    <option value=''>Has thinktank reference</option>
                    <option value='yes'>Yes</option>
                    <option value='no'>No</option>
                </select>
                <select
                    value={isDuplicate}
                    onChange={(e) => setIsDuplicate(e.target.value)}
                    className='dark-text-field w-1/2'
                >
                    <option value=''>Is a duplicate</option>
                    <option value='yes'>Yes</option>
                    <option value='no'>No</option>
                </select>
            </div>
        </div>
    );

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

                <div className='dark-card p-3 space-y-3'>
                    <h2 className='flex gap-2 items-center font-semibold text-light'>
                        <PaintBrushIcon className='size-4' />
                        Visualization options
                    </h2>
                    {renderVisualisationOptions()}
                </div>

                {articles?.length! > 0 && (
                    <div className='dark-card p-2 space-y-3 text-light'>
                        <p className='flex gap-2 items-center pb-1 font-semibold '>
                            <ShareIcon className='size-4' />
                            Node quantity
                        </p>
                        <p>Limited by</p>
                        <Toggle
                            toggleLabels={['Latest', 'Oldest', 'Random']}
                            selectedIndex={nodeLimitIndex}
                            onClick={(index) => setNodeLimitIndex(index)}
                        />
                        <div className='flex items-center px-1 gap-3'>
                            <input
                                type='range'
                                className='w-full accent-neutral-300'
                                max={articles?.length}
                                min={1}
                                value={nodeQty}
                                onChange={(e) =>
                                    setNodeQty(Number(e.target.value))
                                }
                            />
                            <p className='w-5'>{nodeQty}</p>
                        </div>
                        <Button
                            variant='secondary'
                            className='flex items-center gap-2 justify-center w-full text-dark'
                            onClick={handleLimitNodes}
                        >
                            <ShareIcon className='size-4' />
                            Reduce nodes
                        </Button>
                    </div>
                )}

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