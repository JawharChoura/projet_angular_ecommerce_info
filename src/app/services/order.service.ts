import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Order } from '../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://backend-l96g.onrender.com/orders';
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadOrders();
  }

  loadOrders(): void {
    this.http.get<Order[]>(this.apiUrl).subscribe(
      data => this.ordersSubject.next(data),
      error => console.log('Error loading orders:', error)
    );
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string | number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getOrdersByUser(userId: number): Observable<Order[]> {
  
    return this.http.get<Order[]>(this.apiUrl).pipe(
      map(orders => orders.filter(o => String((o as any).userId) === String(userId)))
    );
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order).pipe(
      tap(created => {
      
        const current = this.ordersSubject.value || [];
        this.ordersSubject.next([...current, created]);
      })
    );
  }

  updateOrderStatus(id: string | number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}`, { status });
  }

  confirmOrder(id: string | number): Observable<Order> {
    return this.updateOrderStatus(id, 'confirmed');
  }

  deleteOrder(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
