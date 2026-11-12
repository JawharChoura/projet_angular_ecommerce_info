import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://backend-l96g.onrender.com/categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get<Category[]>(this.apiUrl).subscribe(
      data => this.categoriesSubject.next(data),
      error => console.log('Error loading categories:', error)
    );
  }

  refreshCategories(): void {
    this.loadCategories();
  }

  getCategories(): Observable<Category[]> {
    return this.categories$;
  }

  getCategoryById(id: any): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${this.normalizeId(id)}`);
  }

  addCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return new Observable(observer => {
      this.http.post<Category>(this.apiUrl, category).subscribe(
        data => {
          this.loadCategories();
          observer.next(data);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  updateCategory(id: any, category: Category): Observable<Category> {
    return new Observable(observer => {
      this.http.put<Category>(`${this.apiUrl}/${this.normalizeId(id)}`, category).subscribe(
        data => {
          this.loadCategories();
          observer.next(data);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

  deleteCategory(id: any): Observable<void> {
    return new Observable(observer => {
      this.http.delete<void>(`${this.apiUrl}/${this.normalizeId(id)}`).subscribe(
        () => {
          this.loadCategories();
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
      throw new Error('Category id is required');
    }

    return String(id).trim();
  }
}
