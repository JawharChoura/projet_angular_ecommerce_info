import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private users: User[] = [];

  constructor() {
    const stored = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(stored ? JSON.parse(stored) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.loadUsers();
  }

  private loadUsers() {
    const users = localStorage.getItem('users');
    if (users) {
      this.users = JSON.parse(users);
    } else {
      // Initialize with demo users if not yet in localStorage
      this.users = [
        {
          id: 1,
          email: 'admin@test.com',
          password: 'password123',
          name: 'Admin User',
          role: 'admin'
        },
        {
          id: 2,
          email: 'client@test.com',
          password: 'password123',
          name: 'Client User',
          role: 'client'
        }
      ];
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  login(email: string, password: string): Observable<boolean | null> {
    return new Observable(observer => {
      const user = this.users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  registerUser(user: User): void {
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  emailExists(email: string): boolean {
    return this.users.some(user => user.email === email);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value != null;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  isClient(): boolean {
    return this.currentUserSubject.value?.role === 'client';
  }

  setUsers(users: User[]): void {
    this.users = users;
    localStorage.setItem('users', JSON.stringify(users));
  }

  getUsers(): User[] {
    return this.users;
  }

  updateUser(updatedUser: User): void {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }
}

