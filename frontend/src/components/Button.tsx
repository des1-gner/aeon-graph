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
    action: 'green-gradient text-dark border border-green-500 rounded-lg bg-green-400',
    primary:
        'dark-gradient text-light rounded-lg border border-neutral-700 bg-neutral-900',
    secondary:
        'light-gradient border border-neutral-300 rounded-lg bg-neutral-300',
    delete: 'rounded-lg bg-gradient-to-b from-red-400 from-5% to-red-500 border-red-600 bg-red-500',
    rounded: 'rounded-full',
    circle: 'rounded-full !p-2 ',
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
            className={`${variantClass} ${className}  transition duration-200 whitespace-nowrap ease-in active:scale-[.98] cursor-pointer px-3 py-1 hover:bg-none`}
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
