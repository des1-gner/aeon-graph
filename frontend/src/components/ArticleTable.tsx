import { ArrowUpRightIcon, TrashIcon } from '@heroicons/react/24/solid';
import Button from './Button';
import { useArticles } from '../contexts/ArticlesContext';

const ArticleTable = () => {
    const { articles, deleteArticle } = useArticles();

    return (
        <table className='text-light bg-neutral-900 border-x border-neutral-800 table-fixed'>
            <thead>
                <tr>
                    <th className='bg-neutral-900 border-x border-neutral-800 sticky top-0 px-4 py-2 w-16'>
                        Index
                    </th>
                    <th className='bg-neutral-900 border-x border-neutral-800 sticky top-0 px-4 py-2'>
                        Headline
                    </th>
                    <th className='bg-neutral-900 border-x border-neutral-800 sticky top-0 px-4 py-2 w-32'>
                        Author
                    </th>
                    <th className='bg-neutral-900 border-x border-neutral-800 sticky top-0 px-4 py-2 w-32'>
                        Publication
                    </th>
                    <th className='bg-neutral-900 border-x border-neutral-800 sticky top-0 px-4 py-2 w-32'>
                        Publish Date
                    </th>
                    <th className='bg-neutral-900 border-x border-neutral-800 sticky top-0 px-4 py-2 w-32'>
                        View
                    </th>
                    <th className='bg-neutral-900 border-x border-neutral-800 sticky top-0 px-4 py-2 w-16'>
                        Delete
                    </th>
                </tr>
            </thead>
            <tbody>
                {articles?.map((article, index) => (
                    <tr key={index}>
                        <td className='border border-neutral-800 px-4 py-2'>
                            <p className='text-center'>{index + 1}</p>
                        </td>
                        <td className='border border-neutral-800 px-4 py-2'>
                            {article.title}
                        </td>
                        <td className='border border-neutral-800 px-4 py-2 break-words'>
                            {article.author}
                        </td>
                        <td className='border border-neutral-800 px-4 py-2'>
                            {article.sourceName}
                        </td>
                        <td className='border border-neutral-800 px-4 py-2'>
                            {article.publishedAt}
                        </td>
                        <td className='border border-neutral-800 p-2'>
                            <div className='flex justify-center items-center h-full px-2'>
                                <Button
                                    variant='rounded'
                                    onClick={() =>
                                        window.open(article.url, '_blank')
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
                                    onClick={() => deleteArticle(article)}
                                >
                                    <TrashIcon className='size-4' />
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ArticleTable;
