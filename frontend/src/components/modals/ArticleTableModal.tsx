import { BaseModal } from './BaseModal';
import {
    ArrowUpRightIcon,
    TrashIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import { Button } from '../Button';
import { useArticles } from '../../contexts/ArticlesContext';

type ArticleTableModalProps = {
    onClose: () => void;
};

export const ArticleTableModal = ({ onClose }: ArticleTableModalProps) => {
    const { articles, clearAllArticles, deleteArticle } = useArticles();

    return (
        <BaseModal onClose={onClose}>
            <div className='border-neutral-700 border rounded-lg mx-10'>
                <div className='p-5 bg-neutral-900 rounded-t-lg grid grid-cols-3 items-center'>
                    <XMarkIcon
                        className='size-5 text-light cursor-pointer justify-self-start'
                        onClick={onClose}
                    />
                    <p className='text-light font-semibold text-xl text-center'>
                        Articles
                        <span className='font-normal text-base'>{`(${articles?.length})`}</span>
                    </p>
                    <Button
                        variant='delete'
                        className='dark-label flex gap-1 items-center justify-self-end'
                        onClick={() => clearAllArticles()}
                    >
                        <TrashIcon className='size-3' />
                        <p className='text-sm'>Delete all</p>
                    </Button>
                </div>
                <div className='max-h-[800px] overflow-auto rounded-lg'>
                    <table className='text-light bg-neutral-900 table-fixed'>
                        <thead>
                            <tr className='text-nowrap'>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-16'>
                                    Count
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2'>
                                    Headline
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-32'>
                                    Author
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-32'>
                                    Source
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-32'>
                                    Publish Date
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-32'>
                                    View
                                </th>
                                <th className='bg-neutral-900 sticky top-0 px-4 py-2 w-16'>
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles?.map((article, index) => (
                                <tr key={index}>
                                    <td className='border border-neutral-800 px-4 py-2'>
                                        <p className='text-center'>
                                            {index + 1}
                                        </p>
                                    </td>
                                    <td className='border border-neutral-800 px-4 py-2 capitalize'>
                                        {article.title}
                                    </td>
                                    <td className='border border-neutral-800 px-4 py-2 break-words capitalize'>
                                        {article.authors}
                                    </td>
                                    <td className='border border-neutral-800 px-4 py-2'>
                                        {article.source}
                                    </td>
                                    <td className='border border-neutral-800 px-4 py-2'>
                                        {new Date(article.dateTime)
                                            .toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })
                                            .replace(/\//g, '/')}
                                    </td>
                                    <td className='border border-neutral-800 p-2'>
                                        <div className='flex justify-center items-center h-full px-2'>
                                            <Button
                                                variant='rounded'
                                                onClick={() =>
                                                    window.open(
                                                        article.url,
                                                        '_blank'
                                                    )
                                                }
                                                className='dark-gradient text-light border border-neutral-700 bg-neutral-900'
                                            >
                                                <span className='flex items-center gap-2'>
                                                    View article
                                                    <ArrowUpRightIcon className='size-4 flex-shrink-0' />
                                                </span>
                                            </Button>
                                        </div>
                                    </td>
                                    <td className='border border-neutral-800 p-2'>
                                        <div className='flex justify-center items-center h-full'>
                                            <Button
                                                variant='circle'
                                                className='bg-gradient-to-b  from-red-400 to-30% to-red-500 border border-red-600 bg-red-500'
                                                onClick={() =>
                                                    deleteArticle(article)
                                                }
                                            >
                                                <TrashIcon className='size-4' />
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
