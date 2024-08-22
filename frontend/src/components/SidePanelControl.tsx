import { useEffect, useState } from 'react';
import Toggle from './Toggle';
import {
    AdjustmentsHorizontalIcon,
    ArrowUpRightIcon,
    CalendarDateRangeIcon,
    CircleStackIcon,
    CubeTransparentIcon,
    DocumentArrowUpIcon,
    PaintBrushIcon,
    MagnifyingGlassIcon,
    ShareIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import Button from './Button';
import { AnimatePresence, motion } from 'framer-motion';
import ViewAllArticlesModal from './modals/ViewAllArticlesModal';
import { getArticles, getNews } from '../api';
import { NewsArticle } from '../types/news-article';
import { useCachedArticles } from '../contexts/CachedArticleContext';

interface SidePanelControlProps {
    onClose?: () => void;
}

const SidePanelControl = ({ onClose }: SidePanelControlProps) => {
    const { cachedArticles, cacheArticles } = useCachedArticles();
    const [articles, setArticles] = useState<NewsArticle[] | undefined>(
        cachedArticles
    );
    const [dataSourceIndex, setDataSourceIndex] = useState(0);
    const [dataRangeIndex, setDataRangeIndex] = useState(0);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [nodeLimit, setNodeLimit] = useState<number>();

    const [showArticleModal, setShowArticleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const query = searchQuery || 'climate';
            const response = await getNews(query, fromDate);
            setArticles(response.articles);
        } catch (err: any) {
            console.error('Error fetching articles:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartVisualisation = () => {
        cacheArticles(articles!);
    };

    useEffect(() => {
        if (cachedArticles) {
            setArticles(cachedArticles);
        }
    }, [cachedArticles]);
    console.log('ARTICLES', articles);

    // const handleLambda = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await getArticles(fromDate, toDate);
    //         setArticles(response.articles);
    //     } catch (err: any) {
    //         console.error('Error fetching articles:', err);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    useEffect(() => {
        setNodeLimit(articles?.length);
    }, [articles]);

    return (
        <>
            <div className='bg-neutral-950 border-neutral-700 border p-4 space-y-8 rounded-lg z-10'>
                <div className='flex items-center justify-between'>
                    <div />
                    <h1 className='flex gap-2 items-center font-semibold text-lg justify-center text-light'>
                        <AdjustmentsHorizontalIcon className='size-5' />
                        Data controls
                    </h1>
                    <XMarkIcon
                        className='size-5 text-light cursor-pointer flex justify-start'
                        onClick={onClose}
                    />
                </div>
                <Toggle
                    header={[
                        'Data source',
                        <CircleStackIcon className='size-4' />,
                    ]}
                    toggleLabels={['Mock data', 'Saved data', 'Live data']}
                    selectedIndex={dataSourceIndex}
                    onClick={(index) => setDataSourceIndex(index)}
                />

                <div>
                    <input
                        type='text'
                        value={searchQuery}
                        placeholder='Search query'
                        className='dark-text-field'
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className='space-y-3'>
                    <div>
                        <Toggle
                            header={[
                                'Date range',
                                <CalendarDateRangeIcon className='size-4' />,
                            ]}
                            toggleLabels={[
                                'All',
                                'Day',
                                'Week',
                                'Month',
                                'Custom',
                            ]}
                            selectedIndex={dataRangeIndex}
                            onClick={(index) => setDataRangeIndex(index)}
                        >
                            <AnimatePresence>
                                {dataRangeIndex === 4 && (
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
                                                    From date
                                                </p>
                                                <input
                                                    type='date'
                                                    value={
                                                        fromDate.split('T')[0]
                                                    }
                                                    onChange={(e) =>
                                                        setFromDate(
                                                            e.target.value +
                                                                'T00:00:00Z'
                                                        )
                                                    }
                                                    className='bg-neutral-900 rounded-lg text-light p-2 focus:outline-none accent-white focus:border-neutral-300'
                                                />
                                            </div>

                                            <div className='space-y-1'>
                                                <p className='text-light pl-1 text-sm'>
                                                    To date
                                                </p>
                                                <input
                                                    type='date'
                                                    value={toDate.split('T')[0]}
                                                    onChange={(e) =>
                                                        setToDate(
                                                            e.target.value +
                                                                'T00:00:00Z'
                                                        )
                                                    }
                                                    className='bg-neutral-900 rounded-lg text-light p-2 focus:outline-none focus:border-neutral-300'
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Toggle>
                    </div>
                    <Button
                        variant='primary'
                        className='flex items-center gap-2 justify-center w-full'
                        isLoading={isLoading}
                        onClick={handleSearch}
                    >
                        <MagnifyingGlassIcon className='size-4' />
                        Search
                    </Button>
                </div>

                {articles?.length! > 0 && (
                    <div className='flex justify-center'>
                        <Button
                            variant='rounded'
                            onClick={() => setShowArticleModal(true)}
                            isLoading={isLoading}
                        >
                            <p className='flex gap-2 justify-center items-center'>
                                {articles?.length} articles found
                                <ArrowUpRightIcon className='w-4 h-4' />
                            </p>
                        </Button>
                    </div>
                )}

                {nodeLimit! > 0 && (
                    <div className='dark-card p-2 space-y-1 text-light'>
                        <p className='flex gap-2 items-center pb-1 font-semibold '>
                            <ShareIcon className='size-4' />
                            Node limit
                        </p>
                        <div className='flex items-center px-1 gap-3'>
                            <input
                                type='range'
                                className='w-full accent-neutral-300'
                                max={articles?.length}
                                min={1}
                                value={nodeLimit}
                                onChange={(e) =>
                                    setNodeLimit(Number(e.target.value))
                                }
                            />
                            {nodeLimit}
                        </div>
                    </div>
                )}

                <div className='dark-card p-2 space-y-1 text-light'>
                    <p className='flex gap-2 items-center pb-1 font-semibold'>
                        <PaintBrushIcon className='size-4' />
                        Visualisation options
                    </p>
                    <div className='flex justify-between items-center'>
                        <label htmlFor='linksBetweenPages' className='text-sm'>
                            Links between pages
                        </label>
                        <input
                            type='checkbox'
                            defaultChecked
                            id='linksBetweenPages'
                            className='accent-neutral-300 size-4'
                        />
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor='linksBetweenPages' className='text-sm'>
                            3D map
                        </label>
                        <input
                            type='checkbox'
                            id='linksBetweenPages'
                            className='accent-neutral-300 size-4'
                        />
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor='linksBetweenPages' className='text-sm'>
                            Sentiment
                        </label>
                        <input
                            type='checkbox'
                            id='linksBetweenPages'
                            className='accent-neutral-300 size-4'
                        />
                    </div>
                </div>

                <div className='space-y-2'>
                    <Button
                        variant='secondary'
                        onClick={handleStartVisualisation}
                        className='flex items-center gap-2 justify-center w-full'
                    >
                        <CubeTransparentIcon className='size-4' />
                        Start visualisation
                    </Button>
                    <Button
                        variant='primary'
                        className='flex items-center gap-2 justify-center w-full'
                    >
                        <DocumentArrowUpIcon className='size-4' />
                        Export to report
                    </Button>
                </div>
            </div>
            {showArticleModal && articles && (
                <ViewAllArticlesModal
                    articleData={articles}
                    onClose={() => setShowArticleModal(false)}
                />
            )}
        </>
    );
};

export default SidePanelControl;
