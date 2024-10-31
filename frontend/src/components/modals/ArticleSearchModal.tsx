import React from 'react';
import {
    ArrowUpRightIcon,
    CalendarDateRangeIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CubeTransparentIcon,
    MagnifyingGlassIcon,
    ShareIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import { BaseModal } from './BaseModal';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../Button';
import { Toggle } from '../Toggle';
import { useArticles } from '../../contexts/ArticlesContext';
import { fetchArticle } from '../../api';
import { ArticleTableModal } from './ArticleTableModal';

// List of news sources to choose from
const sources = [
    'theaustralian.com.au',
    'theguardian.com',
    'abc.net.au',
    'news.com.au',
    'heraldsun.com.au',
    'skynews.com.au',
    'afr.com',
    'smh.com.au',
    'dailytelegraph.com.au',
    'foxnews.com',
    'nytimes.com',
    'dailywire.com',
    'couriermail.com.au',
    'thewest.com.au',
    '7news.com.au',
    '9news.com.au',
    'theconversation.com',
    'nypost.com',
    'wsj.com',
    'wattsupwiththat.com',
    'breitbart.com',
    'newsmax.com',
    'naturalnews.com',
    'washingtontimes.com',
    'climatecentral.org',
    'skepticalscience.com',
    'realclimate.org',
    'climatedepot.com',
    'nationalgeographic.com',
    'scientificamerican.com',
    'sciencedaily.com',
    'phys.org',
];

// List of publishers to choose from
const publishers = ['None', 'Murdoch Media'];

type ArticleSearchModalProps = {
    onClose: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    nodeQty: number;
    setNodeQty: (qty: number) => void;
};

export const ArticleSearchModal = ({
    onClose,
    searchQuery,
    setSearchQuery,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    nodeQty,
    setNodeQty,
}: ArticleSearchModalProps) => {
    const { articles, setArticles } = useArticles();
    const [dateRangeIndex, setDateRangeIndex] = useState(0);
    const [nodeLimitIndex, setNodeLimitIndex] = useState(0);
    const [showSourcesDropdown, setShowSourcesDropdown] = useState(false);
    const [selectedSources, setSelectedSources] = useState<string[]>([]);
    const [showPublisherDropdown, setShowPublisherDropdown] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState('None');
    const [thinkTankRef, setThinkTankRef] = useState(false);
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Helpers to check if sources or publisher are selected
    const hasSourcesSelected = selectedSources.length > 0;
    const hasPublisherSelected = selectedPublisher !== 'None';

    // Function to fetch articles based on the search criteria
    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await fetchArticle(
                searchQuery,
                startDate,
                endDate,
                selectedSources,
                selectedPublisher === 'None' ? '' : selectedPublisher,
                thinkTankRef
            );
            setArticles(response);
        } catch (err: any) {
            console.error('Error fetching articles:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle date range selection
    // Function to handle date range selection
const handleDateRangeToggle = (index: number) => {
    setDateRangeIndex(index);
    const now = new Date();
    
    switch (index) {
        case 0: // All
            setStartDate('');
            break;
        case 1: // Custom
            return; // Do nothing, let the custom date inputs handle the dates
        default:
            setStartDate('');
            return;
    }
    setEndDate(now.toISOString().split('T')[0] + 'T23:59:59Z');
};

    // Function to limit the number of articles displayed
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

    // Update the node quantity when the articles change
    useEffect(() => {
        setNodeQty(articles?.length || 0);
    }, [articles]);

    // Function to generate the visualization
    const handleGenerateVisualisation = () => {
        handleLimitNodes();
        onClose();
    };

    // Function to handle source selection
    const handleSourceToggle = (source: string) => {
        if (!hasPublisherSelected) {
            setSelectedSources((prev) => {
                if (prev.includes(source)) {
                    return prev.filter((s) => s !== source);
                } else {
                    return [...prev, source];
                }
            });
        }
    };

    // Function to handle publisher selection
    const handlePublisherSelect = (publisher: string) => {
        if (!hasSourcesSelected) {
            setSelectedPublisher((prev) =>
                prev === publisher ? 'None' : publisher
            );
        }
    };

    return (
        <BaseModal onClose={onClose}>
            <div className='border-neutral-800 border rounded-lg mx-10 w-[400px]'>
                <div className='px-5 py-3 bg-neutral-900 rounded-t-lg grid grid-cols-3 items-center'>
                    <XMarkIcon
                        className='size-5 text-light cursor-pointer justify-self-start'
                        onClick={onClose}
                    />
                    <p className='text-light font-semibold text-xl text-center whitespace-nowrap'>
                        Database Search
                    </p>
                </div>
                <div className='p-5 space-y-5 backdrop-blur-xl'>
                    {/* database search module */}
                    <div className='dark-card p-3 space-y-3'>
                        <h2 className='flex gap-2 items-center font-semibold text-light'>
                            <MagnifyingGlassIcon className='size-4' />
                            Search Query
                        </h2>
                        <input
                            type='text'
                            value={searchQuery}
                            placeholder='E.g. Arson'
                            className='dark-text-field w-full'
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* date search module */}
                    <div className='dark-card p-2 space-y-2'>
                        {/* Sources Section */}
                        <div className='bg-neutral-800 rounded-lg px-2'>
                            <div className='flex justify-between'>
                                <p
                                    className={`text-light ${
                                        hasPublisherSelected ? 'opacity-50' : ''
                                    }`}
                                >
                                    Sources
                                </p>
                                {!hasPublisherSelected &&
                                    (showSourcesDropdown ? (
                                        <ChevronUpIcon
                                            className='size-4 fill-white cursor-pointer'
                                            onClick={() =>
                                                setShowSourcesDropdown(false)
                                            }
                                        />
                                    ) : (
                                        <ChevronDownIcon
                                            className='size-4 fill-white cursor-pointer'
                                            onClick={() =>
                                                setShowSourcesDropdown(true)
                                            }
                                        />
                                    ))}
                            </div>

                            <AnimatePresence>
                                {showSourcesDropdown &&
                                    !hasPublisherSelected && (
                                        <motion.div
                                            initial='collapsed'
                                            animate='open'
                                            exit='collapsed'
                                            variants={{
                                                open: {
                                                    opacity: 1,
                                                    height: 'auto',
                                                    marginTop: 8,
                                                },
                                                collapsed: {
                                                    opacity: 0,
                                                    height: 0,
                                                    marginTop: 0,
                                                },
                                            }}
                                            className='max-h-[150px] overflow-y-auto'
                                        >
                                            {sources.map((source) => (
                                                <div
                                                    key={source}
                                                    className='flex items-center gap-2 px-2 py-1 hover:bg-neutral-700 rounded'
                                                >
                                                    <input
                                                        type='checkbox'
                                                        id={source}
                                                        checked={selectedSources.includes(
                                                            source
                                                        )}
                                                        onChange={() =>
                                                            handleSourceToggle(
                                                                source
                                                            )
                                                        }
                                                        className='accent-neutral-300 size-4'
                                                    />
                                                    <label
                                                        htmlFor={source}
                                                        className='text-sm text-light cursor-pointer'
                                                    >
                                                        {source}
                                                    </label>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                            </AnimatePresence>
                        </div>

                        {/* Publishers Section */}
                        <div className='bg-neutral-800 rounded-lg px-2'>
                            <div className='flex justify-between'>
                                <p
                                    className={`text-light ${
                                        hasSourcesSelected ? 'opacity-50' : ''
                                    }`}
                                >
                                    Publishers
                                </p>
                                {!hasSourcesSelected &&
                                    (showPublisherDropdown ? (
                                        <ChevronUpIcon
                                            className='size-4 fill-white cursor-pointer'
                                            onClick={() =>
                                                setShowPublisherDropdown(false)
                                            }
                                        />
                                    ) : (
                                        <ChevronDownIcon
                                            className='size-4 fill-white cursor-pointer'
                                            onClick={() =>
                                                setShowPublisherDropdown(true)
                                            }
                                        />
                                    ))}
                            </div>

                            <AnimatePresence>
                                {showPublisherDropdown &&
                                    !hasSourcesSelected && (
                                        <motion.div
                                            initial='collapsed'
                                            animate='open'
                                            exit='collapsed'
                                            variants={{
                                                open: {
                                                    opacity: 1,
                                                    height: 'auto',
                                                    marginTop: 8,
                                                },
                                                collapsed: {
                                                    opacity: 0,
                                                    height: 0,
                                                    marginTop: 0,
                                                },
                                            }}
                                            className='max-h-[150px] overflow-y-auto'
                                        >
                                            {publishers.map((publisher) => (
                                                <div
                                                    key={publisher}
                                                    className='flex items-center gap-2 px-2 py-1 hover:bg-neutral-700 rounded'
                                                >
                                                    <input
                                                        type='radio'
                                                        id={`publisher-${publisher}`}
                                                        checked={
                                                            selectedPublisher ===
                                                            publisher
                                                        }
                                                        onChange={() =>
                                                            handlePublisherSelect(
                                                                publisher
                                                            )
                                                        }
                                                        className='accent-neutral-300 size-4'
                                                        name='publisher'
                                                    />
                                                    <label
                                                        htmlFor={`publisher-${publisher}`}
                                                        className='text-sm text-light cursor-pointer'
                                                    >
                                                        {publisher}
                                                    </label>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                            </AnimatePresence>
                        </div>

                        {/* Think Tank Section */}
                        <div className='bg-neutral-800 rounded-lg px-2'>
                            <div className='flex gap-2 items-center'>
                                <input
                                    type='checkbox'
                                    checked={thinkTankRef}
                                    onChange={(e) =>
                                        setThinkTankRef(e.target.checked)
                                    }
                                    className='accent-neutral-300 size-4'
                                />
                                <label className='text-sm text-light'>
                                    Contains think tank reference
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                    // In your JSX, update the Toggle component props
<Toggle
    header={[
        'Date range',
        <CalendarDateRangeIcon className='size-4' />,
    ]}
    toggleLabels={[
        'All',
        'Custom'
    ]}
    selectedIndex={dateRangeIndex}
    onClick={handleDateRangeToggle}
>
    <AnimatePresence>
        {dateRangeIndex === 1 && ( // Changed from 4 to 1 since we now only have two options
            <motion.div
                initial='collapsed'
                animate='open'
                exit='collapsed'
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
                <div className='flex justify-around p-2'>
                    <div className='space-y-1'>
                        <p className='text-light pl-1 text-sm'>
                            Start date
                        </p>
                        <input
                            type='date'
                            value={startDate.split('T')[0]}
                            onChange={(e) =>
                                setStartDate(e.target.value + 'T00:00:00Z')
                            }
                            className='bg-neutral-900 rounded-lg text-light p-2 focus:outline-none accent-white focus:border-neutral-300'
                        />
                    </div>
                    <div className='space-y-1'>
                        <p className='text-light pl-1 text-sm'>
                            End date
                        </p>
                        <input
                            type='date'
                            value={endDate.split('T')[0]}
                            onChange={(e) =>
                                setEndDate(e.target.value + 'T00:00:00Z')
                            }
                            className='bg-neutral-900 rounded-lg text-light p-2 focus:outline-none focus:border-neutral-300'
                        />
                    </div>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
    <div className='p-2'>
        <Button
            variant='secondary'
            className='flex items-center gap-2 justify-center w-full'
            isLoading={isLoading}
            onClick={handleSearch}
        >
            <MagnifyingGlassIcon className='size-4' />
            Search
        </Button>
    </div>
</Toggle>
                    </div>

                    {articles?.length! > 0 && (
                        <div className='flex justify-center'>
                            <Button
                                variant='rounded'
                                className='dark-gradient text-light border border-neutral-700 bg-neutral-900'
                                onClick={() => setShowArticleModal(true)}
                                isLoading={isLoading}
                            >
                                <p className='flex gap-2 justify-center items-center'>
                                    {articles?.length} articles loaded
                                    <ArrowUpRightIcon className='w-4 h-4' />
                                </p>
                            </Button>
                        </div>
                    )}

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
                        </div>
                    )}

                    {articles?.length! > 0 && (
                        <div className='flex justify-center'>
                            <Button
                                variant='action'
                                onClick={handleGenerateVisualisation}
                                className='w-full'
                            >
                                <p className='flex gap-2 justify-center items-center'>
                                    <CubeTransparentIcon className='w-4 h-4' />
                                    Generate visualisation
                                </p>
                            </Button>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {showArticleModal && articles && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.2 }}
                            className='fixed inset-0 z-50 flex items-center justify-center'
                        >
                            <ArticleTableModal
                                onClose={() => setShowArticleModal(false)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </BaseModal>
    );
};
