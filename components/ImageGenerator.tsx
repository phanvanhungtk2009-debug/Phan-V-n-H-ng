import React from 'react';
import Card from './common/Card';
import Spinner, { ButtonSpinner } from './common/Spinner';
import { generateImage } from '../services/geminiService';

const ImageGenerator = () => {
    const [prompt, setPrompt] = React.useState('');
    const [aspectRatio, setAspectRatio] = React.useState('1:1');
    const [generatedImage, setGeneratedImage] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const aspectRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Vui lòng nhập mô tả cho hình ảnh.');
            return;
        }
        setLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const imageBytes = await generateImage(prompt, aspectRatio);
            setGeneratedImage(`data:image/jpeg;base64,${imageBytes}`);
        } catch (err) {
            setError('Không thể tạo hình ảnh. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tạo Ảnh Sản Phẩm với AI</h2>
                <p className="text-gray-600 mb-4">
                    Mô tả hình ảnh bạn muốn tạo. Ví dụ: "Một giỏ măng tây tươi xanh đặt trên tấm vải thô, ánh nắng ban mai chiếu vào."
                </p>
                
                <div className="space-y-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Nhập mô tả của bạn ở đây..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                        rows={4}
                    />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tỷ Lệ Khung Hình</label>
                        <div className="flex flex-wrap gap-2">
                            {aspectRatios.map(ar => (
                                <button
                                    key={ar}
                                    onClick={() => setAspectRatio(ar)}
                                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                                        aspectRatio === ar 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {ar}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 flex items-center justify-center text-lg btn-primary"
                    >
                        {loading ? <ButtonSpinner /> : 'Tạo Ảnh'}
                    </button>
                </div>
            </Card>

            {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg text-center">{error}</div>}

            {loading && (
                <Card>
                    <div className="text-center text-gray-600">
                        <Spinner />
                        <p className="mt-2">AI đang vẽ... Quá trình này có thể mất một chút thời gian.</p>
                    </div>
                </Card>
            )}

            {generatedImage && (
                <Card>
                     <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Hình ảnh của bạn đã sẵn sàng!</h3>
                    <img
                        src={generatedImage}
                        alt="AI generated"
                        className="rounded-lg shadow-lg mx-auto max-w-full"
                    />
                </Card>
            )}
        </div>
    );
};

export default ImageGenerator;
