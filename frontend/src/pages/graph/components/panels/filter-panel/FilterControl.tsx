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
    DocumentTextIcon,
} from '@heroicons/react/24/solid';

interface FilterControlProps {
    initialShowSearchQueryModal: boolean;
    setInitialShowSearchQueryModal: (value: boolean) => void;
}

export const FilterControl: React.FC<FilterControlProps> = ({
    initialShowSearchQueryModal,
    setInitialShowSearchQueryModal,
}) => {
    // ====================== State Management ======================
    
    const [dataSourceIndex, setDataSourceIndex] = useState(0);
    const [showArticleSearchModal, setShowArticleSearchModal] = useState(false);
    const [visualisationOption, setVisualisationOption] = useState(0);
    
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [nodeQty, setNodeQty] = useState<number>(0);
    const [showQuerySummaryModal, setShowQuerySummaryModal] = useState(false);

    // Initialize with default or stored values
    const [prevHighlightColor, setPrevHighlightColor] = useState(() => 
        localStorage.getItem('prevHighlightColor') || DEFAULT_HIGHLIGHT_COLOR
    );
    const [prevClusterColor, setPrevClusterColor] = useState(() => 
        localStorage.getItem('prevClusterColor') || DEFAULT_CLUSTER_COLOR
    );
    const [prevEdgeColor, setPrevEdgeColor] = useState(() => 
        localStorage.getItem('prevEdgeColor') || DEFAULT_EDGE_COLOR
    );

    // Initialize visibility states with stored values if they exist
    const [highlightVisibility, setHighlightVisibility] = useState<VisibilityState>(() => {
        const stored = localStorage.getItem('highlightVisibility');
        return stored ? JSON.parse(stored) : { isActive: false };
    });
    
    const [clusterVisibility, setClusterVisibility] = useState<VisibilityState>(() => {
        const stored = localStorage.getItem('clusterVisibility');
        return stored ? JSON.parse(stored) : { isActive: false };
    });
    
    const [edgeVisibility, setEdgeVisibility] = useState<VisibilityState>(() => {
        const stored = localStorage.getItem('edgeVisibility');
        return stored ? JSON.parse(stored) : { isActive: false, mode: 'off' };
    });

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

    const colorPicker = useColorPicker();

    // ====================== Effects ======================

    // Effect for initial search query modal
    useEffect(() => {
        if (initialShowSearchQueryModal) {
            setShowArticleSearchModal(true);
            setInitialShowSearchQueryModal(false);
        }
    }, [initialShowSearchQueryModal, setInitialShowSearchQueryModal]);

    // Effect to reset all options on component mount
    useEffect(() => {
        resetHighlightOptions();
        resetClusterOptions();
        resetEdgeOptions();
    }, []);

    // Save states to localStorage when they change
    useEffect(() => {
        localStorage.setItem('prevHighlightColor', prevHighlightColor);
    }, [prevHighlightColor]);

    useEffect(() => {
        localStorage.setItem('prevClusterColor', prevClusterColor);
    }, [prevClusterColor]);

    useEffect(() => {
        localStorage.setItem('prevEdgeColor', prevEdgeColor);
    }, [prevEdgeColor]);

    useEffect(() => {
        localStorage.setItem('highlightVisibility', JSON.stringify(highlightVisibility));
    }, [highlightVisibility]);

    useEffect(() => {
        localStorage.setItem('clusterVisibility', JSON.stringify(clusterVisibility));
    }, [clusterVisibility]);

    useEffect(() => {
        localStorage.setItem('edgeVisibility', JSON.stringify(edgeVisibility));
    }, [edgeVisibility]);

    // ====================== Reset Handlers ======================

    const resetHighlightOptions = () => {
        setHighlightOptions(defaultOptions);
        setPrevHighlightColor(DEFAULT_HIGHLIGHT_COLOR);
        setHighlightColor(highlightVisibility.isActive ? DEFAULT_HIGHLIGHT_COLOR : INACTIVE_COLOR);
        setHighlightVisibility({ isActive: false });
        localStorage.removeItem('prevHighlightColor');
        localStorage.removeItem('highlightVisibility');
    };

    const resetClusterOptions = () => {
        setClusterOptions(defaultOptions);
        setPrevClusterColor(DEFAULT_CLUSTER_COLOR);
        setClusterColor(clusterVisibility.isActive ? DEFAULT_CLUSTER_COLOR : INACTIVE_COLOR);
        setClusterVisibility({ isActive: false });
        localStorage.removeItem('prevClusterColor');
        localStorage.removeItem('clusterVisibility');
    };

    const resetEdgeOptions = () => {
        setEdgeOptions(defaultEdgeOptions);
        setPrevEdgeColor(DEFAULT_EDGE_COLOR);
        setEdgeColor(edgeVisibility.mode !== 'off' ? DEFAULT_EDGE_COLOR : INACTIVE_COLOR);
        setEdgeVisibility({ isActive: false, mode: 'off' });
        localStorage.removeItem('prevEdgeColor');
        localStorage.removeItem('edgeVisibility');
    };

    // ====================== Visibility Handlers ======================

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
        const newMode = newState.mode ?? 'off';
        const currentMode = edgeVisibility.mode ?? 'off';
    
        const isSameColorGroup = ['hover', 'on'].includes(newMode) && 
                               ['hover', 'on'].includes(currentMode);
    
        if (newMode !== 'off') {
            if (isSameColorGroup) {
                setEdgeColor(edgeColor);
            } else {
                setEdgeColor(prevEdgeColor);
            }
        } else {
            setPrevEdgeColor(edgeColor);
            setEdgeColor(INACTIVE_COLOR);
        }
    
        setEdgeVisibility(newState);
        
        setEdgeOptions(prev => ({
            ...prev,
            visibility: newMode
        }));
    };

    const handleDataSourceChange = (index: number) => {
        setDataSourceIndex(index);
        if (index === 1) {
            setArticles(dummyArticles);
        }
    };

    // ====================== Render Component ======================
    return (
        <>
            <div className='backdrop-blur-xl border-neutral-700 border p-4 space-y-6 rounded-lg z-10 w-96'>
                <div className='flex items-center justify-between'>
                    <h1 className='flex gap-2 items-center font-semibold text-lg justify-center text-light'>
                        <AdjustmentsHorizontalIcon className='size-5' />
                        Data controls
                    </h1>
                    <div />
                </div>

                <Toggle
                    header={[
                        'Start New Dataset',
                        <CircleStackIcon className='size-4' key='data-source-icon' />,
                    ]}
                    noToggle={true}
                    selectedIndex={0}
                    onClick={() => {}}
                >
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
                </Toggle>

                <Toggle
                    header={[
                        'Visualisation options',
                        <PaintBrushIcon className='size-4' key='visualisation-icon' />,
                    ]}
                    toggleLabels={['Highlight', 'Cluster', 'Add New Edge']}
                    selectedIndex={visualisationOption}
                    onClick={setVisualisationOption}
                />

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
                            startDate={startDate || ''}
                            endDate={endDate || ''}
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