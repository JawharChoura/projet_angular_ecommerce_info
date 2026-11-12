import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentUser = this.authService.getCurrentUser();

    
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          
          Authorization: `Bearer user-${currentUser.id}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request);
  }
}
