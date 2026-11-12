import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { Order } from '../../models/Order';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  userOrders: Order[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserOrders(): void {
    if (this.currentUser) {
      this.loading = true;
      this.orderService.getOrdersByUser(this.currentUser.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          data => {
            this.userOrders = data;
            this.loading = false;
          },
          error => {
            console.error('Error loading orders:', error);
            this.loading = false;
          }
        );
    }
  }

  getOrderStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': '⏳ En attente',
      'confirmed': '✅ Confirmée',
      'shipped': '📦 Expédiée',
      'delivered': '🎉 Livrée',
      'cancelled': '❌ Annulée'
    };
    return labels[status] || status;
  }

  getOrderStatusClass(status: string): string {
    return `status-${status}`;
  }

  goBack(): void {
    if (this.currentUser?.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/client']);
    }
  }

  goToEditProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  logout(): void {
    const shouldLogout = confirm('Voulez-vous vraiment vous deconnecter ?');
    if (!shouldLogout) {
      return;
    }

    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
