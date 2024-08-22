interface ToggleItemProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

const ToggleItem = ({ label, isSelected, onClick }: ToggleItemProps) => {
    return (
        <button
            onClick={onClick}
            className={`group dark-gradient flex items-center rounded-lg px-3 py-1 transition duration-150 ease-in hover:cursor-pointer border-neutral-700 border ${
                isSelected && 'light-gradient'
            }`}
        >
            <p className={`text-sm ${isSelected ? 'text-dark' : 'text-light'}`}>
                {label}
            </p>
        </button>
    );
};

export default ToggleItem;
