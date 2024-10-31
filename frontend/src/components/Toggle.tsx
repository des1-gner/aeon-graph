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
    // Main container div
    <div>
      {/* Render header section if provided */}
      {header && (
        <div>
          {/* Optional ReactNode element followed by header text */}
          {header[1]} {header[0]}
        </div>
      )}

      {/* Map through toggle labels to create individual toggle items */}
      {toggleLabels.map((label, index) => (
        <ToggleItem
          key={index}
          label={label}
          isSelected={selectedIndex === index}
          onClick={() => onClick(index)}
        />
      ))}

      {/* Render any children components passed to Toggle */}
      {children}
    </div>
  );
};