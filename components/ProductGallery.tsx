import React from 'react';
import Card from './common/Card';
import { Product } from '../types';

interface ProductGalleryProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

const ProductGallery = ({ products, onAddToCart }: ProductGalleryProps) => {
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

    const handleAddToCartClick = () => {
        if (selectedProduct) {
            onAddToCart(selectedProduct);
            setSelectedProduct(null); // Close modal after adding
        }
    };

    if (products.length === 0) {
        return (
            <Card>
                <div className="text-center text-gray-500 py-12">
                    <p>Không có sản phẩm nào để hiển thị.</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tất cả Sản phẩm</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map(product => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="bg-white rounded-lg shadow cursor-pointer card-interactive overflow-hidden group"
                        >
                            <img
                                src={product.brandImageUrl}
                                alt={product.productName}
                                className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="p-3">
                                <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">{product.productName}</h3>
                                <p className="text-sm text-emerald-600 font-semibold mt-1">{product.priceRange}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
            
            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedProduct(null)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-pop-in" onClick={e => e.stopPropagation()}>
                        <div className="p-4 md:p-6">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800">{selectedProduct.productName}</h2>
                                <button onClick={() => setSelectedProduct(null)} className="p-2 text-gray-400 hover:text-gray-600" aria-label="Close">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="mt-4 md:flex md:gap-6">
                                <img src={selectedProduct.brandImageUrl} alt={selectedProduct.productName} className="w-full md:w-1/2 h-56 object-cover rounded-lg shadow-md" />
                                <div className="mt-4 md:mt-0">
                                    <p className="text-2xl font-bold text-emerald-600">{selectedProduct.priceRange}</p>
                                    <p className="text-sm text-gray-600 mt-2">{selectedProduct.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 md:p-6 rounded-b-xl flex justify-end">
                            <button
                                onClick={handleAddToCartClick}
                                className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors btn-primary"
                            >
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductGallery;
