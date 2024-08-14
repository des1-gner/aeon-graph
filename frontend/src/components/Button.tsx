import { FormEvent, ReactNode } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';

interface ButtonProps {
    children: ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'action' | 'rounded';
    isLoading?: boolean;
    onClick?: (
        event: React.MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
    ) => void;
}

const variantClasses = {
    action: 'green-gradient text-dark border border-green-500 rounded-lg hover:shadow hover:shadow-neutral-500',
    primary:
        'dark-gradient text-light rounded-lg border border-neutral-700 hover:shadow hover:shadow-neutral-500',
    secondary:
        'light-gradient border border-neutral-300 rounded-lg hover:shadow hover:shadow-neutral-500',
    rounded: 'dark-gradient text-light border border-neutral-900 rounded-full',
};

const Button = ({
    children,
    className,
    variant = 'primary',
    isLoading,
    onClick,
}: ButtonProps) => {
    const variantClass = variantClasses[variant];

    return (
        <button
            className={`${variantClass} ${className} transition duration-200 ease-in active:scale-[.98] cursor-pointer px-3 py-1`}
            onClick={onClick}
        >
            {isLoading ? (
                <EllipsisHorizontalIcon className='size-5 animate-pulse leading-none' />
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
