import React from 'react';
import { Product, Seller, Order, OrderStatus } from '../types';
import Card from './common/Card';
import ConfirmationDialog from './common/ConfirmationDialog';

// Import the new components
import DashboardStats from './seller-dashboard/DashboardStats';
import ProductManagement from './seller-dashboard/ProductManagement';
import OrderManagement from './seller-dashboard/OrderManagement';
import AIToolsPanel from './seller-dashboard/AIToolsPanel';


interface SellerDashboardProps {
  seller: Seller;
  products: Product[];
  orders: Order[];
  onAddNewProduct: () => void;
  onEditProduct: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onRemoveOrder: (orderId: string) => void;
  onUpdateProduct: (productId: string, updatedData: Partial<Product>) => void;
}

type DashboardTab = 'stats' | 'products' | 'orders' | 'ai_tools';

const SellerDashboard = ({ 
    seller, 
    products, 
    orders, 
    onAddNewProduct, 
    onEditProduct, 
    onRemoveProduct, 
    onUpdateOrderStatus, 
    onRemoveOrder, 
    onUpdateProduct
}: SellerDashboardProps) => {
    const [activeTab, setActiveTab] = React.useState<DashboardTab>('stats');
    const [productToDelete, setProductToDelete] = React.useState<string | null>(null);
    const [orderToDelete, setOrderToDelete] = React.useState<string | null>(null);

    const tabs = [
        { id: 'stats', label: '📊 Thống kê' },
        { id: 'products', label: '📦 Sản phẩm' },
        { id: 'orders', label: '🧾 Đơn hàng' },
        { id: 'ai_tools', label: '✨ Công cụ AI' },
    ];

    const handleRequestDelete = (type: 'product' | 'order', id: string) => {
        if (type === 'product') setProductToDelete(id);
        else setOrderToDelete(id);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            onRemoveProduct(productToDelete);
            setProductToDelete(null);
        }
        if (orderToDelete) {
            onRemoveOrder(orderToDelete);
            setOrderToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setProductToDelete(null);
        setOrderToDelete(null);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'stats':
                return <DashboardStats products={products} orders={orders} />;
            case 'products':
                return <ProductManagement products={products} onAddNewProduct={onAddNewProduct} onEditProduct={onEditProduct} onRemoveProduct={(id) => handleRequestDelete('product', id)} />;
            case 'orders':
                return <OrderManagement orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} onRemoveOrder={(id) => handleRequestDelete('order', id)} />;
            case 'ai_tools':
                return <AIToolsPanel products={products} onUpdateProduct={onUpdateProduct}/>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Trang Quản lý & Bán Hàng</h2>
                <p className="text-gray-600 text-sm md:text-base">Chào mừng trở lại, {seller.name}! Quản lý cửa hàng và sử dụng công cụ AI tại đây.</p>
            </Card>

            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-xl">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as DashboardTab)}
                        className={`flex-1 px-3 py-2 text-sm md:text-base font-semibold rounded-lg transition-all transform focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 ${
                            activeTab === tab.id
                                ? 'bg-emerald-600 text-white shadow-md scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>


            <div className="animate-fade-in pt-2">
                {renderContent()}
            </div>
            
            <ConfirmationDialog
                isOpen={!!productToDelete || !!orderToDelete}
                title={productToDelete ? "Xác nhận xóa sản phẩm" : "Xác nhận xóa đơn hàng"}
                message="Bạn có chắc chắn muốn xóa vĩnh viễn mục này không? Hành động này không thể hoàn tác."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
};


export default SellerDashboard;
