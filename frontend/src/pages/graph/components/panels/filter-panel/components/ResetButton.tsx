// Import React library for component creation
import React from 'react';
// Import custom Button component from relative path
import { Button } from '../../../common/button/Button';
// Import ArrowPathIcon from Heroicons library (solid style)
import { ArrowPathIcon } from '@heroicons/react/24/solid';

// Define TypeScript interface for component props
interface ResetButtonProps {
    onClick: () => void;  // Function prop that takes no arguments and returns nothing
}

// Define ResetButton as a React Functional Component using the ResetButtonProps interface
export const ResetButton: React.FC<ResetButtonProps> = ({ onClick }) => (
    <Button
        variant='secondary'        // Use secondary style variant of the Button component
        onClick={onClick}          // Pass through the onClick handler
        className='flex items-center gap-1 px-2 py-1 text-sm'  // Tailwind classes for styling:
                                  // flex - use flexbox layout
                                  // items-center - vertically center items
                                  // gap-1 - add small gap between items
                                  // px-2 - horizontal padding
                                  // py-1 - vertical padding
                                  // text-sm - small text size
    >
        <ArrowPathIcon className='size-3' />  {/* Render icon with size class */}
        Reset                                 {/* Button text */}
    </Button>
);