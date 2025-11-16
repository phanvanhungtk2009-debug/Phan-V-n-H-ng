import React from 'react';
import { Product } from '../../types';
import ImageGenerator from '../ImageGenerator';
import MarketExplorer from '../MarketExplorer';
import BusinessPlanner from '../BusinessPlanner';
import VideoAnalyzer from '../VideoAnalyzer';
import ProductAnalysis from './ProductAnalysis';

interface AIToolsPanelProps {
    products: Product[];
    onUpdateProduct: (productId: string, updatedData: Partial<Product>) => void;
}

const AIToolMap = {
    'product-analysis': { name: 'Phân tích Sản phẩm', icon: '🧪', component: ProductAnalysis },
    'image-generator': { name: 'Tạo Ảnh AI', icon: '🖼️', component: ImageGenerator },
    'market-explorer': { name: 'Khám Phá Thị Trường', icon: '🔍', component: MarketExplorer },
    'business-planner': { name: 'Tư Vấn Kinh Doanh', icon: '📈', component: BusinessPlanner },
    'video-analyzer': { name: 'Phân Tích Video', icon: '📹', component: VideoAnalyzer },
};
type AIToolKey = keyof typeof AIToolMap;

const AIToolsPanel = ({ products, onUpdateProduct }: AIToolsPanelProps) => {
    const [activeTool, setActiveTool] = React.useState<AIToolKey>('product-analysis');
    
    const ActiveComponent = AIToolMap[activeTool].component;
    const componentProps = activeTool === 'product-analysis' ? { products, onUpdateProduct } : {};

    return (
         <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Công cụ AI Hỗ trợ Kinh doanh</h3>
            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg mb-6">
                {Object.entries(AIToolMap).map(([key, tool]) => (
                     <button
                        key={key}
                        onClick={() => setActiveTool(key as AIToolKey)}
                        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors flex-grow ${
                            activeTool === key
                                ? 'bg-emerald-600 text-white shadow'
                                : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {tool.icon} {tool.name}
                    </button>
                ))}
            </div>
            <div className="animate-fade-in">
                {/* @ts-ignore */}
                <ActiveComponent {...componentProps} />
            </div>
        </div>
    );
};

export default AIToolsPanel;
