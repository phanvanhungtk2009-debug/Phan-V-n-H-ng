
import React from 'react';
import Card from './common/Card';
import { A_MI_PERSONA } from './VoiceChatbot';

interface HighlandGuideViewProps {
    onStartChat: () => void;
}

const HighlandGuideView = ({ onStartChat }: HighlandGuideViewProps) => {
    return (
        <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl min-h-[400px] flex flex-col justify-end">
                {/* Background Image - Rice Terraces */}
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1531390977855-83e920d3f740?q=80&w=2940&auto=format&fit=crop")' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                </div>

                <div className="relative z-10 p-6 md:p-10 text-white">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                            <img 
                                src={A_MI_PERSONA.avatarUrl} 
                                alt="A Mị Avatar" 
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl object-cover relative z-10"
                            />
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full z-20 animate-pulse"></div>
                        </div>
                        
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 tracking-tight">
                                Hướng Dẫn Viên <span className="text-emerald-400">Vùng Cao</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl">
                                Chào bạn! Mình là <span className="font-bold text-white">A Mị</span>. Mình sinh ra ở bản làng trên mây. Hãy để mình kể bạn nghe về những tấm vải chàm, vị mật ong rừng ngọt lịm và những cung đường đẹp nhất Tây Bắc nhé!
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center md:justify-start">
                        <button 
                            onClick={onStartChat}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:-translate-y-1 flex items-center gap-3 text-lg btn-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                            Trò chuyện cùng A Mị
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:border-emerald-500 transition-colors cursor-pointer group" onClick={onStartChat}>
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🍵</div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Văn Hóa & Ẩm Thực</h3>
                    <p className="text-gray-600 text-sm">Hỏi A Mị về cách làm bánh dày, lễ hội Gầu Tào hay bí quyết pha chè Shan Tuyết cổ thụ.</p>
                </Card>
                <Card className="hover:border-blue-500 transition-colors cursor-pointer group" onClick={onStartChat}>
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🗺️</div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Du Lịch Bản Địa</h3>
                    <p className="text-gray-600 text-sm">Nhờ A Mị lên lịch trình khám phá Hoàng Su Phì, Đồng Văn hay tìm homestay view đẹp nhất.</p>
                </Card>
                <Card className="hover:border-purple-500 transition-colors cursor-pointer group" onClick={onStartChat}>
                     <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🧵</div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Sản Phẩm Thủ Công</h3>
                    <p className="text-gray-600 text-sm">Tìm hiểu ý nghĩa hoa văn trên váy áo thổ cẩm và quy trình dệt lanh truyền thống.</p>
                </Card>
            </div>
            
             <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between p-2">
                    <div>
                        <h3 className="font-bold text-xl mb-1">Bạn chưa biết hỏi gì?</h3>
                        <p className="text-gray-300 text-sm">Thử nói: "A Mị ơi, mùa này Hà Giang có hoa gì nở đẹp?"</p>
                    </div>
                     <button 
                        onClick={onStartChat}
                        className="mt-4 md:mt-0 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full transition-colors text-sm font-semibold"
                    >
                        Thử ngay
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default HighlandGuideView;
