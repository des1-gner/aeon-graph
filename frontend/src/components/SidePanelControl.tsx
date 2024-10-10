import React, { useEffect, useState, useRef } from 'react';
import { Toggle } from './Toggle';
import {
    AdjustmentsHorizontalIcon,
    ArrowUpRightIcon,
    CalendarDateRangeIcon,
    CircleStackIcon,
    CubeTransparentIcon,
    PaintBrushIcon,
    MagnifyingGlassIcon,
    ShareIcon,
    XMarkIcon,
    DocumentTextIcon,
    EyeIcon,
} from '@heroicons/react/24/solid';
import { Button } from './Button';
import { AnimatePresence, motion } from 'framer-motion';
import { ArticleTableModal } from './modals/ArticleTableModal';
import { fetchArticle } from '../api';
import { useArticles } from '../contexts/ArticlesContext';
import { dummyArticles } from '../types/article';
import { QuerySummaryModal } from './modals/QuerySummaryModal';
import { HexColorPicker } from 'react-colorful';

type SidePanelControlProps = {
    onClose?: () => void;
};

export const SidePanelControl = ({ onClose }: SidePanelControlProps) => {
    const { articles, setArticles, highlightedWord, setHighlightedWord, highlightColor, setHighlightColor } =
        useArticles();
    const [dataSourceIndex, setDataSourceIndex] = useState(0);
    const [dateRangeIndex, setDateRangeIndex] = useState(0);
    const [nodeLimitIndex, setNodeLimitIndex] = useState(0);
    const [visualisationOption, setVisualisationOption] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [nodeQty, setNodeQty] = useState<number | undefined>(0);
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showQuerySummaryModal, setShowQuerySummaryModal] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);

    // New state variables for cluster and edge colors
    const [clusterColor, setClusterColor] = useState('#FF5733');
    const [edgeColor, setEdgeColor] = useState('#33FF57');
    const [showClusterColorPicker, setShowClusterColorPicker] = useState(false);
    const [showEdgeColorPicker, setShowEdgeColorPicker] = useState(false);

    const colorPickerRef = useRef<HTMLDivElement>(null);
    const clusterColorPickerRef = useRef<HTMLDivElement>(null);
    const edgeColorPickerRef = useRef<HTMLDivElement>(null);

    // New state for visualization options
    const [clusterBy, setClusterBy] = useState('');
    const [edgeType, setEdgeType] = useState('');
    const [claimsIdentified, setClaimsIdentified] = useState('');
    const [subclaims, setSubclaims] = useState('');
    const [author, setAuthor] = useState('');
    const [source, setSource] = useState('');
    const [hasThinktankReference, setHasThinktankReference] = useState('');
    const [isDuplicate, setIsDuplicate] = useState('');

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await fetchArticle(
                searchQuery,
                startDate,
                endDate
            );
            setArticles(response);
        } catch (err: any) {
            console.error('Error fetching articles:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDataSourceChange = (index: number) => {
        setDataSourceIndex(index);
        if (index === 1) {
            setArticles(dummyArticles);
        }
    };

    useEffect(() => {
        setNodeQty(articles?.length || 0);
    }, [articles]);

    const handleDateRangeToggle = (index: number) => {
        setDateRangeIndex(index);
        const now = new Date();
        let from = new Date();

        switch (index) {
            case 0:
                setStartDate('');
                break;
            case 1:
                from.setDate(now.getDate() - 1);
                break;
            case 2:
                from.setDate(now.getDate() - 7);
                break;
            case 3:
                from.setMonth(now.getMonth() - 1);
                break;
            case 4:
                return;
            default:
                setStartDate('');
                return;
        }
        setStartDate(from.toISOString().split('T')[0] + 'T00:00:00Z');
        setEndDate(now.toISOString().split('T')[0] + 'T23:59:59Z');
    };

    const handleStartPlayback = () => {
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
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
                setShowColorPicker(false);
            }
            if (clusterColorPickerRef.current && !clusterColorPickerRef.current.contains(event.target as Node)) {
                setShowClusterColorPicker(false);
            }
            if (edgeColorPickerRef.current && !edgeColorPickerRef.current.contains(event.target as Node)) {
                setShowEdgeColorPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const renderVisualisationOptions = () => {
        switch (visualisationOption) {
            case 0: // Highlight
                return (
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={highlightedWord}
                            placeholder="E.g. Wildfire"
                            className="dark-text-field w-full"
                            onChange={(e) => setHighlightedWord(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={colorPickerRef}>
                                <button
                                    className="w-8 h-8 rounded-full border border-neutral-500"
                                    style={{ backgroundColor: highlightColor }}
                                    onClick={() => setShowColorPicker(!showColorPicker)}
                                />
                                {showColorPicker && (
                                    <div className="absolute right-0 mt-2 z-10">
                                        <HexColorPicker color={highlightColor} onChange={setHighlightColor} />
                                    </div>
                                )}
                            </div>
                            <span className="text-light">Select highlight color</span>
                        </div>
                        {renderCommonDropdowns()}
                    </div>
                );
            case 1: // Cluster
                return (
                    <div className="space-y-3">
                        <select
                            value={clusterBy}
                            onChange={(e) => setClusterBy(e.target.value)}
                            className="dark-text-field w-full"
                        >
                            <option value="">Select cluster type</option>
                            <option value="topic">By Topic</option>
                            <option value="source">By Source</option>
                            <option value="date">By Date</option>
                        </select>
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={clusterColorPickerRef}>
                                <button
                                    className="w-8 h-8 rounded-full border border-neutral-500"
                                    style={{ backgroundColor: clusterColor }}
                                    onClick={() => setShowClusterColorPicker(!showClusterColorPicker)}
                                />
                                {showClusterColorPicker && (
                                    <div className="absolute right-0 mt-2 z-10">
                                        <HexColorPicker color={clusterColor} onChange={setClusterColor} />
                                    </div>
                                )}
                            </div>
                            <span className="text-light">Select cluster color</span>
                        </div>
                        {renderCommonDropdowns()}
                    </div>
                );
            case 2: // Edges
                return (
                    <div className="space-y-3">
                        <select
                            value={edgeType}
                            onChange={(e) => setEdgeType(e.target.value)}
                            className="dark-text-field w-full"
                        >
                            <option value="">Select edge type</option>
                            <option value="similarity">Similarity</option>
                            <option value="citation">Citation</option>
                            <option value="temporal">Temporal</option>
                        </select>
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={edgeColorPickerRef}>
                                <button
                                    className="w-8 h-8 rounded-full border border-neutral-500"
                                    style={{ backgroundColor: edgeColor }}
                                    onClick={() => setShowEdgeColorPicker(!showEdgeColorPicker)}
                                />
                                {showEdgeColorPicker && (
                                    <div className="absolute right-0 mt-2 z-10">
                                        <HexColorPicker color={edgeColor} onChange={setEdgeColor} />
                                    </div>
                                )}
                            </div>
                            <span className="text-light">Select edge color</span>
                        </div>
                        {renderCommonDropdowns()}
                    </div>
                );
            default:
                return null;
        }
    };

    const renderCommonDropdowns = () => (
        <>
            <select
                value={claimsIdentified}
                onChange={(e) => setClaimsIdentified(e.target.value)}
                className="dark-text-field w-full"
            >
                <option value="">Claims identified</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <select
                value={subclaims}
                onChange={(e) => setSubclaims(e.target.value)}
                className="dark-text-field w-full"
            >
                <option value="">Subclaims</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <input
                type="text"
                value={author}
                placeholder="Author"
                onChange={(e) => setAuthor(e.target.value)}
                className="dark-text-field w-full"
            />
            <input
                type="text"
                value={source}
                placeholder="Source"
                onChange={(e) => setSource(e.target.value)}
                className="dark-text-field w-full"
            />
            <select
                value={hasThinktankReference}
                onChange={(e) => setHasThinktankReference(e.target.value)}
                className="dark-text-field w-full"
            >
                <option value="">Has thinktank reference</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
            <select
                value={isDuplicate}
                onChange={(e) => setIsDuplicate(e.target.value)}
                className="dark-text-field w-full"
            >
                <option value="">Is a duplicate</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </>
    );

    return (
        <>
            <div className="backdrop-blur-xl border-neutral-700 border p-4 space-y-8 rounded-lg z-10 min-w-[385px]">
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
                    toggleLabels={['Database', 'Demo data']}
                    selectedIndex={dataSourceIndex}
                    onClick={(index) => handleDataSourceChange(index)}
                />

                <div className="dark-card p-2 space-y-3">
                    <h2 className="flex gap-2 items-center font-semibold text-light">
                        <MagnifyingGlassIcon className="size-4" />
                        Search
                    </h2>
                    <input
                        type="text"
                        value={searchQuery}
                        placeholder="Search query"
                        className="dark-text-field"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {dataSourceIndex === 0 && (
                    <div>
                        <Toggle
                            header={[
                                'Date range',
                                <CalendarDateRangeIcon className="size-4" />,
                            ]}
                            toggleLabels={[
                                'All',
                                'Day',
                                'Week',
                                'Month',
                                'Custom',
                            ]}
                            selectedIndex={dateRangeIndex}
                            onClick={handleDateRangeToggle}
                        >
                            <AnimatePresence>
                                {dateRangeIndex === 4 && (
                                    <motion.div
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        variants={{
                                            open: {
                                                opacity: 1,
                                                height: 'auto',
                                            },
                                            collapsed: {
                                                opacity: 0,
                                                height: 0,
                                            },
                                        }}
                                    >
                                        <div className="flex justify-around p-2">
                                            <div className="space-y-1">
                                                <p className="text-light pl-1 text-sm">
                                                    Start date
                                                </p>
                                                <input
                                                    type="date"
                                                    value={startDate.split('T')[0]}
                                                    onChange={(e) =>
                                                        setStartDate(
                                                            e.target.value +
                                                            'T00:00:00Z'
                                                        )
                                                    }
                                                    className="bg-neutral-900 rounded-lg text-light p-2 focus:outline-none accent-white focus:border-neutral-300"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-light pl-1 text-sm">
                                                    End date
                                                </p>
                                                <input
                                                    type="date"
                                                    value={endDate.split('T')[0]}
                                                    onChange={(e) =>
                                                        setEndDate(
                                                            e.target.value +
                                                            'T00:00:00Z'
                                                        )
                                                    }
                                                    className="bg-neutral-900 rounded-lg text-light p-2 focus:outline-none focus:border-neutral-300"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="p-2">
                                <Button
                                    variant="secondary"
                                    className="flex items-center gap-2 justify-center w-full"
                                    isLoading={isLoading}
                                    onClick={handleSearch}
                                >
                                    <MagnifyingGlassIcon className="size-4" />
                                    Search
                                </Button>
                            </div>
                        </Toggle>
                    </div>
                )}

                {articles?.length! > 0 && (
                    <div className="flex justify-center">
                        <Button
                            variant="rounded"
                            className="dark-gradient text-light border border-neutral-700 bg-neutral-900"
                            onClick={() => setShowArticleModal(true)}
                            isLoading={isLoading}
                        >
                            <p className="flex gap-2 justify-center items-center">
                                {articles?.length} articles found
                                <ArrowUpRightIcon className="w-4 h-4" />
                            </p>
                        </Button>
                    </div>
                )}

                <Toggle
                    header={[
                        'Visualisation options',
                        <PaintBrushIcon className="size-4" />,
                    ]}
                    toggleLabels={['Highlight', 'Cluster', 'Edges']}
                    selectedIndex={visualisationOption}
                    onClick={(index) => setVisualisationOption(index)}
                />

                <div className="dark-card p-2 space-y-3">
                    <h2 className="flex gap-2 items-center font-semibold text-light">
                        <EyeIcon className="size-4" />
                        {visualisationOption === 0 ? 'Highlight' : visualisationOption === 1 ? 'Cluster' : 'Edges'}
                    </h2>
                    {renderVisualisationOptions()}
                </div>

                {articles?.length! > 0 && (
                    <div className="dark-card p-2 space-y-1 text-light">
                        <p className="flex gap-2 items-center pb-1 font-semibold ">
                            <ShareIcon className="size-4" />
                            Node quantity
                        </p>

                        <div className="flex justify-between">
                            <p>Limited by</p>
                            <p className="flex gap-1 items-center text-sm hover:underline hover:cursor-pointer">
                                Clear
                                <XMarkIcon className="size-4" />
                            </p>
                        </div>
                        <Toggle
                            toggleLabels={['Latest', 'Oldest', 'Random']}
                            selectedIndex={nodeLimitIndex}
                            onClick={(index) => setNodeLimitIndex(index)}
                        />
                        <div className="flex items-center px-1 gap-3">
                            <input
                                type="range"
                                className="w-full accent-neutral-300"
                                max={articles?.length}
                                min={1}
                                value={nodeQty}
                                onChange={(e) =>
                                    setNodeQty(Number(e.target.value))
                                }
                            />
                            <p className="w-5">{nodeQty}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Button
                        variant="action"
                        className="flex items-center gap-2 justify-center w-full"
                        onClick={handleStartPlayback}
                    >
                        <CubeTransparentIcon className="size-4" />
                        Start playback
                    </Button>
                    <Button
                        variant="primary"
                        className="flex items-center gap-2 justify-center w-full"
                        onClick={() => setShowQuerySummaryModal(true)}
                    >
                        <DocumentTextIcon className="size-4" />
                        Query summary
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {showArticleModal && articles && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                    >
                        <ArticleTableModal
                            onClose={() => setShowArticleModal(false)}
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
