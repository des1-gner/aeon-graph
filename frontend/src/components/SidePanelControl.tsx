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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Slider from 'rc-slider';
import '../styles/updated-slider.css';
import { AnimatePresence, motion } from 'framer-motion';
import { mockArticles } from '../types/raw-article';
import ViewAllArticlesModal from './modals/ViewAllArticlesModal';

interface SidePanelControlProps {
    onClose?: () => void;
}

const SidePanelControl = ({ onClose }: SidePanelControlProps) => {
    const [dataSourceIndex, setDataSourceIndex] = useState(0);
    const [dataRangeIndex, setDataRangeIndex] = useState(0);
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [nodeLimit, setNodeLimit] = useState<number | number[]>();
    const [articleCount, setArticleCount] = useState<number>();
    const [showArticleModal, setShowArticleModal] = useState(false);

    useEffect(() => {
        const fetchArticles = () => {
            setArticleCount(mockArticles.length);
            setNodeLimit(mockArticles.length);
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
                    <h2 className='flex gap-2 items-center font-semibold text-light'>
                        <MagnifyingGlassIcon className='size-4' />
                        Search options
                    </h2>
                    <input
                        className='dark-text-field'
                        type='text'
                        placeholder='Search for keywords'
                    />
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
                                        <div className='flex flex-col p-2 gap-2'>
                                            <DatePicker
                                                maxDate={endDate!}
                                                className='dark-text-field'
                                                selected={startDate}
                                                onChange={(date) =>
                                                    setStartDate(date)
                                                }
                                                dateFormat={'dd/MM/yyyy'}
                                                placeholderText='Start date'
                                                showTimeInput
                                            />
                                            <DatePicker
                                                minDate={startDate!}
                                                className='dark-text-field'
                                                selected={endDate}
                                                onChange={(date) =>
                                                    setEndDate(date)
                                                }
                                                dateFormat={'dd/MM/yyyy'}
                                                placeholderText='End date'
                                                showTimeInput
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Toggle>
                    </div>
                    <Button
                        variant='primary'
                        className='flex items-center gap-2 justify-center w-full'
                    >
                        <MagnifyingGlassIcon className='size-4' />
                        Search
                    </Button>
                </div>
                <div className='flex justify-center'>
                    <Button
                        variant='rounded'
                        onClick={() => setShowArticleModal(true)}
                    >
                        <p className='flex gap-2 justify-center items-center'>
                            {articleCount} articles found
                            <ArrowUpRightIcon className='size-4' />
                        </p>
                    </Button>
                </div>

                <div className='dark-card p-2 space-y-1 text-light'>
                    <p className='flex gap-2 items-center pb-1 font-semibold '>
                        <ShareIcon className='size-4' />
                        Node limit
                    </p>
                    <div className='flex items-center px-1 gap-3'>
                        <Slider
                            onChange={(value) => setNodeLimit(value)}
                            value={nodeLimit}
                            max={articleCount}
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
            {showArticleModal && (
                <ViewAllArticlesModal
                    articleData={mockArticles}
                    onClose={() => setShowArticleModal(false)}
                />
            )}
        </>
    );
};

export default SidePanelControl;
