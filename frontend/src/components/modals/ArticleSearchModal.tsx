import {
    ArrowUpRightIcon,
    CalendarDateRangeIcon,
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
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        setNodeQty(articles?.length || 0);
    }, [articles]);

    const handleGenerateVisualisation = () => {
        handleLimitNodes();
        onClose();
    };

    return (
        <BaseModal onClose={onClose}>
            <div className='border-neutral-800 border rounded-lg mx-10 w-[400px]'>
                <div className='px-5 py-3 bg-neutral-900 rounded-t-lg grid grid-cols-3 items-center'>
                    <div onClick={onClose}>
                        <XMarkIcon className='size-5 text-light cursor-pointer justify-self-start' />
                    </div>
                    <p className='text-light font-semibold text-xl text-center whitespace-nowrap'>
                        Database Search
                    </p>
                </div>
                <div className='p-5 space-y-5 backdrop-blur-xl'>
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
                            selectedIndex={dateRangeIndex}
                            onClick={handleDateRangeToggle}
                        >
                            <AnimatePresence>
                                {dateRangeIndex === 4 && (
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
                                                    value={
                                                        startDate.split('T')[0]
                                                    }
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
                                                    value={
                                                        endDate.split('T')[0]
                                                    }
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
                                    Generate visualisation
                                    <CubeTransparentIcon className='w-4 h-4' />
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
