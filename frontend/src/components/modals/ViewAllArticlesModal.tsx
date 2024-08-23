import BaseModal from './BaseModal';
import ArticleTable from '../ArticleTable';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Button from '../Button';
import { useArticles } from '../../contexts/ArticlesContext';

interface ViewAllArticlesModalProps {
    onClose: () => void;
}

const ViewAllArticlesModal = ({ onClose }: ViewAllArticlesModalProps) => {
    const { articles, clearAllArticles } = useArticles();

    return (
        <BaseModal onClose={onClose}>
            <div className='border-neutral-700 border rounded-lg z-50'>
                <div className='p-5 bg-neutral-950 rounded-t-lg flex justify-between'>
                    <Button
                        variant='delete'
                        className='dark-label flex gap-1 items-center'
                        onClick={() => clearAllArticles()}
                    >
                        <TrashIcon className='size-4' />
                        {`Delete all (${articles!.length} articles)`}
                    </Button>
                    <p className='text-light font-semibold text-2xl text-center'>
                        Articles
                    </p>
                    <XMarkIcon
                        className='size-5 text-light cursor-pointer'
                        onClick={onClose}
                    />
                </div>
                <div className='max-h-[800px] overflow-auto'>
                    <ArticleTable />
                </div>
            </div>
        </BaseModal>
    );
};

export default ViewAllArticlesModal;
