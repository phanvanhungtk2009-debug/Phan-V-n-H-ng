import React from 'react';
import { Product } from '../types';
import Card from './common/Card';

interface InteractiveMapProps {
  products: Product[];
  onView3D: (product: Product) => void;
}

const InteractiveMap = ({ products, onView3D }: InteractiveMapProps) => {
  const productsWith3D = products.filter(p => p.has3DModel && p.modelUrl);

  return (
    <Card>
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Bản Đồ Tương Tác 3D</h2>
      {productsWith3D.length > 0 ? (
        <div>
          <p className="text-slate-600 mb-6">Chọn một sản phẩm để xem ở chế độ 3D/AR.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productsWith3D.map(product => (
              <div key={product.id} className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onView3D(product)}>
                <img src={product.brandImageUrl} alt={product.productName} className="w-full h-40 object-cover rounded-md mb-2" />
                <h3 className="font-semibold">{product.productName}</h3>
                <p className="text-sm text-slate-500">{product.category}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-500 py-12">
          <p>Chưa có sản phẩm nào có mô hình 3D để hiển thị trên bản đồ tương tác.</p>
        </div>
      )}
    </Card>
  );
};

export default InteractiveMap;
