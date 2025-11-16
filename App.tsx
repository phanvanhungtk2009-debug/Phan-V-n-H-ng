import React from 'react';

import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import ProductLister from './components/ProductLister';
import SellerDashboard from './components/SellerDashboard';
import SellerAuth from './components/SellerAuth';
import CartView from './components/CartView';
import ProductGallery from './components/ProductGallery';
import InteractiveMap from './components/InteractiveMap';
import ModelViewer from './components/ModelViewer';
import MobileHeader from './components/MobileHeader';
import RatingForm from './components/RatingForm';
import { VoiceChatbot, chatbotAvatar } from './components/VoiceChatbot';
import { AppView, UserRole, Seller, Product, CartItem, Order, OrderStatus, Rating } from './types';
import RecentlyViewed from './components/RecentlyViewed';
import PaymentGateway from './components/PaymentGateway';
import BottomNavBar from './components/BottomNavBar';
import ExploreView from './components/ExploreView';
import AccountView from './components/AccountView';

// DUMMY DATA for initial state
const DUMMY_PRODUCTS: Product[] = [
    {
        id: "prod_1",
        productName: "Vải Thổ Cẩm Tây Bắc",
        category: "Thủ công",
        priceRange: "250.000 VND / mét",
        description: "Vải thổ cẩm dệt thủ công từ sợi lanh tự nhiên, nhuộm màu chàm truyền thống. Họa tiết tinh xảo, mang đậm bản sắc văn hóa dân tộc Thái. Thích hợp may trang phục, túi xách, vật dụng trang trí.",
        brandImageUrl: "https://images.unsplash.com/photo-1620799140408-edc6d5f9650d?q=80&w=2872&auto=format&fit=crop",
        originalImageUrl: "https://images.unsplash.com/photo-1620799140408-edc6d5f9650d?q=80&w=2872&auto=format&fit=crop",
        qrValue: "{\"productName\":\"Vải Thổ Cẩm Tây Bắc\",\"category\":\"Thủ công\",\"priceRange\":\"250.000 VND / mét\"}",
        sellerId: "0987654321",
        sellerName: "A Tủa",
        sellerPhone: "0987654321",
        location: { latitude: 21.0285, longitude: 105.8542 },
        has3DModel: true,
        modelUrl: "https://modelviewer.dev/shared-assets/models/MaterialsVariantsShoe.glb",
        ratings: [
            { rating: 5, comment: "Chất liệu tuyệt vời, hoa văn sắc sảo. Rất đáng tiền!" },
            { rating: 4, comment: "Vải đẹp, màu sắc đúng như hình." }
        ]
    },
    {
        id: "prod_2",
        productName: "Mật Ong Hoa Rừng Hà Giang",
        category: "Nông sản",
        priceRange: "450.000 VND / lít",
        description: "Mật ong nguyên chất khai thác từ các loài hoa dại trên cao nguyên đá Đồng Văn. Vị ngọt thanh, hương thơm độc đáo, giàu dinh dưỡng. Tốt cho sức khỏe và làm đẹp.",
        brandImageUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=2940&auto=format&fit=crop",
        originalImageUrl: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=2940&auto=format&fit=crop",
        qrValue: "{\"productName\":\"Mật Ong Hoa Rừng Hà Giang\",\"category\":\"Nông sản\",\"priceRange\":\"450.000 VND / lít\"}",
        sellerId: "0912345678",
        sellerName: "Chị Ong",
        sellerPhone: "0912345678",
        location: { latitude: 23.0768, longitude: 105.3005 },
        has3DModel: false,
        ratings: [
             { rating: 5, comment: "Mật ong thơm và ngọt thanh, rất nguyên chất." }
        ]
    }
];
const DUMMY_ORDERS: Order[] = [];


