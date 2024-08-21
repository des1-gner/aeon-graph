import BaseModal from './BaseModal';
import ArticleTable from '../ArticleTable';
import { XMarkIcon } from '@heroicons/react/24/solid';
import Button from '../Button';
import { NewsArticle } from '../../types/news-article';

interface ViewAllArticlesModalProps {
    articleData: NewsArticle[];
    onClose: () => void;
}

const ViewAllArticlesModal = ({
    articleData,
    onClose,
}: ViewAllArticlesModalProps) => {
    return (
        <BaseModal onClose={onClose}>
            <div className='border-neutral-700 border rounded-lg'>
                <div className='p-5 bg-neutral-950 rounded-t-lg flex justify-between'>
                    <Button variant='rounded'>
                        {articleData.length} articles
                    </Button>
                    <p className='text-light font-semibold text-2xl text-center'>
                        Articles
                    </p>
                    <XMarkIcon
                        className='size-5 text-light cursor-pointer'
                        onClick={onClose}
                    />
                </div>
                <div className='h-[800px] overflow-auto'>
                    <ArticleTable articleData={articleData} />
                </div>
            </div>
        </BaseModal>
    );
};

export default ViewAllArticlesModal;
