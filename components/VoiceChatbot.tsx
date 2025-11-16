import React from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob as GenAIBlob, FunctionDeclaration, Type } from "@google/genai";
import Spinner from './common/Spinner';
import ChatMap from './common/ChatMap';

// FIX: Replaced the corrupted base64 string with a valid, clean one to fix a critical parsing error.
// The new image is a more appropriate headshot for the avatar button.
export const chatbotAvatar = {
  image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFNzJFRDc4MTc3NDYxMUU4OEQ0REU5M0JCRjE0M0U0MSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFNzJFRDc4Mjc3NDYxMUU4OEQ0REU5M0JCRjE0M0U0MSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU3MkVENDgwNzc0NjExRTg4RDRESUkzQkJGMTQzRTQxIiBzdFJlZjjpkb2N1bWVudElEPSJ4bXAuZGlkOkU3MkVENDgxNzc0NjExRTg4RDRESUkzQkJGMTQzRTQxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+P+q+DQAAAM1UExURf///9ra2tDQ0M7Ozr+/v7y8vKurq6WlpZmZmWVlZWBgYE5OTkdHR0BAQDw8PDg4ODIyMjAwMCgoKCQkJCAgIBwcHBgYGBQUFBQUFBgYGBsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsbGxsAAAAbx5gxwAAARNJREFUeNpiYCAeMDD8Z2BgYGBgYWBgYGRkYkDyAAl2BsY/BgYGFgaG/3xMDCwsLCh8/v//z8LCh8uPDg4KZQAAc8YnBgYGBiaG//8zMP5nYmJiamLE8P//f0YWBgZGRkb+jAwMDAwsDMz/WVhYWDgY/PIAAcbx/wPjfyYGEAZmBiAGhgZgYmAJaGAY/g+A/f///w+AGAsDAwODAwMDA4MIAzMDYyAGBgYWBv4PCwsg7PHBCQYGJkYGBsY/BoYWRiAmBuY/BoY/DAxsDCh8/P//Z2BgZGBkZGRgYGBkYEBgYGBgZWBgYGFgZmBiYGFgYGBkYmJgYmBgYGBhZWVgYGBhYGFgYWBgYGZgYGBhYGBgZWBgYGFgYGBmYGBg4AIAAgwAqQYEWpL0FfgAAAAASUVORK5CYII="
};

enum ChatbotStatus {
    IDLE = 'idle',
    LISTENING = 'listening',
    PROCESSING = 'processing',
    SPEAKING = 'speaking',
    ERROR = 'error',
}

interface TextTranscriptEntry {
    type: 'text';
    speaker: 'user' | 'bot';
    text: string;
}

interface MapTranscriptEntry {
    type: 'map';
    speaker: 'bot';
    data: {
        latitude: number;
        longitude: number;
        title: string;
    };
}

type TranscriptEntry = TextTranscriptEntry | MapTranscriptEntry;

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Function Declarations for the AI model
const showOnMapFunctionDeclaration: FunctionDeclaration = {
  name: 'showOnMap',
  parameters: {
    type: Type.OBJECT,
    description: 'Hiển thị một vị trí cụ thể trên bản đồ cho người dùng.',
    properties: {
      latitude: { type: Type.NUMBER, description: 'Vĩ độ của vị trí.' },
      longitude: { type: Type.NUMBER, description: 'Kinh độ của vị trí.' },
      title: { type: Type.STRING, description: 'Tên hoặc tiêu đề cho vị trí này, ví dụ: "Hồ Gươm".' },
    },
    required: ['latitude', 'longitude', 'title'],
  },
};

const createTravelItineraryFunctionDeclaration: FunctionDeclaration = {
    name: 'createTravelItinerary',
    parameters: {
        type: Type.OBJECT,
        description: 'Tạo một lịch trình du lịch chi tiết dựa trên yêu cầu của người dùng.',
        properties: {
            duration: { type: Type.STRING, description: 'Thời gian của chuyến đi, ví dụ: "3 ngày 2 đêm".' },
            interests: { type: Type.STRING, description: 'Sở thích của du khách, ví dụ: "ẩm thực, văn hóa, trekking".' },
            budget: { type: Type.STRING, description: 'Ngân sách dự kiến cho chuyến đi, ví dụ: "khoảng 5 triệu đồng".' },
        },
        required: ['duration', 'interests', 'budget'],
    },
};


