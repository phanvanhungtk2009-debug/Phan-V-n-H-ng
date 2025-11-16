import React from 'react';
import { Product } from '../../types';
import Card from '../common/Card';

interface ProductManagementProps {
    products: Product[];
    onAddNewProduct: () => void;
    onEditProduct: (p: Product) => void;
    onRemoveProduct: (id: string) => void;
}

const ProductManagement = ({ products, onAddNewProduct, onEditProduct, onRemoveProduct }: ProductManagementProps) => (
    <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">Quản lý Sản phẩm ({products.length})</h3>
            <button onClick={onAddNewProduct} className="w-full md:w-auto bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors btn-primary">
                + Thêm sản phẩm mới
            </button>
        </div>
        <Card className="!p-0 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.brandImageUrl} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.productName}</div>
                                            <div className="text-sm text-gray-500">{product.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.priceRange}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => onEditProduct(product)} className="text-blue-600 hover:text-blue-900">Sửa</button>
                                    <button onClick={() => onRemoveProduct(product.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
);

export default ProductManagement;
