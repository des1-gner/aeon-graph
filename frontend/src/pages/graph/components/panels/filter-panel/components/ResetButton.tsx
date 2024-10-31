import React from 'react';
import { Button } from '../../../common/button/Button';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

interface ResetButtonProps {
    onClick: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onClick }) => (
    <Button
        variant='secondary'
        onClick={onClick}
        className='flex items-center gap-1 px-2 py-1 text-sm'
    >
        <ArrowPathIcon className='size-3' />
        Reset
    </Button>
);
