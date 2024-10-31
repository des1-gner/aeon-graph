/**
 * Button Component
 * A versatile button component with multiple variants and loading state support.
 *
 * @component
 *
 * Props:
 * @param {ReactNode} children - Content to be rendered inside the button
 * @param {string} [className] - Additional CSS classes to apply
 * @param {'primary'|'secondary'|'action'|'rounded'|'delete'|'circle'|'glass'} [variant='primary'] - Button style variant
 * @param {boolean} [isLoading] - Shows loading spinner when true
 * @param {function} [onClick] - Click event handler
 *
 * @example
 * // Primary button
 * <Button variant="primary">Click me</Button>
 *
 * // Loading state
 * <Button isLoading>Processing...</Button>
 */

import { FormEvent, ReactNode } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';

// Define button props interface
type ButtonProps = {
    children: ReactNode; // Button content
    className?: string; // Optional custom classes
    variant?:
        | 'primary' // Default dark gradient style
        | 'secondary' // Light gradient style
        | 'action' // Green gradient style
        | 'rounded' // Pill shape
        | 'delete' // Red danger button
        | 'circle' // Circular shape
        | 'glass'; // Frosted glass effect
    isLoading?: boolean; // Loading state flag
    onClick?: (event: React.MouseEvent | FormEvent) => void; // Click handler
};

// Variant-specific styles
const variantClasses = {
    action: 'green-gradient text-dark border border-green-500 rounded-lg bg-green-400',
    primary:
        'dark-gradient text-light rounded-lg border border-neutral-700 bg-neutral-900',
    secondary:
        'light-gradient border border-neutral-300 rounded-lg bg-neutral-300',
    delete: 'rounded-lg bg-gradient-to-b from-red-400 from-5% to-red-500 border-red-600 bg-red-500',
    rounded: 'rounded-full',
    circle: 'rounded-full !p-2 ',
    glass: 'rounded-full backdrop-blur-lg',
};

export const Button = ({
    children,
    className,
    variant = 'primary',
    isLoading,
    onClick,
}: ButtonProps) => {
    const variantClass = variantClasses[variant];

    return (
        <button
            className={`${variantClass} ${className} px-3 py-1 text-nowrap`}
            onClick={onClick}
            disabled={isLoading}
        >
            {isLoading ? (
                <EllipsisHorizontalIcon className='h-5 w-5 animate-pulse' />
            ) : (
                children
            )}
        </button>
    );
};
