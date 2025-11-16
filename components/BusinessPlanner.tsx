import React from 'react';
import Card from './common/Card';
import Spinner, { ButtonSpinner } from './common/Spinner';
import { getBusinessPlan } from '../services/geminiService';

const BusinessPlanner = () => {
    const [query, setQuery] = React.useState('Xây dựng một kế hoạch marketing toàn diện để bán mật ong hoa rừng từ Hà Giang cho khách hàng tại TP. Hồ Chí Minh.');
    const [result, setResult] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handlePlanRequest = async () => {
        if (!query.trim()) {
            setError('Vui lòng nhập yêu cầu của bạn.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const plan = await getBusinessPlan(query);
            setResult(plan);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tạo kế hoạch. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tư Vấn Kinh Doanh Cấp Cao với AI</h2>
                <p className="text-gray-600 mb-4">
                    Đây là chế độ "Suy nghĩ chuyên sâu" sử dụng mô hình Gemini 2.5 Pro. Hãy đặt những câu hỏi phức tạp, yêu cầu chiến lược để AI phân tích và đưa ra giải pháp toàn diện.
                </p>
                
                <div className="space-y-4">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nhập yêu cầu tư vấn chi tiết của bạn..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        rows={5}
                    />
                    <button
                        onClick={handlePlanRequest}
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors btn-primary"
                    >
                        {loading ? <ButtonSpinner /> : 'Yêu cầu Phân tích'}
                    </button>
                </div>
            </Card>

            {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg text-center">{error}</div>}
            
            {loading && (
                 <Card>
                    <div className="text-center text-gray-600">
                        <Spinner />
                        <p className="mt-2">AI đang tư duy sâu... Quá trình này có thể mất nhiều thời gian hơn bình thường.</p>
                    </div>
                </Card>
            )}

            {result && (
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Phân Tích & Chiến Lược từ AI:</h3>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap p-4 bg-gray-50 rounded-lg border">{result}</div>
                </Card>
            )}
        </div>
    );
};

export default BusinessPlanner;
