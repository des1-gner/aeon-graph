import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArticles } from '../../../contexts/ArticlesContext';
import { Toggle } from '../../common/toggle/Toggle';
import { Button } from '../../common/button/Button';
import { useColorPicker } from './hooks/useColorPicker';
import { HighlightOptions } from './components/options/HighlightOptions';
import { ClusterOptions } from './components/options/ClusterOptions';
import { EdgeOptions } from './components/options/EdgeOptions';
import { QuerySummaryModal } from '../../common/modals/QuerySummaryModal';
import { ArticleSearchModal } from '../../common/modals/ArticleSearchModal';
import { VisibilityState } from './types/interfaces';
import { dummyArticles } from '../../../three.js/types/article';
import { VisibilityType } from './types/interfaces';
import {
    DEFAULT_HIGHLIGHT_COLOR,
    DEFAULT_CLUSTER_COLOR,
    DEFAULT_EDGE_COLOR,
    INACTIVE_COLOR,
    defaultOptions,
    defaultEdgeOptions,
} from './constants/default';
import {
    AdjustmentsHorizontalIcon,
    CircleStackIcon,
    PaintBrushIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/solid';

/**
 * Props interface for the FilterControl component
 */
interface FilterControlProps {
    onClose?: () => void;                                          // Optional callback for closing the filter control
    initialShowSearchQueryModal: boolean;                          // Flag to show search query modal on initial render
    setInitialShowSearchQueryModal: (value: boolean) => void;      // Setter for initialShowSearchQueryModal
}

/**
 * FilterControl Component
 * 
 * A comprehensive control panel for managing article filtering, visualization options,
 * and data source selection. Provides interfaces for highlighting, clustering, and edge
 * manipulation in the visualization.
 */
export const FilterControl: React.FC<FilterControlProps> = ({
    onClose,
    initialShowSearchQueryModal,
    setInitialShowSearchQueryModal,
}) => {
    // ====================== State Management ======================
    
    // Data source related states
    const [dataSourceIndex, setDataSourceIndex] = useState(0);                     // 0: Database, 1: Demo
    const [showArticleSearchModal, setShowArticleSearchModal] = useState(false);   // Controls article search modal visibility
    const [visualisationOption, setVisualisationOption] = useState(0);            // Current visualization option index
    
    // Search parameters states
    const [startDate, setStartDate] = useState('');                               // Start date for article search
    const [endDate, setEndDate] = useState('');                                   // End date for article search
    const [searchQuery, setSearchQuery] = useState('');                           // Search query string
    const [nodeQty, setNodeQty] = useState<number>(0);                           // Number of nodes to display
    const [showQuerySummaryModal, setShowQuerySummaryModal] = useState(false);    // Controls query summary modal visibility

    // Color management states
    const [prevHighlightColor, setPrevHighlightColor] = useState(DEFAULT_HIGHLIGHT_COLOR);  // Previous highlight color
    const [prevClusterColor, setPrevClusterColor] = useState(DEFAULT_CLUSTER_COLOR);        // Previous cluster color
    const [prevEdgeColor, setPrevEdgeColor] = useState(DEFAULT_EDGE_COLOR);                 // Previous edge color

    // Visibility management states
    const [highlightVisibility, setHighlightVisibility] = useState<VisibilityState>({ isActive: false });
    const [clusterVisibility, setClusterVisibility] = useState<VisibilityState>({ isActive: false });
    const [edgeVisibility, setEdgeVisibility] = useState<VisibilityState>({
        isActive: false,
        mode: 'off',
    });

    // Context and custom hooks
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

    const colorPicker = useColorPicker();  // Custom hook for color picking functionality

    // ====================== Effects ======================

    /**
     * Effect to handle initial search query modal display
     */
    useEffect(() => {
        if (initialShowSearchQueryModal) {
            setShowArticleSearchModal(true);
            setInitialShowSearchQueryModal(false);
        }
    }, [initialShowSearchQueryModal, setInitialShowSearchQueryModal]);

    /**
     * Effect to reset all options on component mount
     */
    useEffect(() => {
        resetHighlightOptions();
        resetClusterOptions();
        resetEdgeOptions();
    }, []);

    // ====================== Reset Handlers ======================

    /**
     * Resets highlight options to their default values
     */
    const resetHighlightOptions = () => {
        setHighlightOptions(defaultOptions);
        setPrevHighlightColor(DEFAULT_HIGHLIGHT_COLOR);
        setHighlightColor(highlightVisibility.isActive ? DEFAULT_HIGHLIGHT_COLOR : INACTIVE_COLOR);
        setHighlightVisibility({ isActive: false });
    };

    /**
     * Resets cluster options to their default values
     */
    const resetClusterOptions = () => {
        setClusterOptions(defaultOptions);
        setPrevClusterColor(DEFAULT_CLUSTER_COLOR);
        setClusterColor(clusterVisibility.isActive ? DEFAULT_CLUSTER_COLOR : INACTIVE_COLOR);
        setClusterVisibility({ isActive: false });
    };

    /**
     * Resets edge options to their default values
     */
    const resetEdgeOptions = () => {
        setEdgeOptions(defaultEdgeOptions);
        setPrevEdgeColor(DEFAULT_EDGE_COLOR);
        setEdgeColor(edgeVisibility.mode !== 'off' ? DEFAULT_EDGE_COLOR : INACTIVE_COLOR);
        setEdgeVisibility({ isActive: false, mode: 'off' });
    };

    // ====================== Visibility Handlers ======================

    /**
     * Handles changes in highlight visibility state
     * @param newState - New visibility state
     */
    const handleHighlightVisibilityChange = (newState: VisibilityState) => {
        if (newState.isActive) {
            setHighlightColor(prevHighlightColor);
        } else {
            setPrevHighlightColor(highlightColor);
            setHighlightColor(INACTIVE_COLOR);
        }
        setHighlightVisibility(newState);
    };

    /**
     * Handles changes in cluster visibility state
     * @param newState - New visibility state
     */
    const handleClusterVisibilityChange = (newState: VisibilityState) => {
        if (newState.isActive) {
            setClusterColor(prevClusterColor);
        } else {
            setPrevClusterColor(clusterColor);
            setClusterColor(INACTIVE_COLOR);
        }
        setClusterVisibility(newState);
    };

    /**
     * Handles changes in edge visibility state
     * @param newState - New visibility state
     */
    const handleEdgeVisibilityChange = (newState: VisibilityState) => {
        if (newState.mode !== 'off') {
            setEdgeColor(prevEdgeColor);
        } else {
            setPrevEdgeColor(edgeColor);
            setEdgeColor(INACTIVE_COLOR);
        }
        setEdgeVisibility(newState);
        
        // Ensure visibility is always set to a valid VisibilityType
        const newVisibility: VisibilityType = newState.mode ?? 'off';
        setEdgeOptions(prev => ({
            ...prev,
            visibility: newVisibility
        }));
    };

    /**
     * Handles changes in data source selection
     * @param index - Index of selected data source (0: Database, 1: Demo)
     */
    const handleDataSourceChange = (index: number) => {
        setDataSourceIndex(index);
        if (index === 1) {
            setArticles(dummyArticles);
        }
    };

    // ====================== Render Component ======================
    return (
        <>
            {/* Main Filter Control Panel */}
            <div className='backdrop-blur-xl border-neutral-700 border p-4 space-y-6 rounded-lg z-10 w-96'>
                {/* Header Section */}
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

                {/* Data Source Toggle */}
                <Toggle
                    header={[
                        'Data source',
                        <CircleStackIcon className='size-4' key='data-source-icon' />,
                    ]}
                    toggleLabels={['Database', 'Demo']}
                    selectedIndex={dataSourceIndex}
                    onClick={handleDataSourceChange}
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

                {/* Visualization Options Toggle */}
                <Toggle
                    header={[
                        'Visualisation options',
                        <PaintBrushIcon className='size-4' key='visualisation-icon' />,
                    ]}
                    toggleLabels={['Highlight', 'Cluster', 'Add New Edge']}
                    selectedIndex={visualisationOption}
                    onClick={setVisualisationOption}
                />

                {/* Visualization Options Content */}
                <div className='dark-card p-3'>
                    {visualisationOption === 0 && (
                        <HighlightOptions
                            options={highlightOptions}
                            setOptions={setHighlightOptions}
                            color={highlightColor}
                            setColor={setHighlightColor}
                            colorPickerState={colorPicker}
                            onReset={resetHighlightOptions}
                            highlightVisibility={highlightVisibility}
                            onVisibilityChange={handleHighlightVisibilityChange}
                        />
                    )}

                    {visualisationOption === 1 && (
                        <ClusterOptions
                            options={clusterOptions}
                            setOptions={setClusterOptions}
                            color={clusterColor}
                            setColor={setClusterColor}
                            colorPickerState={colorPicker}
                            onReset={resetClusterOptions}
                            highlightVisibility={clusterVisibility}
                            onVisibilityChange={handleClusterVisibilityChange}
                        />
                    )}

                    {visualisationOption === 2 && (
                        <EdgeOptions
                            options={edgeOptions}
                            setOptions={setEdgeOptions}
                            color={edgeColor}
                            setColor={setEdgeColor}
                            colorPickerState={colorPicker}
                            onReset={resetEdgeOptions}
                            highlightVisibility={edgeVisibility}
                            onVisibilityChange={handleEdgeVisibilityChange}
                        />
                    )}
                </div>

                {/* Query Summary Button */}
                <Button
                    variant='primary'
                    className='flex items-center gap-2 justify-center w-full'
                    onClick={() => setShowQuerySummaryModal(true)}
                >
                    <DocumentTextIcon className='size-4' />
                    Query summary
                </Button>
            </div>

            {/* Article Search Modal */}
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

            {/* Query Summary Modal */}
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
                            publishedBy={searchQuery}
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

export default FilterControl;