import React from 'react';
import { Product } from '../types';
import { useGeolocation } from '../hooks/useGeolocation';
import { parseSearchQuery } from '../services/geminiService';
import Spinner, { ButtonSpinner } from './common/Spinner';

// Since we can't import from node_modules, we assume Leaflet and its plugins are globally available from the <script> tags in index.html.
// We'll declare the L variable to satisfy TypeScript.
declare const L: any;

interface MapViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onView3D: (product: Product) => void;
  onRateProduct: (product: Product) => void;
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  onCloseDetailPanel: () => void;
}

// Haversine formula to calculate distance between two lat/lon points in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

// Star Icon Components
const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
const StarOutlineIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292A1.001 1.001 0 0010 4.165z" />
    </svg>
);
const StarHalfIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path className="text-gray-300" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292A1.001 1.001 0 0010 4.165z" />
      <path className="text-yellow-400" d="M10 4.165v11.669l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292A1.001 1.001 0 0010 4.165z" />
    </svg>
);

const StarRating = ({ rating, reviewCount }: { rating: number; reviewCount?: number }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <StarIcon key={`full-${i}`} className="w-5 h-5 text-yellow-400" />)}
            {halfStar && <StarHalfIcon key="half" className="w-5 h-5" />}
            {[...Array(emptyStars)].map((_, i) => <StarOutlineIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)}
            {reviewCount !== undefined && <span className="ml-2 text-sm text-gray-500">({reviewCount} đánh giá)</span>}
        </div>
    );
};

