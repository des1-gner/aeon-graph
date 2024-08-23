import { ArrowUpRightIcon, TrashIcon } from '@heroicons/react/24/solid';
import Button from './Button';
import { NewsArticle } from '../types/news-article';
import { useArticles } from '../contexts/ArticlesContext';

const ArticleTable = () => {
    const { articles, deleteArticle } = useArticles();

    return (
        <table className='text-light bg-neutral-950'>
            <thead>
                <tr>
                    <th className='bg-neutral-950 sticky top-0 px-4 py-2'>
                        Delete
                    </th>
                    <th className='bg-neutral-950 sticky top-0 px-4 py-2'>
                        Headline
                    </th>
                    <th className='bg-neutral-950 sticky top-0 px-4 py-2 w-[200px]'>
                        Author
                    </th>
                    <th className='bg-neutral-950 sticky top-0 px-4 py-2'>
                        Publication
                    </th>
                    <th className='bg-neutral-950 sticky top-0 px-4 py-2'>
                        Publish Date
                    </th>
                    <th className='bg-neutral-950 sticky top-0 px-4 py-2'>
                        View
                    </th>
                </tr>
            </thead>
            <tbody>
                {articles!.map((article, index) => (
                    <tr key={index}>
                        <td className='flex justify-center border border-neutral-800'>
                            <Button
                                variant='circle'
                                onClick={() => deleteArticle(article)}
                            >
                                <TrashIcon className='size-4' />
                            </Button>
                        </td>
                        <td className='border border-neutral-800 px-4 py-2 w-[400px]'>
                            {article.title}
                        </td>
                        <td className='border border-neutral-800 px-4 py-2'>
                            {article.author}
                        </td>
                        <td className='border border-neutral-800 px-4 py-2'>
                            {article.source.name}
                        </td>
                        <td className='border border-neutral-800 px-4 py-2'>
                            {article.publishedAt}
                        </td>
                        <td className='flex justify-center border border-neutral-800 px-4 py-2 space-x-3'>
                            <Button
                                variant='rounded'
                                onClick={() =>
                                    window.open(article.url, '_blank')
                                }
                            >
                                <p className='flex gap-2 justify-center items-center'>
                                    View article
                                    <ArrowUpRightIcon className='size-4' />
                                </p>
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ArticleTable;
