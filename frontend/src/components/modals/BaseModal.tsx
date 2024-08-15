import { ReactNode } from 'react';

interface BaseModalProps {
    children: ReactNode;
    className?: string;
    onClose: () => void;
}
const BaseModal = ({ children, className, onClose }: BaseModalProps) => {
    return (
        <div
            className={`${className} fixed inset-0 z-50 flex items-center justify-center bg-black/80`}
        >
            <div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default BaseModal;
