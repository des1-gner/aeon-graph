import { ReactNode } from 'react';
import { ToggleItem } from './ToggleItem';

// Define the props interface for the Toggle component
type ToggleProps = {
  // Optional header tuple: [text content, optional ReactNode element]
  header?: [string, ReactNode?];
  // Optional children elements to be rendered inside the component
  children?: ReactNode;
  // Array of labels for each toggle option
  toggleLabels: string[];
  // Currently selected toggle index
  selectedIndex: number;
  // Callback function when a toggle item is clicked
  onClick: (index: number) => void;
};

// Toggle component that renders a group of toggleable items with optional header
export const Toggle = ({
  header,
  children,
  toggleLabels,
  selectedIndex,
  onClick,
}: ToggleProps) => {
    return (
        <div className='inline-block w-full select-none rounded-lg py-1 dark-card'>
            {header && (
                <h2 className='flex gap-2 items-center leading-none p-2 font-semibold text-light'>
                    {header[1]}
                    {header[0]}
                </h2>
            )}
            <div className='p-2 flex gap-2'>
                {toggleLabels.map((label, index) => (
                    <ToggleItem
                        key={index}
                        label={label}
                        isSelected={selectedIndex === index}
                        onClick={() => onClick(index)}
                    />
                ))}
            </div>
            {children}
        </div>
    );
};