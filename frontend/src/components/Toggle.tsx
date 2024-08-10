import ToggleItem from './ToggleItem';

interface ToggleProps {
    toggleLabels: string[];
    selectedIndex: number;
    onClick: (index: number) => void;
}

const Toggle = ({ toggleLabels, selectedIndex, onClick }: ToggleProps) => {
    return (
        <div className='inline-block w-full select-none rounded-lg py-1 bg-white shadow-md border-neutral-300 border'>
            <div className='mx-2 my-1 flex items-center justify-between gap-2'>
                {toggleLabels.map((label, index) => (
                    <ToggleItem
                        key={index}
                        label={label}
                        isSelected={selectedIndex === index}
                        onClick={() => onClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Toggle;
