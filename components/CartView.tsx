import React from 'react';
import { CartItem } from '../types';
import Card from './common/Card';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const CartView = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: CartViewProps) => {
  const calculateSubtotal = (item: CartItem): number => {
    const price = parseFloat(item.priceRange.replace(/[^0-9]/g, '')) || 0;
    return price * item.quantity;
  };

  const total = cartItems.reduce((sum, item) => sum + calculateSubtotal(item), 0);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Giỏ Hàng Của Bạn</h2>
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>Giỏ hàng của bạn đang trống.</p>
            <p>Hãy khám phá thêm các sản phẩm nhé!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <img src={item.brandImageUrl} alt={item.productName} className="w-20 h-20 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                    <p className="text-sm text-gray-500">{item.priceRange}</p>
                    <button onClick={() => onRemoveItem(item.id)} className="text-xs text-red-500 hover:underline mt-1">Xóa</button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                    className="w-16 p-2 border border-gray-300 rounded-lg text-center"
                  />
                  <p className="font-semibold w-24 text-right">{new Intl.NumberFormat('vi-VN').format(calculateSubtotal(item))}đ</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {cartItems.length > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-700">Tổng cộng:</span>
            <span className="text-2xl font-bold text-emerald-600">{new Intl.NumberFormat('vi-VN').format(total)}đ</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors text-lg btn-primary"
          >
            Tiến hành Thanh toán
          </button>
        </Card>
      )}
    </div>
  );
};

export default CartView;
