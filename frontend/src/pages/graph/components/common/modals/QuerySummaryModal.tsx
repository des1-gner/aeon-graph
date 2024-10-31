import React from 'react';
import { BaseModal } from './BaseModal';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useArticles } from '../../../contexts/ArticlesContext';
import { Article } from '../../../three.js/types/article';

// Define the necessary types
interface CommonFilterOptions {
    articleBody: string;
    broadClaim: string;
    subClaim: string;
    source: string;
    think_tank_ref: string;
    isDuplicate: string;
}

interface EdgeOptions extends CommonFilterOptions {
    visibility: 'on' | 'hover' | 'off';
}

type HighlightOptions = CommonFilterOptions;
type ClusterOptions = CommonFilterOptions;

interface QuerySummaryModalProps {
    startDate: string;
    endDate: string;
    publishedBy: string;
    containing: string;
    nodeLimit: number;
    onClose: () => void;
    highlightOptions: HighlightOptions;
    clusterOptions: ClusterOptions;
    edgeOptions: EdgeOptions;
}

// Helper function to check if filter is active
const hasActiveFilters = (options: CommonFilterOptions): boolean => {
    return Object.values(options).some(
        (value) => value !== '' && value !== 'off'
    );
};

// Helper function to parse comma-separated values
const parseFilterValue = (value: string): string[] => {
    return value ? value.split(',').filter(Boolean) : [];
};

// Helper function to check if article matches filter
const matchesFilter = (
    article: Article,
    options: CommonFilterOptions
): boolean => {
    if (!hasActiveFilters(options)) return true;

    // Check broad claims
    const selectedBroadClaims = parseFilterValue(options.broadClaim);
    if (selectedBroadClaims.length > 0) {
        if (!article.broadClaims) return false;
        const hasMatchingBroadClaim = selectedBroadClaims.some(
            (claimId) => article.broadClaims && claimId in article.broadClaims
        );
        if (!hasMatchingBroadClaim) return false;
    }

    // Check sub claims
    const selectedSubClaims = parseFilterValue(options.subClaim);
    if (selectedSubClaims.length > 0) {
        if (!article.subClaims) return false;
        const hasMatchingSubClaim = selectedSubClaims.some(
            (claimId) => article.subClaims && claimId in article.subClaims
        );
        if (!hasMatchingSubClaim) return false;
    }

    // Check sources
    const selectedSources = parseFilterValue(options.source);
    if (selectedSources.length > 0) {
        if (!article.source) return false;
        if (!selectedSources.includes(article.source)) return false;
    }

    // Check think tank reference
    if (options.think_tank_ref !== '') {
        const hasThinkTankRef =
            article.think_tank_ref !== null &&
            article.think_tank_ref !== undefined &&
            article.think_tank_ref.trim() !== '';
        if (hasThinkTankRef !== (options.think_tank_ref === 'yes')) {
            return false;
        }
    }

    // Check duplicate status
    if (options.isDuplicate !== '') {
        const isDuplicateMatch =
            article.isDuplicate === (options.isDuplicate === 'yes');
        if (!isDuplicateMatch) {
            return false;
        }
    }

    // Check article body text
    if (options.articleBody && options.articleBody.trim() !== '') {
        if (
            !article.body ||
            !article.body
                .toLowerCase()
                .includes(options.articleBody.toLowerCase().trim())
        ) {
            return false;
        }
    }

    return true;
};

