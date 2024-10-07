import { ReactNode } from 'react';
import { ToggleItem } from './ToggleItem';

type ToggleProps = {
    header?: [string, ReactNode?];
    children?: ReactNode;
    toggleLabels: string[];
    selectedIndex: number;
    onClick: (index: number) => void;
};

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
