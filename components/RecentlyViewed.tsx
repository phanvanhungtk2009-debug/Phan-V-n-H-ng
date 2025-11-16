import React from 'react';
import { Product } from '../types';

interface RecentlyViewedProps {
    products: Product[];
    onProductClick: (product: Product) => void;
}

const RecentlyViewed = ({ products, onProductClick }: RecentlyViewedProps) => {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-4xl z-[1000] animate-fade-in">
             <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 px-1">Đã xem gần đây</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => onProductClick(product)}
                            className="flex-shrink-0 w-32 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-200 group"
                        >
                            <img
                                src={product.brandImageUrl}
                                alt={product.productName}
                                className="w-full h-20 object-cover rounded-t-lg"
                            />
                            <div className="p-2">
                                <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-emerald-600">
                                    {product.productName}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecentlyViewed;
