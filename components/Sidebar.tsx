import React from 'react';
import { AppView, UserRole, Seller } from '../types';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  cartItemCount: number;
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  currentSeller: Seller | null;
  onLogout: () => void;
}

interface NavItemType {
  view: AppView;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  text: string;
  roles: UserRole[];
  badgeCount?: number;
}

interface NavItemProps {
  view: AppView;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  text: string;
  badgeCount?: number;
}

const Logo = () => (
    <div className="flex items-center gap-2">
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4Z" fill="#10B981"/>
            <path d="M24.0003 44C29.0743 44 33.6843 42.176 37.0003 39.2L19.5003 14.8C15.4293 17.618 13.0003 22.353 13.0003 27.8C13.0003 36.636 20.1643 43.8 29.0003 43.8C27.4003 43.8 25.8003 44 24.0003 44Z" fill="#059669"/>
            <path d="M22.0003 17L17.5003 24.5L22.0003 32H27.5003L32.0003 24.5L27.5003 17H22.0003Z" fill="white" fillOpacity="0.5"/>
            <path d="M27.5 17L22 24.5L27.5 32L32 24.5L27.5 17Z" fill="white"/>
        </svg>
        <div>
            <h2 className="text-xl font-extrabold text-emerald-600">Chợ Số</h2>
            <p className="text-xs text-gray-500 -mt-1">AI for Vietnam</p>
        </div>
    </div>
);


const NavItem = ({ view, currentView, setCurrentView, icon, text, badgeCount }: NavItemProps) => {
  const isActive = currentView === view;
  return (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center w-full px-4 py-3 text-left transition-all duration-200 group rounded-lg ${
        isActive
          ? 'bg-emerald-100 text-emerald-700 font-semibold'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 font-medium'
      }`}
    >
      {React.cloneElement(icon, { className: `h-6 w-6 mr-3 transition-colors ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500'}` })}
      <span className="truncate flex-1">{text}</span>
      {badgeCount != null && badgeCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {badgeCount}
          </span>
      )}
    </button>
  );
};

const RoleSwitcher = ({ currentUserRole, setCurrentUserRole }: { 
    currentUserRole: UserRole; 
    setCurrentUserRole: (role: UserRole) => void;
}) => {
    
    const roles = [
        { id: UserRole.BUYER, name: 'Người Mua' },
        { id: UserRole.SELLER, name: 'Người Bán' },
    ];

    return (
        <div className="px-4 py-4 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chuyển đổi vai trò</label>
            <div className="flex flex-col space-y-2">
                {roles.map(role => (
                    <button 
                        key={role.id}
                        onClick={() => setCurrentUserRole(role.id)}
                        className={`px-3 py-2 text-sm rounded-md font-semibold transition-colors text-left ${
                            currentUserRole === role.id 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {role.name}
                    </button>
                ))}
            </div>
        </div>
    );
};


const SellerProfile = ({ seller, onLogout }: { seller: Seller; onLogout: () => void }) => (
    <div className="px-4 py-4 border-t border-gray-200 bg-emerald-50">
        <p className="text-sm font-medium text-gray-700">Đã đăng nhập với tư cách:</p>
        <p className="font-bold text-emerald-800 truncate">{seller.name}</p>
        <p className="text-xs text-gray-600">{seller.phone}</p>
        <button
            onClick={onLogout}
            className="w-full mt-3 text-sm bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
            Đăng Xuất
        </button>
    </div>
);

// Icon components
const StoreIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H6.75A2.25 2.25 0 004.5 13.5V21M6 10.5h12M6 10.5a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h12A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5M18 10.5V21m-9-13.5v-1.125c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V9.375m-6.75 0L10.5 6.225 14.25 9.375" /> </svg> );
const MapIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-12.75l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" /> </svg> );
const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /> </svg> );
const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.4-1.4l-1.188-.648 1.188-.648a2.25 2.25 0 011.4-1.4l.648-1.188.648 1.188a2.25 2.25 0 011.4 1.4l1.188.648-1.188.648a2.25 2.25 0 01-1.4 1.4z" /> </svg> );
const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}> <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.821-6.831A1.125 1.125 0 0018.141 5H4.897M5.25 7.5h13.5M7.5 14.25v-6.375" /> </svg> );


const Sidebar = ({ currentView, setCurrentView, cartItemCount, currentUserRole, setCurrentUserRole, currentSeller, onLogout }: SidebarProps) => {
  const allNavItems: NavItemType[] = [
    { view: AppView.SELLER_DASHBOARD, icon: <StoreIcon />, text: 'Trang Bán Hàng', roles: [UserRole.SELLER] },
    { view: AppView.MAP_VIEW, icon: <MapIcon />, text: 'Bản Đồ Đặc Sản', roles: [UserRole.BUYER, UserRole.SELLER] },
    { view: AppView.INTERACTIVE_MAP, icon: <GlobeIcon />, text: 'Bản Đồ Tương Tác', roles: [UserRole.BUYER, UserRole.SELLER] },
    { view: AppView.PRODUCT_GALLERY, icon: <SparklesIcon />, text: 'Sản Phẩm', roles: [UserRole.BUYER, UserRole.SELLER] },
    { view: AppView.CART, icon: <ShoppingCartIcon />, text: 'Giỏ Hàng', roles: [UserRole.BUYER], badgeCount: cartItemCount },
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(currentUserRole));
  
  return (
    <aside className="hidden md:flex w-64 bg-white h-full border-r border-gray-200 flex-col flex-shrink-0">
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
                <Logo />
            </div>

            <nav className="flex-1 px-2 py-4 space-y-1">
                {visibleNavItems.map(item => (
                    <NavItem
                        key={item.view}
                        view={item.view}
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        icon={item.icon}
                        text={item.text}
                        badgeCount={item.badgeCount}
                    />
                ))}
            </nav>
            
            <RoleSwitcher currentUserRole={currentUserRole} setCurrentUserRole={setCurrentUserRole} />

            {currentUserRole === UserRole.SELLER && currentSeller && (
                <SellerProfile seller={currentSeller} onLogout={onLogout} />
            )}
        </div>
    </aside>
  );
};

export default Sidebar;
