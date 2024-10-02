import { ReactNode } from 'react';

type BaseModalProps = {
    children: ReactNode;
    className?: string;
    onClose: () => void;
};
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
