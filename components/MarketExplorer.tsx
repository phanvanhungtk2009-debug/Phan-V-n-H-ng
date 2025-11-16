import React from 'react';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { useGeolocation } from '../hooks/useGeolocation';
import { searchWithGrounding } from '../services/geminiService';
import { GroundingSource } from '../types';

const MarketExplorer = () => {
    const [query, setQuery] = React.useState('');
    const [searchType, setSearchType] = React.useState<'googleSearch' | 'googleMaps'>('googleMaps');
    const [result, setResult] = React.useState<string | null>(null);
    const [sources, setSources] = React.useState<GroundingSource[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const location = useGeolocation();
    
    const mapQueries = [
        "Chợ địa phương gần đây",
        "Các điểm du lịch nổi tiếng",
        "Đơn vị vận chuyển uy tín",
        "Cửa hàng đồ thủ công mỹ nghệ",
    ];

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Vui lòng nhập câu hỏi của bạn.');
            return;
        }
        if (searchType === 'googleMaps' && location.error) {
            setError(`Không thể tìm kiếm trên bản đồ: ${location.error}`);
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setSources([]);

        try {
            const loc = searchType === 'googleMaps' && location.latitude && location.longitude
                ? { latitude: location.latitude, longitude: location.longitude }
                : undefined;
            const response = await searchWithGrounding(query, searchType, loc);
            setResult(response.text);

            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
            const extractedSources: GroundingSource[] = [];
            groundingChunks.forEach((chunk: any) => {
                if (chunk.web && chunk.web.uri && chunk.web.title) {
                    extractedSources.push({ uri: chunk.web.uri, title: chunk.web.title });
                }
                if (chunk.maps) {
                    if (chunk.maps.uri && chunk.maps.title) {
                        extractedSources.push({ uri: chunk.maps.uri, title: chunk.maps.title });
                    }
                    chunk.maps.placeAnswerSources?.forEach((placeSource: any) => {
                        placeSource.reviewSnippets?.forEach((snippet: any) => {
                            if (snippet.uri && snippet.title) {
                                extractedSources.push({ uri: snippet.uri, title: `Đánh giá: ${snippet.title}` });
                            }
                        });
                    });
                }
            });
            setSources(extractedSources);

        } catch (err) {
            setError('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    React.useEffect(() => {
        if (searchType === 'googleMaps') {
            setQuery("Các nhà hàng hoặc cửa hàng đặc sản tốt gần đây?");
        } else {
            setQuery("Xu hướng thị trường cho nông sản sạch năm nay là gì?");
        }
    }, [searchType]);

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Khám Phá Thị Trường với AI</h2>
                <p className="text-gray-600 mb-4">
                    Đặt câu hỏi để nhận thông tin mới nhất từ Google Search hoặc tìm kiếm địa điểm với Google Maps.
                </p>

                <div className="flex justify-center gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
                    <button onClick={() => setSearchType('googleSearch')} className={`w-1/2 py-2 rounded-md font-semibold transition-all ${searchType === 'googleSearch' ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-gray-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
                        Tìm kiếm Web
                    </button>
                    <button onClick={() => setSearchType('googleMaps')} className={`w-1/2 py-2 rounded-md font-semibold transition-all ${searchType === 'googleMaps' ? 'bg-white text-emerald-600 shadow-sm' : 'bg-transparent text-gray-600'}`}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        Tìm kiếm Bản đồ
                    </button>
                </div>
                
                {searchType === 'googleMaps' && (
                    <div className="text-center p-2 mb-4 bg-gray-50 rounded-lg text-sm border">
                        {location.loading && <p className="text-gray-600">📍 Đang lấy vị trí của bạn để có kết quả tốt nhất...</p>}
                        {location.error && <p className="text-red-600">⚠️ {location.error}</p>}
                        {!location.loading && !location.error && location.latitude && <p className="text-emerald-700 font-medium">✔️ Đã lấy vị trí. Sẵn sàng tìm kiếm quanh bạn.</p>}
                    </div>
                )}
                
                {searchType === 'googleMaps' && (
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Gợi ý cho bạn:</p>
                        <div className="flex flex-wrap gap-2">
                            {mapQueries.map(q => (
                                <button 
                                    key={q}
                                    onClick={() => setQuery(q)}
                                    className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm rounded-full hover:bg-emerald-200 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nhập câu hỏi..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        rows={3}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading || (searchType === 'googleMaps' && location.loading)}
                        className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors btn-primary"
                    >
                        {loading ? <Spinner /> : 'Gửi câu hỏi'}
                    </button>
                </div>
            </Card>

            {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg text-center">{error}</div>}

            {result && (
                <Card>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Kết quả từ AI:</h3>
                    <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{result}</div>
                    {sources.length > 0 && (
                       <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold text-gray-600 mb-2">Nguồn tham khảo:</h4>
                            <ul className="space-y-2">
                                {sources.map((source, index) => (
                                    <li key={index}>
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                                            {source.title.startsWith('Đánh giá:') || searchType === 'googleMaps' ? 
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                                :
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                            }
                                            <span className="underline truncate">{source.title}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default MarketExplorer;
