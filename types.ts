
export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  category: string;
  description: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'customer';
}

export interface StoreSettings {
  whatsappNumber: string;
  facebookUrl: string;
  instagramUrl: string;
  storeName: string;
  logoUrl?: string;
  currencySymbol: string;
  categories: string[]; 
}

export interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  role: 'admin' | 'customer' | null;
}