export const QuerySummaryModal: React.FC<QuerySummaryModalProps> = ({
    startDate,
    endDate,
    publishedBy,
    containing,
    nodeLimit,
    onClose,
    highlightOptions,
    clusterOptions,
    edgeOptions,
}) => {
    const { articles } = useArticles();
    const totalNodes = articles?.length || 0;

    // Calculate statistics
    const highlightedNodes =
        articles?.filter((article) => matchesFilter(article, highlightOptions))
            .length || 0;

    const clusteredNodes =
        articles?.filter((article) => matchesFilter(article, clusterOptions))
            .length || 0;

    const bothNodes =
        articles?.filter(
            (article) =>
                matchesFilter(article, highlightOptions) &&
                matchesFilter(article, clusterOptions)
        ).length || 0;

    const connectedEdges =
        articles?.filter((article) => matchesFilter(article, edgeOptions))
            .length || 0;

    // Helper function to format active filters
    const getActiveFilters = (options: CommonFilterOptions): string => {
        const filters = [];
        if (options.broadClaim) filters.push('Broad Claims');
        if (options.subClaim) filters.push('Sub Claims');
        if (options.source) filters.push('Source');
        if (options.think_tank_ref) filters.push('Think Tank Reference');
        if (options.isDuplicate) filters.push('Duplicate Status');
        if (options.articleBody) filters.push('Article Body');
        return filters.join(', ') || 'None';
    };

    return (
        <BaseModal onClose={onClose}>
            <div className='max-w-2xl w-full bg-neutral-900 rounded-lg shadow-xl'>
                <div className='flex justify-between items-center p-4 border-b border-neutral-800'>
                    <button
                        onClick={onClose}
                        className='text-neutral-400 hover:text-neutral-200'
                    >
                        <XMarkIcon className='h-5 w-5' />
                    </button>
                    <h2 className='text-lg font-semibold text-neutral-200'>
                        Query Summary
                    </h2>
                    <div />
                </div>
                <div className='p-6 space-y-6 backdrop-blur-xl'>
                    {/* Query Parameters */}
                    <div className='space-y-4'>
                        <h3 className='text-sm font-medium text-neutral-400'>
                            Query Parameters
                        </h3>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div>
                                <p className='text-neutral-500'>Start Date</p>
                                <p className='text-neutral-200'>
                                    {new Date(startDate)
                                        .toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })
                                        .replace(/\//g, '/') || 'Not specified'}
                                </p>
                            </div>
                            <div>
                                <p className='text-neutral-500'>End Date</p>
                                <p className='text-neutral-200'>
                                    {new Date(endDate)
                                        .toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })
                                        .replace(/\//g, '/') || 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Visualization Statistics */}
                    <div className='space-y-4'>
                        <h3 className='text-sm font-medium text-neutral-400'>
                            Visualization Statistics
                        </h3>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div>
                                <p className='text-neutral-500'>Total Nodes</p>
                                <p className='text-neutral-200'>{totalNodes}</p>
                            </div>
                            <div>
                                <p className='text-neutral-500'>
                                    Highlighted Nodes
                                </p>
                                <p className='text-neutral-200'>
                                    {highlightedNodes}/{totalNodes}
                                </p>
                            </div>
                            <div>
                                <p className='text-neutral-500'>
                                    Clustered Nodes
                                </p>
                                <p className='text-neutral-200'>
                                    {clusteredNodes}/{totalNodes}
                                </p>
                            </div>
                            <div>
                                <p className='text-neutral-500'>
                                    Highlighted & Clustered
                                </p>
                                <p className='text-neutral-200'>
                                    {bothNodes}/{totalNodes}
                                </p>
                            </div>
                            <div>
                                <p className='text-neutral-500'>
                                    Connected Edges
                                </p>
                                <p className='text-neutral-200'>
                                    {connectedEdges}/{totalNodes}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Settings */}
                    <div className='space-y-4'>
                        <h3 className='text-sm font-medium text-neutral-400'>
                            Filter Settings
                        </h3>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div>
                                <p className='text-neutral-500'>Highlight By</p>
                                <p className='text-neutral-200'>
                                    {getActiveFilters(highlightOptions)}
                                </p>
                            </div>
                            <div>
                                <p className='text-neutral-500'>Cluster By</p>
                                <p className='text-neutral-200'>
                                    {getActiveFilters(clusterOptions)}
                                </p>
                            </div>
                            <div>
                                <p className='text-neutral-500'>Edge Options</p>
                                <p className='text-neutral-200'>
                                    {getActiveFilters(edgeOptions)}
                                    {edgeOptions.visibility !== 'off' &&
                                        ` (${edgeOptions.visibility} mode)`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};
