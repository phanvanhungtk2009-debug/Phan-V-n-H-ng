import React from 'react';
import Card from './common/Card';
import SellerAuth from './SellerAuth';
import { UserRole, Seller } from '../types';

interface AccountViewProps {
    currentUserRole: UserRole;
    setCurrentUserRole: (role: UserRole) => void;
    currentSeller: Seller | null;
    onLogin: (seller: Seller) => void;
    onLogout: () => void;
}

const RoleSwitcher = ({ currentUserRole, setCurrentUserRole }: { 
    currentUserRole: UserRole; 
    setCurrentUserRole: (role: UserRole) => void;
}) => {
    const roles = [
        { id: UserRole.BUYER, name: 'Tôi là Người Mua', icon: '🛒' },
        { id: UserRole.SELLER, name: 'Tôi là Người Bán', icon: '🏪' },
    ];

    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Chuyển đổi vai trò</h3>
            <div className="flex flex-col space-y-3">
                {roles.map(role => (
                    <button 
                        key={role.id}
                        onClick={() => setCurrentUserRole(role.id)}
                        className={`p-4 text-md rounded-lg font-semibold transition-all text-left flex items-center gap-3 ${
                            currentUserRole === role.id 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <span>{role.icon}</span>
                        <span>{role.name}</span>
                    </button>
                ))}
            </div>
        </Card>
    );
};

const SellerProfile = ({ seller, onLogout }: { seller: Seller; onLogout: () => void }) => (
     <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Thông tin người bán</h3>
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-sm font-medium text-gray-700">Đã đăng nhập với tư cách:</p>
            <p className="font-bold text-emerald-800 truncate text-lg">{seller.name}</p>
            <p className="text-sm text-gray-600">{seller.phone}</p>
            <button
                onClick={onLogout}
                className="w-full mt-4 text-sm bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
                Đăng Xuất
            </button>
        </div>
    </Card>
);

const AccountView = ({ currentUserRole, setCurrentUserRole, currentSeller, onLogin, onLogout }: AccountViewProps) => {
    return (
        <div className="space-y-6">
            <Card>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tài Khoản</h1>
                <p className="text-gray-600 mt-1">Quản lý thông tin và vai trò của bạn tại đây.</p>
            </Card>

            {currentUserRole === UserRole.SELLER && (
                currentSeller ? <SellerProfile seller={currentSeller} onLogout={onLogout} /> : <SellerAuth onLogin={onLogin} />
            )}

            <RoleSwitcher currentUserRole={currentUserRole} setCurrentUserRole={setCurrentUserRole} />
        </div>
    );
};

export default AccountView;
