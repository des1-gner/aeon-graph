import ToggleItem from './ToggleItem';

interface ToggleProps {
    toggleLabel1: string;
    toggleLabel2: string;
    isSelected: boolean;
    onClick: () => void;
}

const Toggle = ({
    toggleLabel1,
    toggleLabel2,
    isSelected,
    onClick,
}: ToggleProps) => {
    return (
        <div className='inline-block select-none rounded-lg py-1 bg-white shadow-md border-neutral-300 border'>
            <div className='mx-2 my-1 flex items-center justify-between gap-2'>
                <ToggleItem
                    label={toggleLabel1}
                    isSelected={isSelected}
                    onClick={onClick}
                />
                <ToggleItem
                    label={toggleLabel2}
                    isSelected={!isSelected}
                    onClick={onClick}
                />
            </div>
        </div>
    );
};

export default Toggle;
