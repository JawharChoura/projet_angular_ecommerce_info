import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://backend-l96g.onrender.com/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<Product[]>(this.apiUrl).subscribe(
      data => this.productsSubject.next(data),
      error => console.log('Error loading products:', error)
    );
  }

  refreshProducts(): void {
    this.loadProducts();
  }

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductById(id: any): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${this.normalizeId(id)}`);
  }

  getProductsByCategory(categoryId: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?categoryId=${categoryId}`);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return new Observable(observer => {
      this.http.post<Product>(this.apiUrl, product).subscribe(
        data => {
          this.loadProducts();
          observer.next(data);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  updateProduct(id: any, product: Product): Observable<Product> {
    return new Observable(observer => {
      this.http.put<Product>(`${this.apiUrl}/${this.normalizeId(id)}`, product).subscribe(
        data => {
          this.loadProducts();
          observer.next(data);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  deleteProduct(id: any): Observable<void> {
    return new Observable(observer => {
      this.http.delete<void>(`${this.apiUrl}/${this.normalizeId(id)}`).subscribe(
        () => {
          this.loadProducts();
          observer.next();
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  private normalizeId(id: any): string {
    if (id === null || id === undefined) {
      throw new Error('Product id is required');
    }

    return String(id).trim();
  }
}
