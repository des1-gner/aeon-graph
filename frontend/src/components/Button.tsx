import { FormEvent, ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary';
    onClick?: (
        event: React.MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>
    ) => void;
}

const variantClasses = {
    primary: 'dark-gradient text-light border border-neutral-900',
    secondary: 'light-gradient border border-neutral-300',
};

const Button = ({
    children,
    className,
    variant = 'primary',
    onClick,
}: ButtonProps) => {
    const variantClass = variantClasses[variant];

    return (
        <button
            className={`${variantClass} ${className} transition duration-200 ease-in active:scale-[.98] hover:shadow-sm hover:shadow-neutral-500 cursor-pointer w-full px-4 py-1 rounded-lg`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
