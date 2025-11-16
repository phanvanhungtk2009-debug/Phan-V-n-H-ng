export enum AppView {
  SELLER_DASHBOARD = 'seller-dashboard',
  SELLER_AUTH = 'seller-auth',
  PRODUCT_LISTER = 'product-lister',
  MAP_VIEW = 'map-view',
  INTERACTIVE_MAP = 'interactive-map',
  PRODUCT_GALLERY = 'product-gallery',
  CART = 'cart',
  EXPLORE = 'explore',
  ACCOUNT = 'account',
}

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export enum OrderStatus {
  PROCESSING = 'Đang xử lý',
  COMPLETED = 'Đã hoàn thành',
  CANCELLED = 'Đã hủy',
}

export interface Seller {
  id: string; // phone number can be ID
  name: string;
  phone: string;
}

export interface Rating {
  rating: number;
  comment?: string;
}

export interface Product {
  id: string;
  productName: string;
  category: string;
  priceRange: string;
  description: string;
  brandImageUrl: string;
  originalImageUrl: string;
  qrValue: string;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  location: {
    latitude: number;
    longitude: number;
  };
  has3DModel: boolean;
  modelUrl?: string;
  ratings: Rating[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface ProductAnalysisResult {
    suggestedName: string;
    suggestedDescription: string;
    priceFeedback: string;
    marketingTips: string[];
}
