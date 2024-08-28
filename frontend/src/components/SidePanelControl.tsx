import { useEffect, useState } from 'react';
import Toggle from './Toggle';
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
} from '@heroicons/react/24/solid';
import Button from './Button';
import { AnimatePresence, motion } from 'framer-motion';
import ViewAllArticlesModal from './modals/ViewAllArticlesModal';
import { getLambda } from '../api';
import { useArticles } from '../contexts/ArticlesContext';
import { Article } from '../types/article';

type SidePanelControlProps = {
    onClose?: () => void;
};

const SidePanelControl = ({ onClose }: SidePanelControlProps) => {
    const { articles, setArticles } = useArticles();
    const [updatedNodeArray, setUpdatedNodeArray] = useState<Article[]>();
    const [dataSourceIndex, setDataSourceIndex] = useState(0);
    const [dataRangeIndex, setDataRangeIndex] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [nodeQty, setNodeQty] = useState<number | undefined>(0);
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const response = await getLambda();
            setArticles(response.body);
        } catch (err: any) {
            console.error('Error fetching articles:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const createUpdatedNodeArray = () => {
        if (nodeQty !== articles?.length) {
            const updatedArray = articles?.slice(0, nodeQty);
            setUpdatedNodeArray(updatedArray);
            console.log(updatedArray?.length);
        }
    };

    const handleStartVisualisation = () => {
        createUpdatedNodeArray();
    };

    useEffect(() => {
        setNodeQty(articles?.length);
    }, [articles]);

    const handleDateRangeToggle = (index: number) => {
        setDataRangeIndex(index);
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

    return (
        <>
            <div className='bg-neutral-950 border-neutral-700 border p-4 space-y-8 rounded-lg z-10'>
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
                    toggleLabels={['Database', 'Demo data']}
                    selectedIndex={dataSourceIndex}
                    onClick={(index) => setDataSourceIndex(index)}
                />

                {/* <div className='dark-card p-2 space-y-3'>
                        <h2 className='flex gap-2 items-center font-semibold text-light'>
                            <MagnifyingGlassIcon className='size-4' />
                            Search options
                        </h2>
                        <input
                            type='text'
                            value={searchQuery}
                            placeholder='Search query'
                            className='dark-text-field'
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div> */}

                <div>
                    <Toggle
                        header={[
                            'Date range',
                            <CalendarDateRangeIcon className='size-4' />,
                        ]}
                        toggleLabels={['All', 'Day', 'Week', 'Month', 'Custom']}
                        selectedIndex={dataRangeIndex}
                        onClick={handleDateRangeToggle}
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
                                                value={startDate.split('T')[0]}
                                                onChange={(e) =>
                                                    setStartDate(
                                                        e.target.value +
                                                            'T00:00:00Z'
                                                    )
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
                                                    setEndDate(
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
                        {articles?.length! > 0 && (
                            <div className='flex justify-center py-4'>
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
                    </Toggle>
                </div>

                {articles?.length! > 0 && (
                    <div className='dark-card p-2 space-y-1 text-light'>
                        <p className='flex gap-2 items-center pb-1 font-semibold '>
                            <ShareIcon className='size-4' />
                            Node quantity
                        </p>
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
                            {nodeQty}
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
                            Sentiment analysis
                        </label>
                        <input
                            type='checkbox'
                            id='linksBetweenPages'
                            className='accent-neutral-300 size-4'
                        />
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor='linksBetweenPages' className='text-sm'>
                            3D
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
                        variant='action'
                        className='flex items-center gap-2 justify-center w-full'
                        onClick={handleStartVisualisation}
                    >
                        <CubeTransparentIcon className='size-4' />
                        Start visualisation
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
                        className='fixed inset-0 z-50 flex items-center justify-center'
                    >
                        <ViewAllArticlesModal
                            onClose={() => setShowArticleModal(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SidePanelControl;
