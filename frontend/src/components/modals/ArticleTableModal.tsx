/**
 * @file ArticleTableModal.tsx
 * @description A modal component that displays a table of articles with sorting, filtering, and action capabilities.
 * The modal includes features for viewing article details, opening articles in new tabs, and deleting articles.
 */

import React, { useState } from 'react';
import { BaseModal } from './BaseModal';
import {
    ArrowUpRightIcon,
    TrashIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import { Button } from '../Button';
import { useArticles } from '../../contexts/ArticlesContext';
import { Article } from '../../types/article';

/**
 * Props interface for the ArticleTableModal component
 * @interface ArticleTableModalProps
 * @property {Function} onClose - Callback function to close the modal
 */
type ArticleTableModalProps = {
    onClose: () => void;
};

/**
 * ArticleTableModal Component
 * Displays a comprehensive table of articles with various data points and interactive features
 * 
 * @component
 * @param {ArticleTableModalProps} props - Component props
 * @returns {JSX.Element} Rendered modal component with article table
 */
export const ArticleTableModal = ({ onClose }: ArticleTableModalProps) => {
    // Access articles context and extract needed functions
    const { articles = [], clearAllArticles, deleteArticle } = useArticles();

    // State for sorting configuration
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Article;
        direction: 'asc' | 'desc';
    } | null>(null);

    /**
     * Formats a date string into a localized GB format (DD/MM/YYYY)
     * 
     * @param {string} dateString - The date string to format
     * @returns {string} Formatted date string
     */
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    /**
     * Renders a list of claims from a claims object
     * 
     * @param {Record<string, string | undefined>} claims - Object containing claim key-value pairs
     * @returns {JSX.Element} Rendered unordered list of claims
     */
    const renderClaims = (claims: Record<string, string | undefined>) => {
        return (
            <ul className="list-disc pl-4 text-sm">
                {Object.entries(claims).map(([key, value]) => (
                    // Only render claims that have values
                    value && (
                        <li key={key} className="py-1">
                            <span className="font-medium">{key}:</span> {value}
                        </li>
                    )
                ))}
            </ul>
        );
    };

    return (
        <BaseModal onClose={onClose}>
            {/* Main modal container */}
            <div className='border-neutral-700 border rounded-lg mx-4 min-w-[1200px]'>
                {/* Modal header section */}
                <div className='p-5 bg-neutral-900 rounded-t-lg grid grid-cols-3 items-center'>
                    {/* Close button */}
                    <XMarkIcon
                        className='h-5 w-5 text-light cursor-pointer justify-self-start'
                        onClick={onClose}
                    />
                    {/* Modal title with article count */}
                    <p className='text-light font-semibold text-xl text-center'>
                        Articles
                        <span className='font-normal text-base'>{` (${articles.length})`}</span>
                    </p>
                    {/* Delete all articles button */}
                    <Button
                        variant='delete'
                        className='dark-label flex gap-1 items-center justify-self-end'
                        onClick={clearAllArticles}
                    >
                        <TrashIcon className='h-3 w-3' />
                        <p className='text-sm'>Delete all</p>
                    </Button>
                </div>

                {/* Table container with scrolling */}
                <div className='max-h-[800px] overflow-auto rounded-lg'>
                    <table className='text-light bg-neutral-900 w-full'>
                        {/* Table header with sticky positioning */}
                        <thead>
                            <tr>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-12 text-left whitespace-nowrap'>
                                    #
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-48 text-left whitespace-nowrap'>
                                    ID
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-48 text-left whitespace-nowrap'>
                                    URI
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-64 text-left whitespace-nowrap'>
                                    Title
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 min-w-[300px] text-left whitespace-nowrap'>
                                    Content
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-48 text-left whitespace-nowrap'>
                                    Source
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-48 text-left whitespace-nowrap'>
                                    Author(s)
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-32 text-left whitespace-nowrap'>
                                    Date
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-32 text-center whitespace-nowrap'>
                                    Duplicate
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 min-w-[300px] text-left whitespace-nowrap'>
                                    Broad Claims
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 min-w-[300px] text-left whitespace-nowrap'>
                                    Sub Claims
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-48 text-left whitespace-nowrap'>
                                    Think Tank Ref
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-24 text-center whitespace-nowrap'>
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        {/* Table body with article data */}
                        <tbody>
                            {articles.map((article, index) => (
                                <tr key={article.articleId} className="hover:bg-neutral-800">
                                    {/* Index column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 text-center align-top'>
                                        {index + 1}
                                    </td>
                                    {/* Article ID column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-top break-words'>
                                        {article.articleId}
                                    </td>
                                    {/* URI column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-top break-words'>
                                        {article.uri}
                                    </td>
                                    {/* Title column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-top break-words'>
                                        {article.title || 'Untitled'}
                                    </td>
                                    {/* Content column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-top break-words'>
                                        {article.body}
                                    </td>
                                    {/* Source column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-top break-words'>
                                        {article.source}
                                    </td>
                                    {/* Authors column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-top break-words'>
                                        {article.authors}
                                    </td>
                                    {/* Date column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-top whitespace-nowrap'>
                                        {formatDate(article.dateTime)}
                                    </td>
                                    {/* Duplicate indicator column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-middle text-center'>
                                        {article.isDuplicate ? '✓' : '✗'}
                                    </td>
                                    {/* Broad claims column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-top'>
                                        {article.broadClaims && renderClaims(article.broadClaims)}
                                    </td>
                                    {/* Sub claims column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-top'>
                                        {article.subClaims && renderClaims(article.subClaims)}
                                    </td>
                                    {/* Think tank reference column */}
                                    <td className='border-b border-neutral-800 px-4 py-2 align-top break-words'>
                                        {article.think_tank_ref}
                                    </td>
                                    {/* Action buttons column */}
                                    <td className='border-b border-neutral-800 p-2 align-middle'>
                                        <div className='flex gap-2 justify-center'>
                                            {/* Open article in new tab button */}
                                            <Button
                                                variant='circle'
                                                onClick={() => window.open(article.url, '_blank')}
                                                className='dark-gradient text-light border border-neutral-700 bg-neutral-900'
                                            >
                                                <ArrowUpRightIcon className='h-4 w-4' />
                                            </Button>
                                            {/* Delete article button */}
                                            <Button
                                                variant='circle'
                                                className='bg-gradient-to-b from-red-400 to-30% to-red-500 border border-red-600 bg-red-500'
                                                onClick={() => deleteArticle(article)}
                                            >
                                                <TrashIcon className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </BaseModal>
    );
};