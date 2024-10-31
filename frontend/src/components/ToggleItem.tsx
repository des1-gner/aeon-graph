/**
 * Props interface for the ToggleItem component
 * @interface ToggleItemProps
 * @property {string} label - The text to display for the toggle item
 * @property {boolean} isSelected - Whether the item is currently selected
 * @property {() => void} onClick - Callback function triggered when the item is clicked
 */
type ToggleItemProps = {
    label: string;
    isSelected: boolean;
    onClick: () => void;
  };
  
  /**
   * A toggle item component that can be selected/deselected
   * Note: Currently only renders the label without any toggle functionality
   * 
   * @param {ToggleItemProps} props - The props for the component
   * @param {string} props.label - The text to display
   * @param {boolean} props.isSelected - The selection state
   * @param {() => void} props.onClick - Click handler function
   * @returns {JSX.Element} A div containing the label text
   * 
   * @example
   * <ToggleItem 
   *   label="Dark Mode"
   *   isSelected={isDarkMode}
   *   onClick={() => setIsDarkMode(!isDarkMode)}
   * />
   */
  export const ToggleItem = ({ label, isSelected, onClick }: ToggleItemProps) => {
    return (
      // TODO: Add proper toggle UI elements and styling
      // Currently only renders the label without visual indication of selection state
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