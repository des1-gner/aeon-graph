interface ToggleItemProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

const ToggleItem = ({ label, isSelected, onClick }: ToggleItemProps) => {
    return (
        <button
            onClick={onClick}
            className={`group flex items-center rounded-lg px-3 py-1 transition duration-150 ease-in hover:cursor-pointer hover:shadow-inner border-neutral-300 border ${
                isSelected && 'dark-gradient shadow-inner'
            }`}
        >
            <p className={`text-sm text-dark ${isSelected && 'text-light'}`}>
                {label}
            </p>
        </button>
    );
};

export default ToggleItem;
