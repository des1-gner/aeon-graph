import { FormEvent, ReactNode } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';

type ButtonProps = {
    children: ReactNode;
    className?: string;
    variant?:
        | 'primary'
        | 'secondary'
        | 'action'
        | 'rounded'
        | 'delete'
        | 'circle';
    isLoading?: boolean;
    onClick?: (
        event: React.MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
    ) => void;
};

const variantClasses = {
    action: 'green-gradient text-dark border border-green-500 rounded-lg hover:shadow hover:shadow-neutral-600',
    primary:
        'dark-gradient text-light rounded-lg border border-neutral-700 hover:shadow hover:shadow-neutral-600',
    secondary:
        'light-gradient border border-neutral-300 rounded-lg hover:shadow hover:shadow-neutral-600',
    rounded: 'dark-gradient text-light border border-neutral-600 rounded-full',
    delete: 'rounded-lg bg-gradient-to-b from-red-400 from-5% to-red-500 border-red-600',
    circle: 'rounded-full !p-2 bg-gradient-to-br from-red-400 to-red-500 border-red-500',
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
            className={`${variantClass} ${className} transition duration-200 whitespace-nowrap ease-in active:scale-[.98] cursor-pointer px-3 py-1`}
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
