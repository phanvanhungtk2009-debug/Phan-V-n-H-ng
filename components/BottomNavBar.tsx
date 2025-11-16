import React from 'react';
import { AppView } from '../types';

interface BottomNavBarProps {
    currentView: AppView;
    setCurrentView: (view: AppView) => void;
    cartItemCount: number;
}

const NavItem = ({ view, currentView, setView, icon, label, badgeCount }: {
    view: AppView,
    currentView: AppView,
    setView: (view: AppView) => void,
    icon: React.ReactElement,
    label: string,
    badgeCount?: number
}) => {
    const isActive = currentView === view;
    return (
        <button
            onClick={() => setView(view)}
            className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-500'}`}
        >
            <div className="relative">
                {React.cloneElement(icon, { className: 'w-6 h-6' })}
                {badgeCount != null && badgeCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                        {badgeCount}
                    </span>
                )}
            </div>
            <span className={`text-xs mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
        </button>
    );
};

const BottomNavBar = ({ currentView, setCurrentView, cartItemCount }: BottomNavBarProps) => {
    
    // Determine the active view for highlighting, grouping related views under one tab.
    const getActiveTab = (view: AppView): AppView => {
        if ([AppView.MAP_VIEW, AppView.EXPLORE, AppView.INTERACTIVE_MAP].includes(view)) return AppView.EXPLORE;
        if ([AppView.PRODUCT_GALLERY].includes(view)) return AppView.PRODUCT_GALLERY;
        if ([AppView.ACCOUNT, AppView.SELLER_AUTH, AppView.SELLER_DASHBOARD, AppView.PRODUCT_LISTER].includes(view)) return AppView.ACCOUNT;
        return view;
    }
    
    const activeTab = getActiveTab(currentView);
    
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-around items-stretch z-30 shadow-top">
            <NavItem
                view={AppView.EXPLORE}
                currentView={activeTab}
                setView={setCurrentView}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>}
                label="Khám Phá"
            />
             <NavItem
                view={AppView.PRODUCT_GALLERY}
                currentView={activeTab}
                setView={setCurrentView}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>}
                label="Sản Phẩm"
            />
            <NavItem
                view={AppView.CART}
                currentView={activeTab}
                setView={setCurrentView}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.821-6.831A1.125 1.125 0 0018.141 5H4.897M5.25 7.5h13.5M7.5 14.25v-6.375" /></svg>}
                label="Giỏ Hàng"
                badgeCount={cartItemCount}
            />
            <NavItem
                view={AppView.ACCOUNT}
                currentView={activeTab}
                setView={setCurrentView}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                label="Tài Khoản"
            />
        </nav>
    );
};

export default BottomNavBar;
