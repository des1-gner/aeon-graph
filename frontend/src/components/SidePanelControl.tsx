import { useEffect, useState } from 'react';
import Toggle from './Toggle';
import {
    AdjustmentsHorizontalIcon,
    ChevronRightIcon,
    CalendarDateRangeIcon,
    CircleStackIcon,
    CubeTransparentIcon,
    DocumentArrowUpIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    ShareIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import Button from './Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/updated-slider.css';
import { mockArticles } from '../mock-data';
import { AnimatePresence, motion } from 'framer-motion';

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

    useEffect(() => {
        const fetchArticles = () => {
            setArticleCount(mockArticles.length);
            setNodeLimit(mockArticles.length);
        };

        fetchArticles();
    }, []);

    return (
        <>
            <div className='bg-white border border-neutral-300 p-4 space-y-6 rounded-lg'>
                <div className='flex items-center justify-between'>
                    <div />
                    <h1 className='flex gap-2 items-center font-semibold text-lg justify-center'>
                        <AdjustmentsHorizontalIcon className='size-5' />
                        Data controls
                    </h1>
                    <XMarkIcon
                        className='size-5 cursor-pointer flex justify-start'
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
                {/* <div className='light-card p-2 space-y-3'>
                    <h2 className='flex gap-2 items-center font-semibold'>
                        <MagnifyingGlassIcon className='size-4' />
                        Search options
                    </h2>
                    <input
                        className='tz-text-field'
                        type='text'
                        placeholder='Search term'
                    />

                    <Button
                        variant='muted'
                        className='flex items-center gap-2 justify-center'
                    >
                        <MagnifyingGlassIcon className='size-4' />
                        Search
                    </Button>
                </div> */}
                <div>
                    <Toggle
                        header={[
                            'Date range',
                            <CalendarDateRangeIcon className='size-4' />,
                        ]}
                        toggleLabels={['Day', 'Week', 'Month', 'Custom']}
                        selectedIndex={dataRangeIndex}
                        onClick={(index) => setDataRangeIndex(index)}
                    >
                        <AnimatePresence>
                            {dataRangeIndex === 3 && (
                                <motion.div
                                    initial='collapsed'
                                    animate='open'
                                    exit='collapsed'
                                    variants={{
                                        open: { opacity: 1, height: 'auto' },
                                        collapsed: { opacity: 0, height: 0 },
                                    }}
                                >
                                    <div className='flex flex-col p-2 gap-2'>
                                        <DatePicker
                                            maxDate={endDate!}
                                            className='tz-text-field'
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
                                            className='tz-text-field'
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
                <div>
                    <Button>
                        <p className='flex gap-2 justify-center items-center'>
                            {articleCount} articles found
                            <ChevronRightIcon className='size-4' />
                        </p>
                    </Button>
                </div>

                <div className='light-card p-2 space-y-1'>
                    <p className='flex gap-2 items-center pb-1 font-semibold'>
                        <ShareIcon className='size-4' />
                        Node limit
                    </p>
                    <div className='flex items-center px-1 gap-3 z-0'>
                        <Slider
                            onChange={(value) => setNodeLimit(value)}
                            value={nodeLimit}
                            max={articleCount}
                        />
                        {nodeLimit}
                    </div>
                </div>

                <div className='light-card p-2 space-y-1'>
                    <p className='flex gap-2 items-center pb-1 font-semibold'>
                        <EyeIcon className='size-4' />
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
                            className='accent-neutral-700 size-4'
                        />
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor='linksBetweenPages' className='text-sm'>
                            3D map
                        </label>
                        <input
                            type='checkbox'
                            id='linksBetweenPages'
                            className='accent-neutral-700 size-4'
                        />
                    </div>
                    <div className='flex justify-between items-center'>
                        <label htmlFor='linksBetweenPages' className='text-sm'>
                            Sentiment
                        </label>
                        <input
                            type='checkbox'
                            id='linksBetweenPages'
                            className='accent-neutral-700 size-4'
                        />
                    </div>
                </div>

                <div className='space-y-2'>
                    <Button
                        variant='action'
                        onClick={onClose}
                        className='flex items-center gap-2 justify-center'
                    >
                        <CubeTransparentIcon className='size-4' />
                        Start visualisation
                    </Button>
                    {/* <Button
                        variant='secondary'
                        className='flex items-center gap-2 justify-center'
                    >
                        <DocumentArrowUpIcon className='size-4' />
                        Export to report
                    </Button> */}
                </div>
            </div>
        </>
    );
};

export default SidePanelControl;
