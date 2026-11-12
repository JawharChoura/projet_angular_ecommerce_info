import type { Order } from './Order';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'client';
  createdAt?: Date;
  orders?: Order[];
}
