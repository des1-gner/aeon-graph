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
import 'react-datepicker/dist/react-datepicker.css';
import { AnimatePresence, motion } from 'framer-motion';
import ViewAllArticlesModal from './modals/ViewAllArticlesModal';
import { getNews } from '../api';
import { NewsArticle } from '../types/news-article';

interface SidePanelControlProps {
    onClose?: () => void;
}

const SidePanelControl = ({ onClose }: SidePanelControlProps) => {
    const [dataSourceIndex, setDataSourceIndex] = useState(0);
    const [dataRangeIndex, setDataRangeIndex] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [nodeLimit, setNodeLimit] = useState<number>();
    const [articles, setArticles] = useState<NewsArticle[]>();
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            try {
                const response = await getNews('apple', '2024-08-19');
                setArticles(response.articles);
            } catch (err: any) {
                console.error('Error fetching articles:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticles();
    }, []);

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
                                                    Start date
                                                </p>
                                                <input
                                                    type='date'
                                                    value={startDate}
                                                    onChange={(e) =>
                                                        setStartDate(
                                                            e.target.value
                                                        )
                                                    }
                                                    className='bg-neutral-900 rounded-lg text-light p-2 focus:outline-none focus:border-neutral-300'
                                                />
                                            </div>

                                            <div className='space-y-1'>
                                                <p className='text-light pl-1 text-sm'>
                                                    End date
                                                </p>
                                                <input
                                                    type='date'
                                                    value={endDate}
                                                    onChange={(e) =>
                                                        setEndDate(
                                                            e.target.value
                                                        )
                                                    }
                                                    className='bg-neutral-900 rounded-lg text-light p-2 focus:outline-none focus:border-neutral-300 accent-green-300'
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
                    >
                        <MagnifyingGlassIcon className='size-4' />
                        Search
                    </Button>
                </div>
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

                <div className='dark-card p-2 space-y-1 text-light'>
                    <p className='flex gap-2 items-center pb-1 font-semibold '>
                        <ShareIcon className='size-4' />
                        Node limit
                    </p>
                    <div className='flex items-center px-1 gap-3'>
                        <input
                            type='range'
                            className='w-full accent-green-300'
                            max={articles?.length}
                            value={nodeLimit}
                            onChange={(e) =>
                                setNodeLimit(Number(e.target.value))
                            }
                        />
                        {nodeLimit}
                    </div>
                </div>

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
                            className='accent-green-300 size-4'
                        />
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor='linksBetweenPages' className='text-sm'>
                            3D map
                        </label>
                        <input
                            type='checkbox'
                            id='linksBetweenPages'
                            className='accent-green-300 size-4'
                        />
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor='linksBetweenPages' className='text-sm'>
                            Sentiment
                        </label>
                        <input
                            type='checkbox'
                            id='linksBetweenPages'
                            className='accent-green-300 size-4'
                        />
                    </div>
                </div>

                <div className='space-y-2'>
                    <Button
                        variant='action'
                        onClick={onClose}
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