const App = () => {
    const [currentView, setCurrentView] = React.useState<AppView>(AppView.EXPLORE);
    const [currentUserRole, setCurrentUserRole] = React.useState<UserRole>(() => (localStorage.getItem('userRole') as UserRole) || UserRole.BUYER);
    const [currentSeller, setCurrentSeller] = React.useState<Seller | null>(() => {
        const savedSeller = localStorage.getItem('currentSeller');
        return savedSeller ? JSON.parse(savedSeller) : null;
    });
    const [products, setProducts] = React.useState<Product[]>(() => {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            const parsedProducts = JSON.parse(savedProducts);
            return parsedProducts.map((p: Product) => ({ ...p, ratings: p.ratings || [] }));
        }
        return DUMMY_PRODUCTS;
    });
    const [cart, setCart] = React.useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [orders, setOrders] = React.useState<Order[]>(() => {
        const savedOrders = localStorage.getItem('orders');
        return savedOrders ? JSON.parse(savedOrders) : DUMMY_ORDERS;
    });
    const [productToEdit, setProductToEdit] = React.useState<Product | null>(null);
    const [productToView3D, setProductToView3D] = React.useState<Product | null>(null);
    const [productToRate, setProductToRate] = React.useState<Product | null>(null);
    const [isChatbotOpen, setIsChatbotOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const [recentlyViewedProducts, setRecentlyViewedProducts] = React.useState<Product[]>(() => {
        const saved = localStorage.getItem('recentlyViewed');
        return saved ? JSON.parse(saved) : [];
    });
    const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = React.useState(false);
    const [pendingOrder, setPendingOrder] = React.useState<Omit<Order, 'id' | 'date' | 'status'> | null>(null);


    React.useEffect(() => { localStorage.setItem('userRole', currentUserRole); }, [currentUserRole]);
    React.useEffect(() => { localStorage.setItem('currentSeller', JSON.stringify(currentSeller)); }, [currentSeller]);
    React.useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
    React.useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
    React.useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
    React.useEffect(() => { localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewedProducts)); }, [recentlyViewedProducts]);
    
    const handleSetView = (view: AppView) => {
        setProductToEdit(null);
        setCurrentView(view);
    };

    const handleSetRole = (role: UserRole) => {
        setCurrentUserRole(role);
        if (role === UserRole.SELLER) {
            handleSetView(currentSeller ? AppView.SELLER_DASHBOARD : AppView.ACCOUNT);
        } else {
            handleSetView(AppView.EXPLORE);
        }
    };

    const handleLogin = (seller: Seller) => {
        setCurrentSeller(seller);
        handleSetView(AppView.SELLER_DASHBOARD);
    };

    const handleLogout = () => {
        setCurrentSeller(null);
        handleSetView(AppView.ACCOUNT);
    };

    const handleSaveProduct = React.useCallback((newProductData: Omit<Product, 'sellerId' | 'sellerName'>) => {
        if (!currentSeller) return;
        
        const existingProductIndex = products.findIndex(p => p.id === newProductData.id);
        const productWithSellerInfo = { 
            ...newProductData, 
            sellerId: currentSeller.id, 
            sellerName: currentSeller.name,
            ratings: productToEdit?.ratings || [],
        };

        if (existingProductIndex > -1) {
            const updatedProducts = [...products];
            updatedProducts[existingProductIndex] = productWithSellerInfo as Product;
            setProducts(updatedProducts);
        } else {
            setProducts(prevProducts => [...prevProducts, productWithSellerInfo as Product]);
        }
        
        setProductToEdit(null);
        handleSetView(AppView.SELLER_DASHBOARD);
    }, [currentSeller, products, productToEdit]);
    
    const handleUpdateProduct = (productId: string, updatedData: Partial<Omit<Product, 'id'>>) => {
        setProducts(prevProducts =>
            prevProducts.map(p =>
                p.id === productId ? { ...p, ...updatedData } : p
            )
        );
    };

    const handleEditProduct = (product: Product) => {
        setProductToEdit(product);
        handleSetView(AppView.PRODUCT_LISTER);
    };

    const handleRemoveProduct = (productId: string) => {
        setProducts(products.filter(p => p.id !== productId));
    };

    const handleAddToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        alert(`${product.productName} đã được thêm vào giỏ hàng!`);
    };

    const handleUpdateCartQuantity = (productId: string, quantity: number) => {
        setCart(prevCart =>
            prevCart.map(item => (item.id === productId ? { ...item, quantity } : item)).filter(item => item.quantity > 0)
        );
    };

    const handleRemoveFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };
    
    const handleCheckout = () => {
        if (cart.length === 0) return;
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.priceRange.replace(/[^0-9]/g, '')) || 0;
            return sum + (price * item.quantity);
        }, 0);

        setPendingOrder({
            items: cart,
            totalPrice: total,
        });
        setIsPaymentGatewayOpen(true);
    };
    
    const handlePaymentSuccess = () => {
        if (!pendingOrder) return;
        const newOrder: Order = {
            id: `order_${new Date().getTime()}`,
            date: new Date().toLocaleDateString('vi-VN'),
            items: pendingOrder.items,
            totalPrice: pendingOrder.totalPrice,
            status: OrderStatus.PROCESSING
        };
        setOrders(prevOrders => [...prevOrders, newOrder]);
        setCart([]);
        setPendingOrder(null);
        setIsPaymentGatewayOpen(false);
        alert('Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.');
        handleSetView(AppView.EXPLORE);
    };
    
    const handlePaymentCancel = () => {
        setPendingOrder(null);
        setIsPaymentGatewayOpen(false);
    };
    
    const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
        setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, status } : o));
    };

    const handleRemoveOrder = (orderId: string) => {
        setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
    };

    const handleView3D = (product: Product) => {
        setProductToView3D(product);
    };

    const handleOpenRatingForm = (product: Product) => {
        setProductToRate(product);
    };
    
    const handleSubmitRating = (rating: number, comment: string) => {
        if (!productToRate) return;
        const newRating: Rating = { rating, comment };
        
        handleUpdateProduct(productToRate.id, {
            ratings: [...(productToRate.ratings || []), newRating]
        });
        
        setProductToRate(null);
        alert('Cảm ơn bạn đã đánh giá sản phẩm!');
    };
    
    const handleAddToRecentlyViewed = (product: Product) => {
        setRecentlyViewedProducts(prev => {
            const isAlreadyViewed = prev.some(p => p.id === product.id);
            if (isAlreadyViewed) {
                return [product, ...prev.filter(p => p.id !== product.id)];
            }
            return [product, ...prev].slice(0, 5);
        });
    };
    
    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        handleAddToRecentlyViewed(product);
        handleSetView(AppView.MAP_VIEW);
    };

    const handleCloseDetailPanel = () => {
        setSelectedProduct(null);
    };

    const renderCurrentView = () => {
        const isMapView = currentView === AppView.MAP_VIEW;
        
        const mainContent = (() => {
            switch (currentView) {
                case AppView.EXPLORE:
                    return <ExploreView onNavigate={handleSetView} onProductClick={handleSelectProduct} products={products} />;
                case AppView.PRODUCT_LISTER:
                    return <ProductLister onSaveProduct={handleSaveProduct} productToEdit={productToEdit} />;
                case AppView.SELLER_DASHBOARD:
                    if (!currentSeller) return <SellerAuth onLogin={handleLogin} />;
                    return <SellerDashboard 
                        seller={currentSeller} 
                        products={products.filter(p => p.sellerId === currentSeller?.id)} 
                        orders={orders} 
                        onAddNewProduct={() => handleSetView(AppView.PRODUCT_LISTER)} 
                        onEditProduct={handleEditProduct} 
                        onRemoveProduct={handleRemoveProduct}
                        onUpdateOrderStatus={handleUpdateOrderStatus}
                        onRemoveOrder={handleRemoveOrder}
                        onUpdateProduct={handleUpdateProduct}
                    />;
                case AppView.SELLER_AUTH:
                     return <SellerAuth onLogin={handleLogin} />;
                case AppView.CART:
                    return <CartView cartItems={cart} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />;
                case AppView.PRODUCT_GALLERY:
                    return <ProductGallery products={products} onAddToCart={handleAddToCart} />;
                case AppView.INTERACTIVE_MAP:
                    return <InteractiveMap products={products} onView3D={handleView3D} />;
                case AppView.ACCOUNT:
                    return <AccountView 
                                currentUserRole={currentUserRole}
                                setCurrentUserRole={handleSetRole}
                                currentSeller={currentSeller}
                                onLogin={handleLogin}
                                onLogout={handleLogout}
                           />;
                case AppView.MAP_VIEW:
                     return <MapView 
                        products={products} 
                        onAddToCart={handleAddToCart} 
                        onView3D={handleView3D} 
                        onRateProduct={handleOpenRatingForm}
                        selectedProduct={selectedProduct}
                        onSelectProduct={handleSelectProduct}
                        onCloseDetailPanel={handleCloseDetailPanel}
                    />;
                default:
                    return <div>View not found</div>;
            }
        })();

        if (isMapView) return mainContent;

        return (
            <div className="p-4 md:p-6 lg:p-8">
                {mainContent}
            </div>
        );
    };

    const getHeaderTitle = () => {
        const viewTitles: { [key in AppView]?: string } = {
            [AppView.EXPLORE]: 'Khám Phá',
            [AppView.PRODUCT_GALLERY]: 'Sản Phẩm',
            [AppView.CART]: 'Giỏ Hàng',
            [AppView.ACCOUNT]: 'Tài Khoản',
            [AppView.SELLER_DASHBOARD]: 'Trang Bán Hàng',
            [AppView.PRODUCT_LISTER]: 'Đăng Sản Phẩm',
        };
        return viewTitles[currentView] || 'Gian Hàng Chợ Số';
    };


    return (
        <div className="flex h-screen w-screen bg-gray-50 font-sans text-gray-800">
            <Sidebar
                currentView={currentView}
                setCurrentView={handleSetView}
                cartItemCount={cart.length}
                currentUserRole={currentUserRole}
                setCurrentUserRole={handleSetRole}
                currentSeller={currentSeller}
                onLogout={handleLogout}
            />
            
            <main className="flex-1 flex flex-col h-full w-full overflow-hidden">
                <MobileHeader title={getHeaderTitle()} />
                <div className="flex-1 relative overflow-y-auto pb-20 md:pb-0">
                    {renderCurrentView()}
                    {currentView === AppView.MAP_VIEW && recentlyViewedProducts.length > 0 && !selectedProduct && (
                        <RecentlyViewed 
                            products={recentlyViewedProducts} 
                            onProductClick={handleSelectProduct} 
                        />
                    )}
                </div>
                <BottomNavBar currentView={currentView} setCurrentView={handleSetView} cartItemCount={cart.length} />
            </main>
            
            {productToView3D && <ModelViewer product={productToView3D} onClose={() => setProductToView3D(null)} onAddToCart={handleAddToCart} />}
            {productToRate && <RatingForm productName={productToRate.productName} onClose={() => setProductToRate(null)} onSubmit={handleSubmitRating} />}
            {isPaymentGatewayOpen && pendingOrder && (
                <PaymentGateway
                    isOpen={isPaymentGatewayOpen}
                    orderTotal={pendingOrder.totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                />
            )}
            
            <button
                onClick={() => setIsChatbotOpen(true)}
                className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-14 h-14 bg-emerald-600 rounded-full shadow-lg text-white flex items-center justify-center z-40 hover:bg-emerald-700 transition-transform hover:scale-110 btn-primary"
                aria-label="Mở trợ lý ảo"
            >
                <img src={chatbotAvatar.image} alt="Chatbot Avatar" className="w-12 h-12 rounded-full object-cover"/>
            </button>

            {isChatbotOpen && <VoiceChatbot onClose={() => setIsChatbotOpen(false)} />}
        </div>
    );
};

export default App;
