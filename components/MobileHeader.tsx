import React from 'react';

interface MobileHeaderProps {
    title: string;
}

const MobileHeader = ({ title }: MobileHeaderProps) => {
    return (
        <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-center sticky top-0 z-20 shrink-0">
            <div className="text-center">
                <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            </div>
        </header>
    );
};

export default MobileHeader;
