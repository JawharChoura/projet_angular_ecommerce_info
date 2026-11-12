import type { Product } from './Product';

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
  products?: Product[];
}