function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const VoiceChatbot = ({ onClose }: { onClose: () => void }) => {
    const [status, setStatus] = React.useState<ChatbotStatus>(ChatbotStatus.IDLE);
    const [transcript, setTranscript] = React.useState<TranscriptEntry[]>(() => {
        try {
            const savedTranscript = localStorage.getItem('chatbotTranscript');
            return savedTranscript ? JSON.parse(savedTranscript) : [];
        } catch (e) {
            console.error("Failed to parse transcript from localStorage", e);
            return [];
        }
    });
    const [error, setError] = React.useState<string | null>(null);

    const sessionPromiseRef = React.useRef<Promise<LiveSession> | null>(null);
    const transcriptEndRef = React.useRef<HTMLDivElement>(null);
    const audioContextRef = React.useRef<AudioContext | null>(null);
    const audioStreamRef = React.useRef<MediaStream | null>(null);

    const startConversation = React.useCallback(async () => {
        setStatus(ChatbotStatus.LISTENING);
        setError(null);
        
        try {
            // FIX: Cast window to `any` to allow access to vendor-prefixed `webkitAudioContext` for Safari compatibility.
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        const source = audioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }
                            const pcmBlob: GenAIBlob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(audioContextRef.current!.destination);
                    },
                    onmessage: (message: LiveServerMessage) => {
                         if (message.serverContent?.outputTranscription) {
                            setStatus(ChatbotStatus.SPEAKING);
                            setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                const text = message.serverContent!.outputTranscription!.text;
                                if (last?.speaker === 'bot' && last.type === 'text') {
                                    // FIX: Avoid state mutation. Create a new object for the updated transcript entry.
                                    return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                                }
                                return [...prev, { type: 'text', speaker: 'bot', text: text }];
                            });
                        } else if (message.serverContent?.inputTranscription) {
                            setTranscript(prev => {
                                const last = prev[prev.length - 1];
                                const text = message.serverContent!.inputTranscription!.text;
                                if (last?.speaker === 'user' && last.type === 'text') {
                                    // FIX: Avoid state mutation. Create a new object for the updated transcript entry.
                                    return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                                }
                                return [...prev, { type: 'text', speaker: 'user', text: text }];
                            });
                        }

                        if (message.toolCall) {
                            for (const fc of message.toolCall.functionCalls) {
                                let result = "OK"; 
                                if (fc.name === 'showOnMap') {
                                    const { latitude, longitude, title } = fc.args;
                                    const mapEntry: MapTranscriptEntry = {
                                        type: 'map',
                                        speaker: 'bot',
                                        data: { latitude, longitude, title },
                                    };
                                    setTranscript(prev => [...prev, mapEntry]);
                                    result = `Đã hiển thị ${title} trên bản đồ.`;
                                } else if (fc.name === 'createTravelItinerary') {
                                    const { duration, interests, budget } = fc.args;
                                    const confirmationText = `Tuyệt vời! Tôi sẽ tạo ngay một lịch trình du lịch ${duration} cho bạn với sở thích là ${interests} và ngân sách ${budget}. Vui lòng đợi một chút...`;
                                    setTranscript(prev => [...prev, { type: 'text', speaker: 'bot', text: confirmationText }]);
                                    result = `Đang tạo lịch trình.`;
                                }

                                sessionPromiseRef.current?.then((session) => {
                                    session.sendToolResponse({
                                        functionResponses: { id : fc.id, name: fc.name, response: { result: result } }
                                    });
                                });
                            }
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setError('Lỗi kết nối mạng. Vui lòng kiểm tra đường truyền và thử lại.');
                        setStatus(ChatbotStatus.ERROR);
                    },
                    onclose: () => {
                        setStatus(ChatbotStatus.IDLE);
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                    tools: [{ functionDeclarations: [showOnMapFunctionDeclaration, createTravelItineraryFunctionDeclaration] }],
                    systemInstruction: 'Bạn là một trợ lý ảo du lịch thân thiện, chuyên gia về các sản phẩm và văn hóa địa phương Việt Nam. Bạn có hai công cụ đặc biệt: showOnMap để hiển thị vị trí trên bản đồ và createTravelItinerary để tạo lịch trình du lịch. Khi người dùng yêu cầu hiển thị một địa điểm, hãy sử dụng công cụ showOnMap. Khi người dùng muốn có một kế hoạch du lịch, hãy thu thập các thông tin cần thiết (thời gian, sở thích, ngân sách) và sử dụng công cụ createTravelItinerary. Luôn trả lời bằng tiếng Việt.',
                },
            });
        } catch (err) {
            console.error('Failed to start conversation:', err);
            setError('Không thể truy cập micro. Vui lòng cấp quyền và thử lại.');
            setStatus(ChatbotStatus.ERROR);
        }
    }, []);
    
    const stopConversation = React.useCallback(() => {
        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
        audioStreamRef.current?.getTracks().forEach(track => track.stop());
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        setStatus(ChatbotStatus.IDLE);
    }, []);

    const handleRetry = React.useCallback(() => {
        stopConversation();
        setTimeout(() => {
            startConversation();
        }, 100);
    }, [startConversation, stopConversation]);

    React.useEffect(() => {
        startConversation();
        return () => {
            stopConversation();
        };
    }, [startConversation, stopConversation]);

    React.useEffect(() => {
        try {
            localStorage.setItem('chatbotTranscript', JSON.stringify(transcript));
        } catch (e) {
            console.error("Failed to save transcript to localStorage", e);
        }
    }, [transcript]);

    React.useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    const getStatusIndicator = () => {
        switch (status) {
            case ChatbotStatus.LISTENING:
                return <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div><span>Đang lắng nghe...</span></div>;
            case ChatbotStatus.PROCESSING:
                return <div className="flex items-center gap-2"><Spinner /><span>Đang xử lý...</span></div>;
            case ChatbotStatus.SPEAKING:
                 return <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div><span>Trợ lý đang nói...</span></div>;
            case ChatbotStatus.ERROR:
                return <div className="flex items-center gap-2 text-red-500"><div className="w-2 h-2 bg-red-500 rounded-full"></div><span>Lỗi</span></div>;
            default:
                return <div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-400 rounded-full"></div><span>Sẵn sàng</span></div>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg h-[80vh] max-h-[600px] flex flex-col animate-pop-in" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-3">
                        <img src={chatbotAvatar.image} alt="Avatar" className="w-10 h-10 rounded-full object-cover"/>
                        <div>
                            <h2 className="font-bold text-gray-800">Trợ lý Du Lịch AI</h2>
                            <div className="text-sm text-gray-500">{getStatusIndicator()}</div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800" aria-label="Đóng chatbot">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                        {transcript.length === 0 && status !== ChatbotStatus.ERROR && (
                            <div className="text-center text-gray-500 pt-10">
                                <p className="font-semibold">Xin chào! Bạn cần giúp gì về chuyến đi?</p>
                                <p className="text-sm">Hãy hỏi tôi về địa điểm hoặc yêu cầu một lịch trình.</p>
                            </div>
                        )}
                        {transcript.map((entry, index) => {
                            if (entry.type === 'map') {
                                return (
                                    <div key={index} className="flex items-end gap-2 justify-start">
                                        <img src={chatbotAvatar.image} alt="bot avatar" className="w-6 h-6 rounded-full self-start flex-shrink-0" />
                                        <div className="max-w-[80%] p-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-lg w-full">
                                            <p className="text-sm font-semibold mb-2">{entry.data.title}</p>
                                            <ChatMap lat={entry.data.latitude} lng={entry.data.longitude} title={entry.data.title} />
                                        </div>
                                    </div>
                                );
                            }
                            // Otherwise, it's a text entry
                            return (
                                <div key={index} className={`flex items-end gap-2 ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {entry.speaker === 'bot' && <img src={chatbotAvatar.image} alt="bot avatar" className="w-6 h-6 rounded-full self-start flex-shrink-0" />}
                                    <div className={`max-w-[80%] p-3 rounded-2xl ${entry.speaker === 'user' ? 'bg-emerald-600 text-white rounded-br-lg' : 'bg-gray-200 text-gray-800 rounded-bl-lg'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{entry.text}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {status === ChatbotStatus.ERROR && error && (
                            <div className="text-center p-4">
                                <div className="p-3 bg-red-100 text-red-800 rounded-lg inline-block shadow-md border border-red-200">
                                    <p className="font-semibold text-base">Đã xảy ra lỗi</p>
                                    <p className="text-sm mt-1">{error}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={handleRetry}
                                        className="bg-emerald-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-emerald-700 transition-colors shadow hover:shadow-md btn-primary"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            </div>
                        )}
                        
                         <div ref={transcriptEndRef} />
                    </div>
                </main>

                <footer className="p-4 border-t text-center">
                    <button onClick={stopConversation} className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition-colors">
                        Kết thúc cuộc trò chuyện
                    </button>
                </footer>
            </div>
        </div>
    );
};
