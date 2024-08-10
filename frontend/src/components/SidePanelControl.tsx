import { useState } from 'react';
import Toggle from './Toggle';
import {
    AdjustmentsHorizontalIcon,
    CalendarDateRangeIcon,
    ChartBarIcon,
    DocumentArrowUpIcon,
    FolderIcon,
    MagnifyingGlassIcon,
    PaintBrushIcon,
    ShareIcon,
} from '@heroicons/react/24/solid';
import Button from './Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Slider from 'rc-slider';
import 'rc-slider/assets/updated-slider.css';

const SidePanelControl = () => {
    const [dataSourceIndex, setDataSourceIndex] = useState(0);
    const [dataRangeIndex, setDataRangeIndex] = useState(0);
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>();
    const [nodeQty, setNodeQty] = useState<number | number[]>(0);

    return (
        <>
            <div className='h-fit w-fit bg-neutral-100 border border-neutral-300 p-4 space-y-8 rounded-lg'>
                <h1 className='flex gap-2 items-center font-semibold text-lg justify-center'>
                    <AdjustmentsHorizontalIcon className='size-5' />
                    Data controls
                </h1>
                <div>
                    <Toggle
                        toggleLabels={['Saved data', 'Live data', 'Mock data']}
                        selectedIndex={dataSourceIndex}
                        onClick={(index) => setDataSourceIndex(index)}
                    />
                </div>
                <div className='space-y-2'>
                    <input
                        className='tz-text-field'
                        type='text'
                        placeholder='Search term'
                    />
                    <div>
                        {/* <h2 className='flex gap-2 items-center font-semibold pb-2'>
                            <CalendarDateRangeIcon className='size-4' />
                            Date range
                        </h2> */}
                        <Toggle
                            toggleLabels={['Day', 'Week', 'Month', 'Custom']}
                            selectedIndex={dataRangeIndex}
                            onClick={(index) => setDataRangeIndex(index)}
                        />
                        {dataRangeIndex === 3 && (
                            <div className='flex flex-col gap-2'>
                                <DatePicker
                                    className='tz-text-field accent-neutral-700'
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat={'dd/MM/yyyy'}
                                    placeholderText='Start date'
                                    showTimeInput
                                />
                                <DatePicker
                                    className='tz-text-field accent-neutral-700'
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat={'dd/MM/yyyy'}
                                    placeholderText='End date'
                                    showTimeInput
                                />
                            </div>
                        )}
                    </div>
                    <Button className='flex items-center gap-2 justify-center'>
                        <MagnifyingGlassIcon className='size-4' />
                        Search
                    </Button>
                </div>

                <div>
                    <h2 className='flex gap-2 items-center font-semibold'>
                        <ShareIcon className='size-4' />
                        Node limit
                    </h2>
                    <Slider onChange={(value) => setNodeQty(value)} />
                    <p>{nodeQty}</p>
                </div>
                <div>
                    <p className='flex gap-2 items-center font-semibold pb-1'>
                        <FolderIcon className='size-4' />
                        Data orginisation
                    </p>
                    <div className='light-card p-2 space-y-2'>
                        <div className='flex justify-between items-center'>
                            <label
                                htmlFor='linksBetweenPages'
                                className='text-sm'
                            >
                                Links between pages
                            </label>
                            <input
                                type='checkbox'
                                id='linksBetweenPages'
                                className='accent-neutral-700 size-4'
                            />
                        </div>
                        <div className='flex justify-between items-center'>
                            <label
                                htmlFor='linksBetweenPages'
                                className='text-sm'
                            >
                                Sentiment
                            </label>
                            <input
                                type='checkbox'
                                id='linksBetweenPages'
                                className='accent-neutral-700 size-4'
                            />
                        </div>
                        <div className='flex justify-between items-center'>
                            <label
                                htmlFor='linksBetweenPages'
                                className='text-sm'
                            >
                                User access journey
                            </label>
                            <input
                                type='checkbox'
                                id='linksBetweenPages'
                                className='accent-neutral-700 size-4'
                            />
                        </div>
                        <div className='flex justify-between items-center'>
                            <label
                                htmlFor='linksBetweenPages'
                                className='text-sm'
                            >
                                User profile comparison
                            </label>
                            <input
                                type='checkbox'
                                id='linksBetweenPages'
                                className='accent-neutral-700 size-4'
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <p className='flex gap-2 items-center font-semibold pb-1'>
                        <ChartBarIcon className='size-4' />
                        Graph options
                    </p>
                    <div className='light-card p-2 space-y-2'>
                        <div className='flex justify-between items-center'>
                            <label
                                htmlFor='linksBetweenPages'
                                className='text-sm'
                            >
                                Image scraping
                            </label>
                            <input
                                type='checkbox'
                                id='linksBetweenPages'
                                className='accent-neutral-700 size-4'
                            />
                        </div>
                        <div className='flex justify-between items-center'>
                            <label
                                htmlFor='linksBetweenPages'
                                className='text-sm'
                            >
                                3D
                            </label>
                            <input
                                type='checkbox'
                                id='linksBetweenPages'
                                className='accent-neutral-700 size-4'
                            />
                        </div>
                    </div>
                </div>
                <div className='space-y-2'>
                    <Button className='flex items-center gap-2 justify-center'>
                        <PaintBrushIcon className='size-4' />
                        Customise design
                    </Button>
                    <Button
                        variant='secondary'
                        className='flex items-center gap-2 justify-center'
                    >
                        <DocumentArrowUpIcon className='size-4' />
                        Export
                    </Button>
                </div>
            </div>
        </>
    );
};

export default SidePanelControl;
