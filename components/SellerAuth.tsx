import React from 'react';
import Card from './common/Card';
import { Seller } from '../types';

interface SellerAuthProps {
    onLogin: (seller: Seller) => void;
}

const SellerAuth = ({ onLogin }: SellerAuthProps) => {
    const [name, setName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            setError('Vui lòng nhập đầy đủ tên và số điện thoại.');
            return;
        }
        // Basic phone validation for 10 digits
        if (!/^\d{10}$/.test(phone)) {
             setError('Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.');
             return;
        }
        setError('');
        onLogin({
            id: phone,
            name,
            phone,
        });
    };

    return (
        <Card>
            <div className="max-w-md mx-auto text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Chào Mừng Người Bán</h2>
                <p className="text-gray-600 mb-6">Đăng ký hoặc đăng nhập để bắt đầu đăng bán sản phẩm của bạn trên Chợ Số.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="seller-name" className="block text-sm font-medium text-gray-700 text-left mb-1">Tên Người Bán / Tên Gian Hàng</label>
                        <input
                            type="text"
                            id="seller-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ví dụ: A Tủa"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="seller-phone" className="block text-sm font-medium text-gray-700 text-left mb-1">Số Điện Thoại</label>
                        <input
                            type="tel"
                            id="seller-phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0912345678"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                         <p className="text-xs text-gray-500 mt-1 text-left">Số điện thoại sẽ được dùng để đăng nhập và liên hệ.</p>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg btn-primary"
                    >
                        Đăng Nhập / Đăng Ký
                    </button>
                </form>
            </div>
        </Card>
    );
};

export default SellerAuth;