// React component for the detail panel
const ProductDetailPanel = ({ product, onClose, onAddToCart, onView3D, onRateProduct }: { product: Product; onClose: () => void; onAddToCart: (product: Product) => void; onView3D: (product: Product) => void; onRateProduct: (product: Product) => void; }) => {
    const averageRating = React.useMemo(() => {
        if (!product.ratings || product.ratings.length === 0) return 0;
        return product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length;
    }, [product.ratings]);
    
    return (
        <div className="absolute top-0 right-0 h-full w-full md:w-[400px] bg-white z-[1001] shadow-2xl animate-slide-in-right">
            <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-center pb-3 border-b mb-3">
                    <h2 className="text-xl font-bold text-gray-800">Chi tiết sản phẩm</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800" aria-label="Close">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    <img src={product.brandImageUrl} alt={product.productName} className="w-full h-56 object-cover rounded-xl shadow-lg" />
                    <h3 className="text-2xl font-bold text-gray-800">{product.productName}</h3>
                    <StarRating rating={averageRating} reviewCount={product.ratings?.length || 0} />
                    <p className="text-3xl font-bold text-emerald-600">{product.priceRange}</p>
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <h4 className="font-bold text-lg text-emerald-900 mb-2">Thông Tin Người Bán</h4>
                        <p><strong>Bán bởi:</strong> <span className="font-semibold">{product.sellerName}</span></p>
                        <p><strong>Liên hệ:</strong> <a href={`tel:${product.sellerPhone}`} className="text-emerald-700 font-semibold hover:underline">{product.sellerPhone}</a></p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 mb-1">Mô tả & Nguồn gốc</h4>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{product.description}</p>
                    </div>
                     {product.ratings && product.ratings.length > 0 && (
                        <div className="pt-4 border-t">
                            <h4 className="font-bold text-gray-800 mb-2">Đánh giá từ khách hàng</h4>
                            <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                                {product.ratings.map((r, i) => (
                                    <div key={i} className="p-3 bg-gray-50 rounded-md text-sm">
                                        <StarRating rating={r.rating} />
                                        {r.comment && <p className="text-gray-600 mt-1 italic">"{r.comment}"</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 pt-4 border-t mt-4 flex flex-col gap-2">
                     <button onClick={() => onAddToCart(product)} className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"><span>Thêm vào giỏ hàng</span></button>
                    {product.has3DModel && product.modelUrl && (<button onClick={() => onView3D(product)} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"><span>Xem 3D/AR</span></button>)}
                    <button onClick={() => onRateProduct(product)} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"><span>Write a Review</span></button>
                </div>
            </div>
        </div>
    );
};

interface MapFilters {
    searchTerm: string;
    category: string;
    distance: number;
}


const MapView = ({ 
    products, 
    onAddToCart, 
    onView3D, 
    onRateProduct, 
    selectedProduct,
    onSelectProduct,
    onCloseDetailPanel,
}: MapViewProps) => {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);
    const mapRef = React.useRef<any>(null);
    const markersRef = React.useRef<any>(null);
    const userMarkerRef = React.useRef<any>(null);
    
    const [rawSearchQuery, setRawSearchQuery] = React.useState<string>('');
    const [filters, setFilters] = React.useState<MapFilters>({ searchTerm: '', category: 'all', distance: Infinity });
    const [isSearching, setIsSearching] = React.useState(false);


    const location = useGeolocation();
    
    const categories = React.useMemo(() => {
        return ['all', ...Array.from(new Set(products.map(p => p.category)))];
    }, [products]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rawSearchQuery.trim()) {
            setFilters({ searchTerm: '', category: 'all', distance: Infinity });
            return;
        }

        setIsSearching(true);
        try {
            const availableCategories = categories.filter(c => c !== 'all');
            const parsed = await parseSearchQuery(rawSearchQuery, availableCategories);
            
            setFilters({
                searchTerm: parsed.searchTerm || '',
                category: parsed.category || 'all',
                distance: parsed.distance === null ? Infinity : parsed.distance
            });

        } catch (error) {
            console.error("Lỗi phân tích tìm kiếm:", error);
            setFilters({ searchTerm: rawSearchQuery, category: 'all', distance: Infinity });
        } finally {
            setIsSearching(false);
        }
    };

    const displayedProducts = React.useMemo(() => {
        const lowercasedQuery = filters.searchTerm.toLowerCase();
        
        return products.filter(p => {
            const matchesSearch = !lowercasedQuery ||
                p.productName.toLowerCase().includes(lowercasedQuery) ||
                p.description.toLowerCase().includes(lowercasedQuery);
            
            const matchesCategory = filters.category === 'all' || p.category === filters.category;

            const hasLocation = location.latitude !== null && location.longitude !== null;
            const matchesDistance = filters.distance === Infinity || 
                (hasLocation && 
                 calculateDistance(location.latitude!, location.longitude!, p.location.latitude, p.location.longitude) <= filters.distance);

            return matchesSearch && matchesCategory && matchesDistance;
        });
    }, [products, filters, location.latitude, location.longitude]);
    
     const handleLocateMe = () => {
        if (location.latitude && location.longitude && mapRef.current) {
            mapRef.current.flyTo([location.latitude, location.longitude], 13);
            if (!userMarkerRef.current) {
                const userIcon = L.divIcon({
                    className: 'user-location-marker',
                    html: `<div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>`,
                    iconSize: [16, 16],
                });
                userMarkerRef.current = L.marker([location.latitude, location.longitude], { icon: userIcon }).addTo(mapRef.current);
            } else {
                userMarkerRef.current.setLatLng([location.latitude, location.longitude]);
            }
        }
    };
    
    React.useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([15.903, 105.806], 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            L.control.zoom({ position: 'topright' }).addTo(map);
            mapRef.current = map;
            markersRef.current = L.markerClusterGroup().addTo(map);
        }
    }, []);
    
    React.useEffect(() => {
        const markers = markersRef.current;
        if (!markers) return;
        markers.clearLayers();
        displayedProducts.forEach(product => {
            const popupContent = `
                <div class="w-48 text-sm">
                    <img src="${product.brandImageUrl}" alt="${product.productName}" class="w-full h-24 object-cover rounded-t-md mb-2" />
                    <div class="px-2 pb-2">
                        <h3 class="font-bold truncate">${product.productName}</h3>
                        <p class="text-xs text-gray-600">${product.priceRange}</p>
                        <button id="view-detail-${product.id}" class="mt-2 w-full text-xs bg-emerald-600 text-white font-semibold py-1 px-2 rounded-md hover:bg-emerald-700">Xem chi tiết</button>
                    </div>
                </div>`;
            const marker = L.marker([product.location.latitude, product.location.longitude]);
            marker.bindPopup(popupContent, { minWidth: 200 });
            marker.on('popupopen', () => {
                const btn = document.getElementById(`view-detail-${product.id}`);
                if (btn) btn.onclick = () => onSelectProduct(product);
            });
            markers.addLayer(marker);
        });
    }, [displayedProducts, onSelectProduct]);

    React.useEffect(() => {
        if (selectedProduct && mapRef.current) {
            mapRef.current.flyTo([selectedProduct.location.latitude, selectedProduct.location.longitude], 15);
        }
    }, [selectedProduct]);
    
    return (
        <div className="relative h-full w-full">
            <div ref={mapContainerRef} className="h-full w-full" />
            
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-2xl flex items-center gap-2">
                <button 
                    onClick={handleLocateMe} 
                    disabled={location.loading} 
                    title={!location.latitude ? 'Vui lòng cho phép truy cập vị trí' : 'Tìm vị trí của tôi'}
                    className="flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-lg border border-gray-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Định vị tôi"
                >
                    {location.loading ? <Spinner/> : (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    )}
                </button>
                <form onSubmit={handleSearch} className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm thông minh..."
                        value={rawSearchQuery}
                        onChange={e => setRawSearchQuery(e.target.value)}
                        className="w-full bg-white p-3 md:p-4 pl-4 md:pl-6 pr-24 md:pr-28 border border-gray-200 rounded-full text-sm md:text-md shadow-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                     <button 
                        type="submit" 
                        disabled={isSearching}
                        className="absolute inset-y-0 right-0 m-1.5 md:m-2 w-20 md:w-24 h-9 md:h-10 flex items-center justify-center bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 disabled:bg-gray-400 transition-colors btn-primary"
                    >
                       {isSearching ? <ButtonSpinner /> : 'Tìm'}
                    </button>
                </form>
            </div>

            {selectedProduct && (
                <ProductDetailPanel 
                    product={selectedProduct} 
                    onClose={onCloseDetailPanel}
                    onAddToCart={onAddToCart}
                    onView3D={onView3D}
                    onRateProduct={onRateProduct}
                />
            )}
        </div>
    );
};

export default MapView;
