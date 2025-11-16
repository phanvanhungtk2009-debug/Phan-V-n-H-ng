import React from 'react';
import { Product, ProductAnalysisResult } from '../../types';
import { analyzeProductListing } from '../../services/geminiService';
import Card from '../common/Card';
import Spinner, { ButtonSpinner } from '../common/Spinner';

interface ProductAnalysisProps {
    products: Product[];
    onUpdateProduct: (productId: string, updatedData: Partial<Product>) => void;
}

const ProductAnalysis = ({ products, onUpdateProduct }: ProductAnalysisProps) => {
    const [selectedProductId, setSelectedProductId] = React.useState<string>(products[0]?.id || '');
    const [analysisResult, setAnalysisResult] = React.useState<ProductAnalysisResult | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (products.length > 0 && !products.find(p => p.id === selectedProductId)) {
            setSelectedProductId(products[0].id);
        } else if (products.length === 0) {
            setSelectedProductId('');
        }
    }, [products, selectedProductId]);

    const handleAnalyze = async () => {
        const product = products.find(p => p.id === selectedProductId);
        if (!product) return;
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const resultString = await analyzeProductListing(product);
            setAnalysisResult(JSON.parse(resultString));
        } catch (e) {
            setError('Lỗi phân tích sản phẩm. Vui lòng thử lại.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplySuggestions = () => {
        if (!analysisResult || !selectedProductId) return;
        onUpdateProduct(selectedProductId, {
            productName: analysisResult.suggestedName,
            description: analysisResult.suggestedDescription,
        });
        alert('Đã áp dụng các đề xuất về tên và mô tả!');
    };
    
    if (products.length === 0) {
        return (
            <Card>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Phân tích & Tối ưu Sản phẩm với AI</h3>
                <p className="text-gray-600 text-center">Bạn chưa có sản phẩm nào để phân tích.</p>
            </Card>
        )
    }

    return (
        <Card>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Phân tích & Tối ưu Sản phẩm với AI</h3>
             <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-grow w-full">
                    <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 mb-1">Chọn sản phẩm để phân tích</label>
                    <select
                        id="product-select"
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                        {products.map(p => <option key={p.id} value={p.id}>{p.productName}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !selectedProductId}
                    className="w-full md:w-auto text-white font-bold py-3 px-6 rounded-lg transition-colors btn-primary flex items-center justify-center"
                >
                    {isLoading ? <ButtonSpinner /> : 'Phân tích'}
                </button>
            </div>
             {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
             {isLoading && (
                <div className="text-center mt-6">
                    <Spinner />
                    <p className="text-gray-600 mt-2">AI đang phân tích sản phẩm, vui lòng chờ...</p>
                </div>
            )}
             {analysisResult && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <h4 className="font-bold text-gray-800">Kết quả phân tích & Đề xuất:</h4>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <strong className="text-gray-600">Tên mới đề xuất:</strong>
                        <p className="text-lg font-semibold text-emerald-700">{analysisResult.suggestedName}</p>
                    </div>
                     <div className="p-4 bg-gray-50 rounded-lg border">
                        <strong className="text-gray-600">Mô tả mới đề xuất:</strong>
                        <p className="text-gray-700 whitespace-pre-wrap">{analysisResult.suggestedDescription}</p>
                    </div>
                     <div className="p-4 bg-gray-50 rounded-lg border">
                        <strong className="text-gray-600">Nhận xét về giá:</strong>
                        <p className="text-gray-700">{analysisResult.priceFeedback}</p>
                    </div>
                     <div className="p-4 bg-gray-50 rounded-lg border">
                        <strong className="text-gray-600">Mẹo Marketing:</strong>
                        <ul className="list-disc list-inside mt-1 text-gray-700">
                            {analysisResult.marketingTips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </div>
                    <button
                        onClick={handleApplySuggestions}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Áp dụng Tên & Mô tả mới
                    </button>
                </div>
            )}
        </Card>
    );
};

export default ProductAnalysis;
