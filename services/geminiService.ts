import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzeProductImage = async (imageFile: File): Promise<string> => {
  const imagePart = await fileToGenerativePart(imageFile);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        imagePart,
        { text: "Phân tích hình ảnh sản phẩm này. Tự động phân loại sản phẩm (nông sản, thủ công, dược liệu…), gợi ý một tên ngắn gọn, đề xuất một khoảng giá bán hợp lý bằng Việt Nam Đồng (VND), và viết một mô tả sản phẩm hấp dẫn. Nội dung mô tả cần ngắn gọn, nêu bật công dụng, nguồn gốc, cách sử dụng, với giọng văn chân thực. Trả về kết quả dưới dạng JSON. Nếu sản phẩm thuộc loại có thể có mô hình 3D (như đồ thủ công, giày dép, chai lọ), hãy đề xuất một URL mô hình 3D chung chung từ `https://modelviewer.dev/shared-assets/models/`. Ví dụ: 'https://modelviewer.dev/shared-assets/models/Chair.glb' cho đồ nội thất, hoặc 'https://modelviewer.dev/shared-assets/models/MaterialsVariantsShoe.glb' cho giày dép. Nếu không phù hợp, để trống trường modelUrl." },
      ],
    },
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                productName: { type: Type.STRING, description: "Tên sản phẩm gợi ý" },
                category: { type: Type.STRING, description: "Phân loại sản phẩm" },
                priceRange: { type: Type.STRING, description: "Khoảng giá đề xuất" },
                description: { type: Type.STRING, description: "Mô tả sản phẩm hấp dẫn" },
                modelUrl: { type: Type.STRING, description: "URL mô hình 3D đề xuất (nếu có)" }
            }
        }
    }
  });
  return response.text;
};

export const generate3DConceptImage = async (imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: 'Tạo một hình ảnh chuyên nghiệp, bắt mắt cho sản phẩm này trên nền trắng sạch sẽ để sử dụng cho mục đích thương mại điện tử. Giữ nguyên hình dáng và đặc điểm của sản phẩm gốc.' }
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData?.data) {
                return part.inlineData.data;
            }
        }
    }
    
    console.error("Gemini API response did not contain image data:", JSON.stringify(response, null, 2));
    throw new Error("Không thể tạo hình ảnh concept từ ảnh gốc.");
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
        return response.generatedImages[0].image.imageBytes;
    }

    throw new Error("Không thể tạo hình ảnh.");
};

export const searchWithGrounding = async (
    query: string,
    searchType: 'googleSearch' | 'googleMaps',
    location?: { latitude: number, longitude: number }
): Promise<GenerateContentResponse> => {
    
    const tools: any[] = [];
    if (searchType === 'googleSearch') {
        tools.push({ googleSearch: {} });
    } else if (searchType === 'googleMaps') {
        tools.push({ googleMaps: {} });
    }

    const config: any = { tools };

    if (searchType === 'googleMaps' && location) {
        config.toolConfig = {
            retrievalConfig: {
                latLng: {
                    latitude: location.latitude,
                    longitude: location.longitude
                }
            }
        };
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: config,
    });
    
    return response;
};

export const getBusinessPlan = async (query: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: query,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
};

export const analyzeVideo = async (videoFile: File, prompt: string): Promise<string> => {
    const videoPart = await fileToGenerativePart(videoFile);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                videoPart,
                { text: prompt }
            ]
        }
    });
    return response.text;
};

export const analyzeProductListing = async (product: {
    productName: string;
    category: string;
    priceRange: string;
    description: string;
}): Promise<string> => {
    const prompt = `Bạn là một chuyên gia tư vấn thương mại điện tử, chuyên về các sản phẩm địa phương và thủ công. Dựa trên thông tin sản phẩm sau, hãy đưa ra các đề xuất cụ thể để làm cho nó hấp dẫn hơn đối với khách hàng.
    - Tên sản phẩm: "${product.productName}"
    - Danh mục: "${product.category}"
    - Giá: "${product.priceRange}"
    - Mô tả: "${product.description}"

    Hãy cung cấp:
    1. Một tên sản phẩm mới, hấp dẫn và chuẩn SEO hơn.
    2. Một đoạn mô tả mới, mang tính kể chuyện, gợi cảm xúc và nêu bật giá trị độc đáo của sản phẩm.
    3. Nhận xét về mức giá và đề xuất (nếu cần).
    4. 2-3 mẹo marketing cụ thể cho sản phẩm này (ví dụ: kênh bán hàng, đối tượng khách hàng, cách chụp ảnh...).
    
    Vui lòng trả về kết quả dưới dạng JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestedName: { type: Type.STRING, description: "Tên sản phẩm mới được đề xuất" },
                    suggestedDescription: { type: Type.STRING, description: "Mô tả sản phẩm mới được viết lại" },
                    priceFeedback: { type: Type.STRING, description: "Nhận xét và đề xuất về giá" },
                    marketingTips: { 
                        type: Type.ARRAY, 
                        items: { type: Type.STRING },
                        description: "Các mẹo marketing cụ thể"
                    }
                }
            }
        }
    });

    return response.text;
};

export interface ParsedQuery {
    searchTerm: string;
    category: string;
    distance: number | null;
}

export const parseSearchQuery = async (query: string, categories: string[]): Promise<ParsedQuery> => {
    const prompt = `Phân tích truy vấn tìm kiếm của người dùng cho một bản đồ sản phẩm đặc sản Việt Nam. Trích xuất các thông tin sau:
- searchTerm: Từ khóa chính về sản phẩm (ví dụ: "mật ong", "vải thổ cẩm"). Nếu không có, để trống "".
- category: Một danh mục sản phẩm duy nhất nếu được đề cập. Phải chọn một trong các danh mục có sẵn sau: [${categories.join(', ')}]. Nếu không có hoặc không khớp, để trống "".
- distance: Khoảng cách tối đa để tìm kiếm, tính bằng km (ví dụ: "dưới 20km" -> 20, "trong vòng 5 kilômét" -> 5). Nếu không đề cập, trả về null.

Truy vấn của người dùng: "${query}"

Trả về kết quả dưới dạng JSON.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    searchTerm: { type: Type.STRING, description: "Từ khóa chính của sản phẩm. Ví dụ: 'mật ong'. Trả về chuỗi rỗng nếu không có." },
                    category: { type: Type.STRING, description: `Danh mục sản phẩm, phải là một trong số [${categories.join(', ')}]. Trả về chuỗi rỗng nếu không có.` },
                    distance: { type: Type.NUMBER, description: "Khoảng cách tối đa bằng km. Trả về null nếu không có." }
                }
            }
        }
    });
    
    try {
        const parsed = JSON.parse(response.text);
        // Post-processing to ensure the category is valid and exists in our list
        if (parsed.category && !categories.some(c => c.toLowerCase() === parsed.category.toLowerCase())) {
            parsed.category = ""; // Invalidate if model hallucinates a category not in the list
        }
        return parsed;
    } catch (e) {
        console.error("Không thể phân tích phản hồi từ Gemini:", response.text, e);
        // Fallback to a simple search if parsing fails
        return { searchTerm: query, category: "", distance: null };
    }
};
