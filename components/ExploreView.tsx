import React from 'react';
import { AppView, Product } from '../types';
import Card from './common/Card';

interface ExploreViewProps {
    onNavigate: (view: AppView) => void;
    onProductClick: (product: Product) => void;
    products: Product[];
}

const ExploreView = ({ onNavigate, onProductClick, products }: ExploreViewProps) => {

    const featuredProducts = React.useMemo(() => {
        // Simple logic: get first 5 products. Could be randomized or based on ratings later.
        return products.slice(0, 5);
    }, [products]);

    return (
        <div className="space-y-6">
            <Card>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Khám phá Đặc sản Việt</h1>
                <p className="text-gray-600 mt-2">Tìm kiếm sản phẩm, khám phá trên bản đồ hoặc xem các mặt hàng nổi bật.</p>
                <div className="mt-4 relative">
                    <input
                        type="search"
                        placeholder="Bạn muốn tìm gì hôm nay?"
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        onFocus={() => onNavigate(AppView.MAP_VIEW)} // Navigate to map view to use its powerful search
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
            </Card>

            <Card
                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => onNavigate(AppView.MAP_VIEW)}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Bản Đồ Đặc Sản</h2>
                        <p className="text-sm opacity-90">Xem sản phẩm trực quan theo vị trí địa lý.</p>
                    </div>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
            </Card>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 px-2">Sản phẩm nổi bật</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
                    {featuredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => onProductClick(product)}
                            className="flex-shrink-0 w-48 bg-white rounded-lg shadow cursor-pointer card-interactive"
                        >
                             <img
                                src={product.brandImageUrl}
                                alt={product.productName}
                                className="w-full h-28 object-cover rounded-t-lg"
                            />
                            <div className="p-3">
                                <h4 className="text-sm font-bold text-gray-800 truncate">{product.productName}</h4>
                                <p className="text-sm text-emerald-600 font-semibold mt-1">{product.priceRange}</p>
                            </div>
                        </div>
                    ))}
                     <div
                        onClick={() => onNavigate(AppView.PRODUCT_GALLERY)}
                        className="flex-shrink-0 w-48 bg-gray-50 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center p-4 border-2 border-dashed hover:border-emerald-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        <p className="mt-2 text-sm font-semibold text-emerald-700">Xem tất cả sản phẩm</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreView;
