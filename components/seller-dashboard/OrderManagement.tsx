import React from 'react';
import { Order, OrderStatus } from '../../types';

interface OrderManagementProps {
    orders: Order[];
    onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
    onRemoveOrder: (id: string) => void;
}

const OrderManagement = ({ orders, onUpdateOrderStatus, onRemoveOrder }: OrderManagementProps) => (
    <div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Quản lý Đơn hàng ({orders.length})</h3>
        <div className="space-y-4">
            {orders.map(order => (
                <div key={order.id} className="p-4 border rounded-lg bg-white shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h4 className="font-bold">Đơn hàng #{order.id.slice(-6)}</h4>
                            <p className="text-xs text-gray-500">Ngày: {order.date}</p>
                            <ul>
                                {order.items.map(item => (
                                    <li key={item.id} className="text-sm text-gray-600 ml-4 list-disc">{item.productName} (x{item.quantity})</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center gap-4">
                             <p className="font-bold text-emerald-700">{new Intl.NumberFormat('vi-VN').format(order.totalPrice)} đ</p>
                            <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className="p-2 border border-gray-300 rounded-lg text-sm"
                            >
                                {Object.values(OrderStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                             <button onClick={() => onRemoveOrder(order.id)} className="text-red-600 hover:text-red-900 p-2" aria-label="Xóa đơn hàng">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default OrderManagement;
