import BaseModal from './BaseModal';
import ArticleTable from '../ArticleTable';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import Button from '../Button';
import { useArticles } from '../../contexts/ArticlesContext';

type ViewAllArticlesModalProps = {
    onClose: () => void;
};

const ViewAllArticlesModal = ({ onClose }: ViewAllArticlesModalProps) => {
    const { articles, clearAllArticles } = useArticles();

    return (
        <BaseModal onClose={onClose}>
            <div className='border-neutral-700 border rounded-lg mx-10'>
                <div className='p-5 bg-neutral-900 rounded-t-lg grid grid-cols-3 items-center'>
                    <XMarkIcon
                        className='size-5 text-light cursor-pointer justify-self-start'
                        onClick={onClose}
                    />
                    <p className='text-light font-semibold text-xl text-center'>
                        {`Articles - ${articles?.length}`}
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
                <div className='h-[800px] overflow-auto'>
                    <ArticleTable />
                </div>
            </div>
        </BaseModal>
    );
};

export default ViewAllArticlesModal;
