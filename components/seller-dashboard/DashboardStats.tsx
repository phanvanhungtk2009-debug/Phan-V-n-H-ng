import React from 'react';
import { Product, Order } from '../../types';

interface DashboardStatsProps {
    products: Product[];
    orders: Order[];
}

const DashboardStats = ({ products, orders }: DashboardStatsProps) => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    return (
        <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Thống kê Tổng quan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative p-4 bg-blue-50 rounded-lg border border-blue-200 text-center overflow-hidden">
                    <div className="absolute -right-2 -top-2 text-6xl text-blue-200 opacity-50">📦</div>
                    <p className="text-sm text-blue-800 font-medium relative z-10">Tổng Sản Phẩm</p>
                    <p className="text-2xl md:text-3xl font-bold text-blue-600 relative z-10">{totalProducts}</p>
                </div>
                <div className="relative p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center overflow-hidden">
                    <div className="absolute -right-2 -top-2 text-6xl text-emerald-200 opacity-50">🧾</div>
                    <p className="text-sm text-emerald-800 font-medium relative z-10">Tổng Đơn Hàng</p>
                    <p className="text-2xl md:text-3xl font-bold text-emerald-600 relative z-10">{totalOrders}</p>
                </div>
                <div className="relative p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center overflow-hidden">
                    <div className="absolute -right-2 -top-2 text-6xl text-yellow-200 opacity-50">💰</div>
                    <p className="text-sm text-yellow-800 font-medium relative z-10">Tổng Doanh Thu</p>
                    <p className="text-2xl md:text-3xl font-bold text-yellow-600 relative z-10">{new Intl.NumberFormat('vi-VN').format(totalRevenue)} đ</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
