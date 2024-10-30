import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Article } from '../types/article';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Props interface for the DetailedArticlePanel component
 * @interface DetailedArticlePanelProps
 * @property {Article} article - The article object containing all article data
 * @property {() => void} onClose - Callback function to handle panel closure
 */
type DetailedArticlePanelProps = {
    article: Article;
    onClose: () => void;
};

/**
 * Props interface for the CollapsibleSection component
 * @interface CollapsibleSectionProps
 * @property {string} title - The title of the collapsible section
 * @property {boolean} isOpen - Whether the section is currently expanded
 * @property {() => void} toggleOpen - Function to toggle the section's open state
 * @property {ReactNode} children - The content to be displayed when section is expanded
 */
interface CollapsibleSectionProps {
    title: string;
    isOpen: boolean;
    toggleOpen: () => void;
    children: ReactNode;
}

/**
 * DetailedArticlePanel Component
 * 
 * A modal-like panel that displays detailed information about an article.
 * Features collapsible sections for metadata, claims, and content with animated transitions.
 * 
 * @component
 * @example
 * ```tsx
 * <DetailedArticlePanel 
 *   article={articleData} 
 *   onClose={() => setShowPanel(false)} 
 * />
 * ```
 */
export const DetailedArticlePanel = ({
    article,
    onClose,
}: DetailedArticlePanelProps) => {
    // State for controlling dropdown sections visibility
    const [showFullArticleDropdown, setShowFullArticleDropdown] = useState(false);
    const [showBroadClaimDropdown, setShowBroadClaimDropdown] = useState(false);
    const [showSubClaimDropdown, setShowSubClaimDropdown] = useState(false);
    const [showMetadataDropdown, setShowMetadataDropdown] = useState(false);

    /**
     * Formats string-based yes/no values to proper case
     * @param {string | undefined} value - The input value to format
     * @returns {string} Formatted "Yes" or "No" string
     */
    const formatStringYesNo = (value: string | undefined): string => {
        return value === 'yes' ? 'Yes' : 'No';
    };

    /**
     * Formats boolean values to yes/no strings
     * @param {boolean | undefined} value - The boolean value to format
     * @returns {string} Formatted "Yes" or "No" string
     */
    const formatBooleanYesNo = (value: boolean | undefined): string => {
        return value ? 'Yes' : 'No';
    };

    // Animation variants for dropdown sections
    const dropdownAnimationVariants = {
        open: {
            opacity: 1,
            height: 'auto',
        },
        collapsed: {
            opacity: 0,
            height: 0,
        },
    };

    /**
     * Renders a collapsible section with animated transition
     */
    const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
        title, 
        isOpen, 
        toggleOpen, 
        children 
    }) => (
        <div>
            <div className='flex justify-between'>
                <strong>{title}</strong>
                <ChevronDownIcon
                    className='size-4 fill-white cursor-pointer'
                    onClick={toggleOpen}
                />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial='collapsed'
                        animate='open'
                        exit='collapsed'
                        variants={dropdownAnimationVariants}
                        className='max-h-[300px] overflow-y-auto'
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className='fixed left-4 top-4 transform backdrop-blur-xl border-neutral-700 border p-4 space-y-6 rounded-lg z-10 w-96 text-white'>
            {/* Header section with title and close button */}
            <div className='flex items-center justify-between'>
                <div /> {/* Spacer for layout balance */}
                <h1 className='flex gap-2 items-center font-semibold text-lg justify-center text-light'>
                    <InformationCircleIcon className='size-5' />
                    More info
                </h1>
                <button
                    onClick={onClose}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-full p-1.5 transition-colors flex items-center justify-center"
                    aria-label="Close panel"
                >
                    <XMarkIcon className="size-5" />
                </button>
            </div>

            {/* Main content section */}
            <div className='space-y-4'>
                {/* Basic article information */}
                <h2 className='text-2xl font-bold capitalize'>
                    {article.title || 'Untitled'}
                </h2>
                
                {/* URL section with link */}
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

                {/* Author and source information */}
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

                {/* Collapsible sections */}
                <CollapsibleSection
                    title="Additional Metadata"
                    isOpen={showMetadataDropdown}
                    toggleOpen={() => setShowMetadataDropdown(!showMetadataDropdown)}
                >
                    <div className='space-y-2 mt-2'>
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
                    </div>
                </CollapsibleSection>

                <CollapsibleSection
                    title="Broad Claims"
                    isOpen={showBroadClaimDropdown}
                    toggleOpen={() => setShowBroadClaimDropdown(!showBroadClaimDropdown)}
                >
                    <ul className='list-disc pl-5 space-y-1 mt-2'>
                        {article.broadClaims &&
                            Object.entries(article.broadClaims).map(
                                ([key, value]) =>
                                    value && (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    )
                            )}
                    </ul>
                </CollapsibleSection>

                <CollapsibleSection
                    title="Sub Claims"
                    isOpen={showSubClaimDropdown}
                    toggleOpen={() => setShowSubClaimDropdown(!showSubClaimDropdown)}
                >
                    <ul className='list-disc pl-5 space-y-1 mt-2'>
                        {article.subClaims &&
                            Object.entries(article.subClaims).map(
                                ([key, value]) =>
                                    value && (
                                        <li key={key}>
                                            <strong>{key}:</strong> {value}
                                        </li>
                                    )
                            )}
                    </ul>
                </CollapsibleSection>

                <CollapsibleSection
                    title="Content"
                    isOpen={showFullArticleDropdown}
                    toggleOpen={() => setShowFullArticleDropdown(!showFullArticleDropdown)}
                >
                    <p className='mt-2'>{article.body}</p>
                </CollapsibleSection>

                {/* Article image section */}
                {article.image && (
                    <div>
                        <strong>Image:</strong>
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

export default DetailedArticlePanel;