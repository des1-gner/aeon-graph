import React from 'react';
import { NewspaperIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useArticles } from '../contexts/ArticlesContext';

type QueryModuleProps = {
    startDate: string;
    endDate: string;
    publishedBy: string;
    containing: string;
    nodeLimit: number;
    onClose: () => void;
};

const QueryModule: React.FC<QueryModuleProps> = ({
    startDate,
    endDate,
    publishedBy,
    containing,
    nodeLimit,
    onClose
}) => {
    const { articles } = useArticles();

    return (
        <div className="backdrop-blur-xl border-neutral-700 border p-4 space-y-6 rounded-lg z-10 min-w-[385px]">
            <div className="flex items-center justify-between">
                <XMarkIcon
                    className="size-5 text-light cursor-pointer flex justify-start"
                    onClick={onClose}
                />
                <h1 className="flex gap-2 items-center font-semibold text-lg justify-center text-light">
                    <NewspaperIcon className="size-5" />
                    Summary Module
                </h1>
                <div />
            </div>

            <div className="dark-card p-4 space-y-3 text-light">
                <h2 className="font-semibold">Query Parameters:</h2>
                <p>Start Date: {startDate || 'Not specified'}</p>
                <p>End Date: {endDate || 'Not specified'}</p>
                <p>Published by: {publishedBy || 'Not specified'}</p>
                <p>Containing: {containing || 'Not specified'}</p>
                <p>Node Limit: {nodeLimit}</p>
            </div>

            <div className="dark-card p-4 space-y-3 text-light">
                <h2 className="font-semibold">Query Results:</h2>
                <p>Articles found: {articles?.length || 0}</p>
            </div>
        </div>
    );
};

export default QueryModule;