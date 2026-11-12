import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { User } from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'E-Commerce Informatique';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUsersFromDB();
  }

  loadUsersFromDB(): void {
    this.http.get<User[]>('https://projetangular-97aeb.web.app/users').subscribe(
      (users) => {
        this.authService.setUsers(users);
      },
      (error) => {
        console.log('JSON Server not available, users will be set from mock data');
        // If JSON server is not available, set mock users
        const mockUsers: User[] = [
          { id: 1, email: 'admin@test.com', password: 'password123', name: 'Admin User', role: 'admin' },
          { id: 2, email: 'client@test.com', password: 'password123', name: 'Client User', role: 'client' }
        ];
        this.authService.setUsers(mockUsers);
      }
    );
  }
}
