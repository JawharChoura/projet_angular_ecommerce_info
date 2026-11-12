import type { Category } from './Category';
import type { OrderItem } from './OrderItem';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stock: number;
  image?: string;
  createdAt?: Date;
  category?: Category;
  orderItems?: OrderItem[];
}
