import { Product } from './data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ViewMode = 'shop' | 'product' | 'cart' | 'checkout' | 'confirmation';
