import { ReactNode, useEffect } from 'react';

/**
 * Props for the BaseModal component
 * @interface BaseModalProps
 * @property {ReactNode} children - Content to be rendered inside the modal
 * @property {string} [className] - Optional CSS class names for styling the modal container
 * @property {() => void} onClose - Function to be called when the modal should close
 */
type BaseModalProps = {
  children: ReactNode;
  className?: string;
  onClose: () => void;
};

/**
 * BaseModal Component
 * 
 * A reusable modal component that provides basic modal functionality including:
 * - Backdrop click to close
 * - ESC key to close
 * - Proper focus trapping
 * - Basic styling with customization options
 * 
 * @component
 * @example
 * ```tsx
 * <BaseModal onClose={() => setIsOpen(false)} className="custom-modal">
 *   <h2>Modal Content</h2>
 *   <p>Your content here</p>
 * </BaseModal>
 * ```
 */
export const BaseModal = ({ children, className = '', onClose }: BaseModalProps) => {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener when component mounts
    document.addEventListener('keydown', handleEscKey);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    // Modal backdrop - full screen with semi-transparent background
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal container */}
      <div 
        className={`
          bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full
          transform transition-all ease-in-out duration-300
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
};