import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Article } from '../types/article';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';

type DetailedArticlePanelProps = {
    article: Article;
    onClose: () => void;
};

export const DetailedArticlePanel = ({
    article,
    onClose,
}: DetailedArticlePanelProps) => {
    const [showFullArticleDropdown, setShowFullArticleDropdown] =
        useState(false);
    const [showBroadClaimDropdown, setShowBroadClaimDropdown] = useState(false);
    const [showSubClaimDropdown, setShowSubClaimDropdown] = useState(false);
    const [showMetadataDropdown, setShowMetadataDropdown] = useState(false);

    // Helper function for string yes/no values
    const formatStringYesNo = (value: string | undefined) => {
        return value === 'yes' ? 'Yes' : 'No';
    };

    // Helper function for boolean values
    const formatBooleanYesNo = (value: boolean | undefined) => {
        return value ? 'Yes' : 'No';
    };

    return (
        <div className='fixed left-4 top-4 transform backdrop-blur-xl border-neutral-700 border p-4 space-y-6 rounded-lg z-10 w-96 text-white'>
            <div className='flex items-center justify-between'>
                <XMarkIcon
                    className='size-5 text-light cursor-pointer flex justify-start'
                    onClick={onClose}
                />
                <h1 className='flex gap-2 items-center font-semibold text-lg justify-center text-light'>
                    <InformationCircleIcon className='size-5' />
                    More info
                </h1>
                <div />
            </div>
            <div className='space-y-4'>
                <h2 className='text-2xl font-bold capitalize'>
                    {article.title || 'Untitled'}
                </h2>
                {article.url && (
                    <p>
                        <strong>URL:</strong>{' '}
                        <a
                            href={article.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-300 hover:underline'
                        >
                            {article.url}
                        </a>
                    </p>
                )}
                <p className='capitalize'>
                    <strong>Author:</strong> {article.authors || 'Unknown'}
                </p>
                <p>
                    <strong>Source:</strong> {article.source || 'Unknown'}
                </p>
                <p>
                    <strong>Published:</strong>{' '}
                    {new Date(article.dateTime).toLocaleDateString()}
                </p>

                <div>
                    <div className='flex justify-between'>
                        <strong>Broad Claims</strong>
                        <ChevronDownIcon
                            className='size-4 fill-white'
                            onClick={() =>
                                setShowBroadClaimDropdown(
                                    !showBroadClaimDropdown
                                )
                            }
                        />
                    </div>

                    <AnimatePresence>
                        {showBroadClaimDropdown && (
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
                                className='max-h-[300px] overflow-y-auto'
                            >
                                <ul className='list-disc pl-5 space-y-1 mt-2'>
                                    {article.broadClaims &&
                                        Object.entries(article.broadClaims).map(
                                            ([key, value]) =>
                                                value && (
                                                    <li key={key}>
                                                        <strong>{key}</strong>{' '}
                                                        {value}
                                                    </li>
                                                )
                                        )}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div>
                    <div className='flex justify-between'>
                        <strong>Sub Claims</strong>
                        <ChevronDownIcon
                            className='size-4 fill-white'
                            onClick={() =>
                                setShowSubClaimDropdown(!showSubClaimDropdown)
                            }
                        />
                    </div>

                    <AnimatePresence>
                        {showSubClaimDropdown && (
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
                                className='max-h-[300px] overflow-y-auto'
                            >
                                <ul className='list-disc pl-5 space-y-1 mt-2'>
                                    {article.subClaims &&
                                        Object.entries(article.subClaims).map(
                                            ([key, value]) =>
                                                value && (
                                                    <li key={key}>
                                                        <strong>{key}:</strong>{' '}
                                                        {value}
                                                    </li>
                                                )
                                        )}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div>
                    <div className='flex justify-between'>
                        <strong>Content</strong>
                        <ChevronDownIcon
                            className='size-4 fill-white'
                            onClick={() =>
                                setShowFullArticleDropdown(
                                    !showFullArticleDropdown
                                )
                            }
                        />
                    </div>

                    <AnimatePresence>
                        {showFullArticleDropdown && (
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
                                className='max-h-[300px] overflow-y-auto'
                            >
                                <p className='mt-2'>{article.body}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div>
                    <div className='flex justify-between'>
                        <strong>Additional Metadata</strong>
                        <ChevronDownIcon
                            className='size-4 fill-white'
                            onClick={() =>
                                setShowMetadataDropdown(!showMetadataDropdown)
                            }
                        />
                    </div>

                    <AnimatePresence>
                        {showMetadataDropdown && (
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
                                className='space-y-2 mt-2'
                            >
                                <p>
                                    <strong>Think Tank Reference:</strong>{' '}
                                    {formatStringYesNo(article.think_tank_ref)}
                                </p>
                                <p>
                                    <strong>Duplicate Article:</strong>{' '}
                                    {formatBooleanYesNo(article.isDuplicate)}
                                </p>
                                {article.uri && (
                                    <p>
                                        <strong>URI:</strong> {article.uri}
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {article.image && (
                    <div>
                        <strong>Image</strong>
                        <img
                            src={article.image}
                            alt='Article'
                            className='mt-2 w-full h-auto rounded'
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
