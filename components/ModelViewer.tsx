import React from 'react';
import { Product } from '../types';

// Fix: Add a global declaration for the 'model-viewer' custom element to inform TypeScript about its existence and props, resolving JSX intrinsic element errors.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          ar?: boolean;
          'shadow-intensity'?: string;
          slot?: string;
          style?: React.CSSProperties;
        },
        HTMLElement
      >;
    }
  }
}

interface ModelViewerProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

const ModelViewer = ({ product, onClose, onAddToCart }: ModelViewerProps) => {
  if (!product.modelUrl) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-8 text-center animate-pop-in">
            <h2 className="text-xl font-semibold text-red-600">Lỗi</h2>
            <p className="text-gray-600 mt-2">Không tìm thấy mô hình 3D cho sản phẩm này.</p>
            <button
                onClick={onClose}
                className="mt-6 bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
                Đóng
            </button>
        </div>
      </div>
    );
  }

  const handleAddToCartClick = () => {
    onAddToCart(product);
    onClose(); // Optionally close the viewer after adding to cart
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col p-4 md:p-8 animate-fade-in backdrop-blur-sm">
        {/* Header */}
        <div className="flex justify-between items-start text-white mb-4 flex-shrink-0">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold">{product.productName}</h2>
                <p className="text-gray-300">Chế độ xem 3D/AR tương tác</p>
            </div>
            <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-300 hover:bg-white hover:bg-opacity-20 hover:text-white transition-colors"
                aria-label="Close viewer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* Main Content */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            {/* Model Viewer */}
            <div className="lg:col-span-2 w-full h-full min-h-[50vh] lg:min-h-0 rounded-lg overflow-hidden relative">
                <model-viewer
                    src={product.modelUrl}
                    alt={`Mô hình 3D của ${product.productName}`}
                    camera-controls
                    auto-rotate
                    ar
                    shadow-intensity="1"
                    style={{ width: '100%', height: '100%', backgroundColor: '#1e293b' }} // slate-800
                >
                    <div 
                        slot="progress-bar" 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 bg-gray-300 rounded-full" 
                        style={{width: '80%'}}
                    ></div>
                     <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-3 py-1.5 rounded-lg">
                        Kéo để xoay | Chụm để thu phóng | Sử dụng nút AR (góc phải) trên thiết bị hỗ trợ
                     </div>
                </model-viewer>
            </div>

            {/* Product Details & Actions */}
            <div className="bg-white bg-opacity-10 rounded-lg p-6 text-white flex flex-col backdrop-blur-sm border border-white border-opacity-20">
                <h3 className="text-xl font-bold mb-2 text-gray-100">Thông tin chi tiết</h3>
                <p className="text-gray-300 mb-2">
                    <span className="font-semibold text-gray-100">Loại:</span> {product.category}
                </p>
                 <p className="text-gray-300 mb-4">
                    <span className="font-semibold text-gray-100">Bán bởi:</span> {product.sellerName}
                </p>
                
                <div className="my-4">
                    <p className="text-sm text-gray-400">Giá tham khảo</p>
                    <p className="text-4xl font-bold text-emerald-400">{product.priceRange}</p>
                </div>
                
                <div className="flex-grow overflow-y-auto max-h-48 pr-2 my-4">
                    <p className="text-sm text-gray-200 whitespace-pre-wrap">{product.description}</p>
                </div>
                
                <button 
                    onClick={handleAddToCartClick}
                    className="w-full mt-auto bg-emerald-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-emerald-600 transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-400 btn-primary"
                >
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    </div>
  );
};

export default ModelViewer;
