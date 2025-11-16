import React from 'react';
import { analyzeProductImage, generate3DConceptImage } from '../services/geminiService';
import FileUpload from './common/FileUpload';
import Spinner from './common/Spinner';
import Card from './common/Card';
import { QRCodeSVG } from 'qrcode.react';
import { useGeolocation } from '../hooks/useGeolocation';
import { Product } from '../types';
import CameraCapture from './CameraCapture';

interface ProductData {
    productName: string;
    category: string;
    priceRange: string;
    description: string;
    modelUrl?: string;
}

interface ProductListerProps {
    onSaveProduct: (product: Omit<Product, 'sellerId' | 'sellerName'>) => void;
    productToEdit?: Product | null;
}

enum ProcessingState {
    IDLE,
    PROCESSING_AI,
    DONE,
    ERROR,
}

const ProductLister = ({ onSaveProduct, productToEdit }: ProductListerProps) => {
    const [originalImageFile, setOriginalImageFile] = React.useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = React.useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = React.useState(false);
    
    const [processingState, setProcessingState] = React.useState<ProcessingState>(ProcessingState.IDLE);
    const [error, setError] = React.useState<string | null>(null);

    const [productData, setProductData] = React.useState<ProductData | null>(null);
    const [brandImageUrl, setBrandImageUrl] = React.useState<string | null>(null);
    const [qrValue, setQrValue] = React.useState<string>('');
    const [sellerPhone, setSellerPhone] = React.useState<string>('');
    
    const location = useGeolocation();
    
    React.useEffect(() => {
        if (productToEdit) {
            setProcessingState(ProcessingState.DONE);
            setProductData({
                productName: productToEdit.productName,
                category: productToEdit.category,
                priceRange: productToEdit.priceRange,
                description: productToEdit.description,
                modelUrl: productToEdit.modelUrl
            });
            setBrandImageUrl(productToEdit.brandImageUrl);
            setOriginalImageUrl(productToEdit.originalImageUrl);
            setQrValue(productToEdit.qrValue);
            setSellerPhone(productToEdit.sellerPhone);
        }
    }, [productToEdit]);

    React.useEffect(() => {
        if (productData) {
            setQrValue(JSON.stringify({
                productName: productData.productName,
                category: productData.category,
                priceRange: productData.priceRange,
            }));
        }
    }, [productData]);

    const handleAiAnalyze = async (file: File) => {
        setProcessingState(ProcessingState.PROCESSING_AI);
        setError(null);
        try {
            // Run both API calls concurrently for better performance
            const [analysisResult, conceptImageBase64] = await Promise.all([
                analyzeProductImage(file),
                generate3DConceptImage(file)
            ]);

            if (!analysisResult) {
                throw new Error("AI không trả về dữ liệu phân tích sản phẩm. Hình ảnh có thể không được hỗ trợ.");
            }
             if (!conceptImageBase64) {
                throw new Error("AI không thể tạo hình ảnh đại diện. Hình ảnh có thể vi phạm chính sách nội dung.");
            }

            const parsedData = JSON.parse(analysisResult);
            setProductData(parsedData);
            setBrandImageUrl(`data:image/png;base64,${conceptImageBase64}`);
            setProcessingState(ProcessingState.DONE);
        } catch (err) {
            console.error('AI analysis failed:', err);
            let userFriendlyError = "Đã có lỗi xảy ra trong quá trình phân tích của AI. Vui lòng thử lại.";

            if (err instanceof SyntaxError) {
                // This catches JSON.parse errors
                userFriendlyError = "AI đã trả về một phản hồi không hợp lệ. Điều này có thể do hình ảnh mờ hoặc không rõ ràng. Vui lòng thử một hình ảnh khác.";
            } else if (err instanceof Error) {
                if (err.message.includes("AI không")) { // Catches my custom errors
                    userFriendlyError = err.message;
                } else if (err.message.toLowerCase().includes('network') || err.message.toLowerCase().includes('failed to fetch')) {
                    userFriendlyError = "Không thể kết nối đến máy chủ AI. Vui lòng kiểm tra kết nối mạng và thử lại.";
                } else {
                    // Generic catch-all for other Gemini API errors
                    userFriendlyError = "Phân tích AI thất bại. Hình ảnh có thể không phù hợp hoặc không được AI nhận dạng. Vui lòng thử một hình ảnh chất lượng tốt hơn, rõ nét hơn.";
                }
            }
            
            setError(userFriendlyError);
            setProcessingState(ProcessingState.ERROR);
        }
    };

    const handleOriginalImageSelect = (file: File | null) => {
        if (file) {
            setOriginalImageFile(file);
            setOriginalImageUrl(URL.createObjectURL(file));
            setProductData(null);
            setBrandImageUrl(null);
            setError(null);
            handleAiAnalyze(file);
        }
    };

    const handleCameraCapture = (file: File) => {
        handleOriginalImageSelect(file);
        setIsCameraOpen(false);
    };

    const handleInputChange = (field: keyof ProductData | 'sellerPhone', value: string) => {
        if (field === 'sellerPhone') {
            setSellerPhone(value);
        } else {
            setProductData(prev => prev ? { ...prev, [field]: value } : null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productData || !brandImageUrl || !originalImageUrl || !sellerPhone) {
            alert('Vui lòng hoàn tất đầy đủ thông tin sản phẩm, bao gồm cả SĐT.');
            return;
        }
        if (location.loading) {
            alert('Đang chờ lấy vị trí, vui lòng đợi...');
            return;
        }

        // FIX: Stricter check for location data to prevent saving null values.
        const { latitude, longitude, error: locationError } = location;
        if (locationError || latitude === null || longitude === null) {
            alert(`Không thể lấy vị trí: ${locationError || 'Vui lòng cấp quyền vị trí'}. Vui lòng cấp quyền và thử lại.`);
            return;
        }

        const finalProduct: Omit<Product, 'sellerId' | 'sellerName'> = {
            id: productToEdit?.id || `prod_${new Date().getTime()}`,
            productName: productData.productName,
            category: productData.category,
            priceRange: productData.priceRange,
            description: productData.description,
            brandImageUrl: brandImageUrl,
            originalImageUrl: originalImageUrl,
            qrValue: qrValue,
            sellerPhone: sellerPhone,
            location: {
                latitude: latitude,
                longitude: longitude,
            },
            has3DModel: !!productData.modelUrl,
            modelUrl: productData.modelUrl,
            ratings: productToEdit?.ratings || [],
        };
        onSaveProduct(finalProduct);
    };
    
    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                    {productToEdit ? 'Chỉnh sửa sản phẩm' : 'Đăng sản phẩm mới với AI'}
                </h2>
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                    {productToEdit ? 'Cập nhật thông tin chi tiết cho sản phẩm của bạn.' : 'Tải lên hình ảnh sản phẩm gốc để AI tự động phân tích và tạo nội dung.'}
                </p>
            </Card>

            <Card>
                <h3 className="font-semibold text-gray-700 mb-3">Bước 1: Tải ảnh sản phẩm gốc</h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className={`flex-1 transition-opacity ${processingState === ProcessingState.PROCESSING_AI ? 'opacity-50 pointer-events-none' : ''}`}>
                        <FileUpload onFileSelect={handleOriginalImageSelect} accept="image/*" />
                    </div>
                    <div className="flex items-center justify-center text-gray-500">Hoặc</div>
                    <div className="flex-1">
                        <button 
                            onClick={() => setIsCameraOpen(true)} 
                            disabled={processingState === ProcessingState.PROCESSING_AI}
                            className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50 border-2 border-gray-300 border-dashed rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium text-gray-600">Sử dụng Camera</span>
                        </button>
                    </div>
                </div>
                
                 {(originalImageUrl || processingState !== ProcessingState.IDLE) && (
                    <div className="mt-4">
                         {processingState === ProcessingState.ERROR ? (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Lỗi Phân Tích</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : originalImageUrl && (
                            <div className="relative max-w-sm mx-auto bg-gray-100 rounded-lg p-2">
                                <img 
                                    src={originalImageUrl} 
                                    alt="Original product" 
                                    className={`rounded-lg shadow-md max-h-64 w-full object-contain transition-opacity duration-300 ${processingState === ProcessingState.PROCESSING_AI ? 'opacity-20' : 'opacity-100'}`}
                                />
                                {processingState === ProcessingState.PROCESSING_AI && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                        <Spinner />
                                        <p className="mt-4 text-gray-700 font-semibold">AI đang phân tích & tạo hình ảnh...</p>
                                        <p className="text-sm text-gray-600">Vui lòng đợi trong giây lát.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {isCameraOpen && <CameraCapture onCapture={handleCameraCapture} onClose={() => setIsCameraOpen(false)} />}
            
            {processingState === ProcessingState.DONE && productData && (
                <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                    <Card>
                        <h3 className="font-semibold text-gray-700 mb-4">Bước 2: Xem lại, chỉnh sửa và đăng bán</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh đại diện (AI tạo)</label>
                                    {brandImageUrl ? <img src={brandImageUrl} alt="Brand" className="rounded-lg shadow-md w-full" /> : <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">...</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mã QR truy xuất nguồn gốc</label>
                                    <div className="p-4 bg-white border rounded-lg flex justify-center">
                                      {qrValue && <QRCodeSVG value={qrValue} size={160} />}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                                    <input type="text" id="productName" value={productData.productName} onChange={e => handleInputChange('productName', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required/>
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Phân loại</label>
                                    <input type="text" id="category" value={productData.category} onChange={e => handleInputChange('category', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required/>
                                </div>
                                <div>
                                    <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">Giá bán</label>
                                    <input type="text" id="priceRange" value={productData.priceRange} onChange={e => handleInputChange('priceRange', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required/>
                                </div>
                                 <div>
                                    <label htmlFor="sellerPhone" className="block text-sm font-medium text-gray-700">SĐT Liên hệ (của bạn)</label>
                                    <input type="tel" id="sellerPhone" value={sellerPhone} onChange={e => handleInputChange('sellerPhone', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required placeholder="Nhập SĐT của bạn"/>
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Mô tả</label>
                                    <textarea id="description" value={productData.description} onChange={e => handleInputChange('description', e.target.value)} rows={6} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500" required></textarea>
                                </div>
                                {productData.modelUrl && (
                                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-md">
                                        <p className="text-sm text-indigo-800"><span className="font-semibold">Mô hình 3D:</span> AI đã đề xuất một mô hình 3D cho sản phẩm này.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <button type="submit" className="w-full text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg btn-primary disabled:opacity-50" disabled={processingState === ProcessingState.PROCESSING_AI}>
                            {productToEdit ? 'Lưu thay đổi' : 'Đăng bán sản phẩm'}
                        </button>
                    </Card>
                </form>
            )}
        </div>
    );
};

export default ProductLister;
