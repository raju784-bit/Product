
import { StoreSettings, User, Product } from './types';

export const INITIAL_SETTINGS: StoreSettings = {
  whatsappNumber: '8801700000000',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  storeName: 'Product Ghor',
  currencySymbol: '৳',
  logoUrl: 'https://picsum.photos/id/20/100/100',
  categories: ['Electronics', 'Fashion', 'Home Decor', 'Accessories', 'Beauty']
};

export const INITIAL_USERS: User[] = [
  { id: '1', username: 'raju784', email: 'raju@productghor.com', password: 'raju123', role: 'admin' },
  { id: '2', username: 'admin2', email: 'admin2@example.com', password: 'password456', role: 'admin' }
];

export const INITIAL_PRODUCTS: Product[] = [];
