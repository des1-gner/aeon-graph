import { ReactNode } from 'react';
import ToggleItem from './ToggleItem';

interface ToggleProps {
    header?: [string, ReactNode];
    children?: ReactNode;
    toggleLabels: string[];
    selectedIndex: number;
    onClick: (index: number) => void;
}

const Toggle = ({
    header,
    children,
    toggleLabels,
    selectedIndex,
    onClick,
}: ToggleProps) => {
    return (
        <div className='inline-block w-full select-none rounded-lg py-1 bg-neutral-100 shadow border-neutral-300 border'>
            {header && (
                <h2 className='flex gap-2 items-center pb-1 pl-2 font-semibold'>
                    {header[1]}
                    {header[0]}
                </h2>
            )}
            <div className='mx-2 my-1 flex gap-2'>
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

export default Toggle;
