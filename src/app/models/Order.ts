import type { User } from './User';
import type { OrderItem } from './OrderItem';

export interface Order {
  id?: string | number;
  userId: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
  user?: User;
}
