import React from 'react';

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const streamRef = React.useRef<MediaStream | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Lỗi truy cập camera:", err);
                if (err instanceof Error && err.name === 'NotAllowedError') {
                    setError('Bạn đã từ chối quyền truy cập camera. Vui lòng bật quyền trong cài đặt trình duyệt của bạn.');
                } else {
                    setError('Không thể truy cập camera. Vui lòng cấp quyền và thử lại.');
                }
            }
        };

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const video = videoRef.current;
                canvasRef.current.width = video.videoWidth;
                canvasRef.current.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                
                canvasRef.current.toBlob(blob => {
                    if (blob) {
                        const fileName = `capture-${new Date().toISOString()}.jpeg`;
                        const file = new File([blob], fileName, { type: 'image/jpeg' });
                        onCapture(file);
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center animate-fade-in">
            {error ? (
                <div className="text-white text-center p-6 bg-red-800 bg-opacity-90 rounded-lg max-w-sm">
                    <h3 className="text-lg font-bold mb-2">Lỗi Camera</h3>
                    <p>{error}</p>
                    <button onClick={onClose} className="mt-4 px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                        Đóng
                    </button>
                </div>
            ) : (
                <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent flex justify-center items-center">
                        <div className="absolute left-4">
                            <button
                                onClick={onClose}
                                className="text-white font-semibold text-lg px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                aria-label="Đóng camera"
                            >
                                Hủy
                            </button>
                        </div>
                        <button
                            onClick={handleCapture}
                            className="w-20 h-20 bg-white rounded-full border-4 border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-transform active:scale-95"
                            aria-label="Chụp ảnh"
                        ></button>
                    </div>
                     <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-colors"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
};

export default CameraCapture;
