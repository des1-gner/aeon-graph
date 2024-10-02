import { BaseModal } from './BaseModal';
import { DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useArticles } from '../../contexts/ArticlesContext';

type QuerySummaryModalProps = {
    startDate: string;
    endDate: string;
    publishedBy: string;
    containing: string;
    nodeLimit: number;
    onClose: () => void;
};

export const QuerySummaryModal = ({
    startDate,
    endDate,
    publishedBy,
    containing,
    nodeLimit,
    onClose,
}: QuerySummaryModalProps) => {
    const { articles } = useArticles();

    return (
        <BaseModal onClose={onClose}>
            <div className='border-neutral-800 border rounded-lg mx-10'>
                <div className='p-5 bg-neutral-900 rounded-t-lg grid grid-cols-3 items-center'>
                    <XMarkIcon
                        className='size-5 text-light cursor-pointer justify-self-start'
                        onClick={onClose}
                    />
                    <p className='text-light font-semibold text-xl text-center'>
                        Query Summary
                    </p>
                </div>
                <div className='h-fit'>
                    <div className='bg-neutral-950 p-4 space-y-3 rounded-lg text-light'>
                        <h2 className='font-semibold'>Query Parameters:</h2>
                        <p>
                            Start Date:{' '}
                            {new Date(startDate)
                                .toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })
                                .replace(/\//g, '/') || 'Not specified'}
                        </p>
                        <p>
                            End Date:{' '}
                            {new Date(endDate)
                                .toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })
                                .replace(/\//g, '/') || 'Not specified'}
                        </p>
                        <p>Published by: {publishedBy || 'Not specified'}</p>
                        <p>Containing: {containing || 'Not specified'}</p>
                        <p>Node Limit: {nodeLimit}</p>
                        <p>Articles found: {articles?.length || 0}</p>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};
