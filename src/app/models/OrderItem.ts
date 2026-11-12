import type { Order } from './Order';
import type { Product } from './Product';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  order?: Order;
  product?: Product;
  productName?: string;
}
