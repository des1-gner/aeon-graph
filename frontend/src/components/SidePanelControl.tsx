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

const broadClaims = {
    "gw_not_happening": "global warming is not happening",
    "not_caused_by_human": "climate change is not caused by human activities",
    "impacts_not_bad": "climate change impacts are not that bad",
    "solutions_wont_work": "climate solutions won't work",
    "science_movement_unrel": "climate science or movement is unreliable",
    "individual_action": "individual action is pointless"
};

const subClaims = {
    "sc_cold_event_denial": "cold weather event disproves global warming",
    "sc_deny_extreme_weather": "extreme weather events are not increasing",
    "sc_natural_variations": "climate change is due to natural variations",
    "sc_past_climate_reference": "past climate changes prove current changes are natural",
    "sc_species_adapt": "species can adapt to climate change",
    "sc_downplay_warming": "warming is not as bad as predicted",
    "sc_policies_negative": "climate policies have negative consequences",
    "sc_policies_ineffective": "climate policies are ineffective",
    "sc_policies_difficult": "climate policies are too difficult to implement",
    "sc_low_support_policies": "there is low public support for climate policies",
    "sc_clean_energy_unreliable": "clean energy sources are unreliable",
    "sc_climate_science_unrel": "climate science is unreliable",
    "sc_no_consensus": "there is no scientific consensus on climate change",
    "sc_movement_unreliable": "the climate movement is unreliable",
    "sc_hoax_conspiracy": "climate change is a hoax or conspiracy"
};

const sources = [
    "theaustralian.com.au", "theguardian.com", "abc.net.au", "news.com.au",
    "heraldsun.com.au", "skynews.com.au", "afr.com", "smh.com.au",
    "dailytelegraph.com.au", "foxnews.com", "nytimes.com", "dailywire.com",
    "couriermail.com.au", "thewest.com.au", "7news.com.au", "9news.com.au",
    "theconversation.com", "nypost.com", "wsj.com", "wattsupwiththat.com",
    "breitbart.com", "newsmax.com", "naturalnews.com", "washingtontimes.com"
];

export const SidePanelControl = ({ onClose }: SidePanelControlProps) => {
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
        setEdgeColor
    } = useArticles();

    // Separate state for showing each color picker
    const [showHighlightColorPicker, setShowHighlightColorPicker] = useState(false);
    const [showClusterColorPicker, setShowClusterColorPicker] = useState(false);
    const [showEdgeColorPicker, setShowEdgeColorPicker] = useState(false);

    // Separate refs for each color picker
    const highlightColorPickerRef = useRef<HTMLDivElement>(null);
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

    // New state variables for selections
    const [selectedBroadClaim, setSelectedBroadClaim] = useState('');
    const [selectedSubClaim, setSelectedSubClaim] = useState('');
    const [selectedSource, setSelectedSource] = useState('');

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
            if (highlightColorPickerRef.current && !highlightColorPickerRef.current.contains(event.target as Node)) {
                setShowHighlightColorPicker(false);
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
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={highlightColorPickerRef}>
                                <button
                                    className="w-8 h-8 rounded-full border border-neutral-500"
                                    style={{ backgroundColor: highlightColor }}
                                    onClick={() => setShowHighlightColorPicker(!showHighlightColorPicker)}
                                />
                                {showHighlightColorPicker && (
                                    <div className="absolute left-0 mt-2 z-10">
                                        <HexColorPicker color={highlightColor} onChange={setHighlightColor} />
                                    </div>
                                )}
                            </div>
                            <span className="text-light">Highlight color</span>
                        </div>
                        <div>
                            <p className="text-light mb-1">Filter on Article Body:</p>
                            <input
                                type="text"
                                value={highlightedWord}
                                placeholder="E.g. wildfire"
                                className="dark-text-field w-full"
                                onChange={(e) => setHighlightedWord(e.target.value)}
                            />
                        </div>
                        {renderCommonDropdowns()}
                    </div>
                );
            case 1: // Cluster
                return (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={clusterColorPickerRef}>
                                <button
                                    className="w-8 h-8 rounded-full border border-neutral-500"
                                    style={{ backgroundColor: clusterColor }}
                                    onClick={() => setShowClusterColorPicker(!showClusterColorPicker)}
                                />
                                {showClusterColorPicker && (
                                    <div className="absolute left-0 mt-2 z-10">
                                        <HexColorPicker color={clusterColor} onChange={setClusterColor} />
                                    </div>
                                )}
                            </div>
                            <span className="text-light">Cluster color</span>
                        </div>
                        {renderCommonDropdowns()}
                    </div>
                );
            case 2: // Edges
                return (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={edgeColorPickerRef}>
                                <button
                                    className="w-8 h-8 rounded-full border border-neutral-500"
                                    style={{ backgroundColor: edgeColor }}
                                    onClick={() => setShowEdgeColorPicker(!showEdgeColorPicker)}
                                />
                                {showEdgeColorPicker && (
                                    <div className="absolute left-0 mt-2 z-10">
                                        <HexColorPicker color={edgeColor} onChange={setEdgeColor} />
                                    </div>
                                )}
                            </div>
                            <span className="text-light">Edge color</span>
                        </div>
                        {renderCommonDropdowns()}
                    </div>
                );
            default:
                return null;
        }
    };

    const renderCommonDropdowns = () => (
        <div className="space-y-3">
            <select
                value={selectedBroadClaim}
                onChange={(e) => setSelectedBroadClaim(e.target.value)}
                className="dark-text-field w-full"
            >
                <option value="">Select broad claim</option>
                {Object.entries(broadClaims).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
            </select>
            <select
                value={selectedSubClaim}
                onChange={(e) => setSelectedSubClaim(e.target.value)}
                className="dark-text-field w-full"
            >
                <option value="">Select sub-claim</option>
                {Object.entries(subClaims).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                ))}
            </select>
            <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="dark-text-field w-full"
            >
                <option value="">Select source</option>
                {sources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                ))}
            </select>
            <div className="flex gap-2">
                <select
                    value={hasThinktankReference}
                    onChange={(e) => setHasThinktankReference(e.target.value)}
                    className="dark-text-field w-1/2"
                >
                    <option value="">Has thinktank reference</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                <select
                    value={isDuplicate}
                    onChange={(e) => setIsDuplicate(e.target.value)}
                    className="dark-text-field w-1/2"
                >
                    <option value="">Is a duplicate</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
        </div>
    );

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
                />

                <div className="dark-card p-3 space-y-3">
                    <h2 className="flex gap-2 items-center font-semibold text-light">
                        <MagnifyingGlassIcon className="size-4" />
                        Search
                    </h2>
                    <input
                        type="text"
                        value={searchQuery}
                        placeholder="Search query"
                        className="dark-text-field w-full"
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

                <div className="dark-card p-3 space-y-3">
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
