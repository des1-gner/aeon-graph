// Import React's type for components that can contain child elements
import { ReactNode } from 'react';

// Define props interface for the modal
type BaseModalProps = {
    // ReactNode type allows any valid content that can be rendered by React
    children: ReactNode;
    // Optional string for additional CSS classes
    className?: string;
    // Function to be called when modal needs to close
    onClose: () => void;
};

// Base modal component that accepts children, className, and onClose props
export const BaseModal = ({ children, className, onClose }: BaseModalProps) => {
    return (
        <div
            className={`${className} fixed inset-0 z-50 flex items-center justify-center bg-black/75`}
        >
            <div>
                <div>{children}</div>
            </div>
        </div>
    );
};