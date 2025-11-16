import React from 'react';
import Card from './common/Card';
import Spinner, { ButtonSpinner } from './common/Spinner';
import FileUpload from './common/FileUpload';
import { analyzeVideo } from '../services/geminiService';

const VideoAnalyzer = () => {
    const [videoFile, setVideoFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [prompt, setPrompt] = React.useState('Phân tích video này và tóm tắt những điểm chính về sản phẩm và quy trình sản xuất.');
    const [result, setResult] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleFileChange = (file: File | null) => {
        if (file) {
            setVideoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };
    
    const handleAnalyze = async () => {
        if (!videoFile) {
            setError('Vui lòng tải lên một video.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const analysis = await analyzeVideo(videoFile, prompt);
            setResult(analysis);
        } catch (err) {
            setError('Đã xảy ra lỗi khi phân tích video. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Phân Tích Video Sản Phẩm</h2>
                <p className="text-gray-600 mb-4">
                    Tải lên một video ngắn (dưới 1 phút) về sản phẩm hoặc quy trình làm ra nó. AI sẽ phân tích và rút ra những thông tin quan trọng.
                </p>
                <FileUpload onFileSelect={handleFileChange} accept="video/*" />
                {previewUrl && (
                    <video src={previewUrl} controls className="mt-4 rounded-lg shadow-md max-h-80 w-full"></video>
                )}
            </Card>

            {videoFile && (
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Yêu cầu phân tích (tùy chọn)</h3>
                     <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Nhập yêu cầu của bạn..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 mb-4"
                        rows={3}
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors btn-primary"
                    >
                        {loading ? <ButtonSpinner /> : 'Bắt đầu Phân tích Video'}
                    </button>
                </Card>
            )}

            {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg text-center">{error}</div>}
            
            {loading && (
                <Card>
                    <div className="text-center text-gray-600">
                        <Spinner />
                        <p className="mt-2">AI đang xem và phân tích video... Quá trình này có thể mất một lúc.</p>
                    </div>
                </Card>
            )}

            {result && (
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Kết quả phân tích video:</h3>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border">{result}</div>
                </Card>
            )}
        </div>
    );
};

export default VideoAnalyzer;
