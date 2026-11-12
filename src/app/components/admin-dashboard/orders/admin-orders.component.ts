import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Order } from '../../../models/Order';
import { Product } from '../../../models/Product';
import { Category } from '../../../models/Category';
import { User } from '../../../models/User';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LanguageService, SupportedLanguage, UiLanguageOption } from '../../../services/language.service';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  activeTab = 'orders';
  orders: Order[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  currentUser: any = null;
  usersById: Record<string, User> = {};
  languageOptions: UiLanguageOption[] = [];
  selectedLanguage: SupportedLanguage = 'fr';
  private destroy$ = new Subject<void>();

  // Pie Chart Configuration
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ],
      borderColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ],
      borderWidth: 2
    }]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  private readonly labels: Record<SupportedLanguage, Record<string, string>> = {
    fr: {
      adminDashboard: 'Dashboard Admin',
      profile: 'Voir le profil',
      changeLanguage: 'Changer la langue',
      logout: 'Deconnexion',
      quickPending: 'Commandes en attente:',
      quickLowStock: 'Stock faible:',
      tabOrders: 'Commandes',
      tabProducts: 'Produits',
      tabCategories: 'Categories',
      ordersManagement: 'Gestion des Commandes',
      thUser: 'Utilisateur',
      thAmount: 'Montant',
      thStatus: 'Statut',
      thDate: 'Date',
      thAction: 'Action',
      statusPending: 'En attente',
      statusConfirmed: 'Confirmee',
      statusShipped: 'Expediee',
      statusDelivered: 'Livree',
      statusCancelled: 'Annulee',
      actionConfirm: 'Confirmer',
      actionProcessed: 'Traitee',
      unknownUser: 'Utilisateur inconnu',
      noContact: 'Contact indisponible'
    },
    en: {
      adminDashboard: 'Admin Dashboard',
      profile: 'View profile',
      changeLanguage: 'Change language',
      logout: 'Logout',
      quickPending: 'Pending orders:',
      quickLowStock: 'Low stock:',
      tabOrders: 'Orders',
      tabProducts: 'Products',
      tabCategories: 'Categories',
      ordersManagement: 'Orders Management',
      thUser: 'User',
      thAmount: 'Amount',
      thStatus: 'Status',
      thDate: 'Date',
      thAction: 'Action',
      statusPending: 'Pending',
      statusConfirmed: 'Confirmed',
      statusShipped: 'Shipped',
      statusDelivered: 'Delivered',
      statusCancelled: 'Cancelled',
      actionConfirm: 'Confirm',
      actionProcessed: 'Processed',
      unknownUser: 'Unknown user',
      noContact: 'No contact'
    },
    es: {
      adminDashboard: 'Panel de Administracion',
      profile: 'Ver perfil',
      changeLanguage: 'Cambiar idioma',
      logout: 'Cerrar sesion',
      quickPending: 'Pedidos pendientes:',
      quickLowStock: 'Stock bajo:',
      tabOrders: 'Pedidos',
      tabProducts: 'Productos',
      tabCategories: 'Categorias',
      ordersManagement: 'Gestion de Pedidos',
      thUser: 'Usuario',
      thAmount: 'Importe',
      thStatus: 'Estado',
      thDate: 'Fecha',
      thAction: 'Accion',
      statusPending: 'Pendiente',
      statusConfirmed: 'Confirmado',
      statusShipped: 'Enviado',
      statusDelivered: 'Entregado',
      statusCancelled: 'Cancelado',
      actionConfirm: 'Confirmar',
      actionProcessed: 'Procesado',
      unknownUser: 'Usuario desconocido',
      noContact: 'Sin contacto'
    },
    ar: {
      adminDashboard: 'لوحة الادارة',
      profile: 'عرض الملف الشخصي',
      changeLanguage: 'تغيير اللغة',
      logout: 'تسجيل الخروج',
      quickPending: 'الطلبات المعلقة:',
      quickLowStock: 'مخزون منخفض:',
      tabOrders: 'الطلبات',
      tabProducts: 'المنتجات',
      tabCategories: 'الفئات',
      ordersManagement: 'ادارة الطلبات',
      thUser: 'المستخدم',
      thAmount: 'المبلغ',
      thStatus: 'الحالة',
      thDate: 'التاريخ',
      thAction: 'الاجراء',
      statusPending: 'معلق',
      statusConfirmed: 'مؤكد',
      statusShipped: 'تم الشحن',
      statusDelivered: 'تم التسليم',
      statusCancelled: 'ملغي',
      actionConfirm: 'تأكيد',
      actionProcessed: 'تمت المعالجة',
      unknownUser: 'مستخدم غير معروف',
      noContact: 'لا يوجد تواصل'
    }
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.languageOptions = this.languageService.getLanguageOptions();
    this.selectedLanguage = this.languageService.getCurrentLanguage();
    this.languageService.activeLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => this.selectedLanguage = language);

    this.refreshUsersMap();
    this.loadOrders();
    this.loadProducts();
    this.loadCategories();
  }

  getFlag(code: SupportedLanguage): string {
    switch (code) {
      case 'fr': return '🇫🇷';
      case 'en': return '🇬🇧';
      case 'es': return '🇪🇸';
      case 'ar': return '🇸🇦';
      default: return '🌐';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.refreshUsersMap();
    this.orderService.getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.orders = data;
        this.updatePieChartData();
      }, error => console.error('Error loading orders:', error));
  }

  onLanguageChange(language: SupportedLanguage): void {
    this.languageService.setLanguage(language);
  }

  getSelectedLanguageLabel(): string {
    return this.languageOptions.find(option => option.code === this.selectedLanguage)?.nativeLabel || this.selectedLanguage.toUpperCase();
  }

  t(key: string): string {
    return this.labels[this.selectedLanguage][key] ?? this.labels.fr[key] ?? key;
  }

  getOrderUserName(userId: unknown): string {
    const user = this.usersById[String(userId)];
    return user?.name || this.t('unknownUser');
  }

  getOrderUserContact(userId: unknown): string {
    const user = this.usersById[String(userId)];
    return user?.email || this.t('noContact');
  }

  getOrderStatusLabel(status: Order['status']): string {
    const statusLabels: Record<Order['status'], string> = {
      pending: this.t('statusPending'),
      confirmed: this.t('statusConfirmed'),
      shipped: this.t('statusShipped'),
      delivered: this.t('statusDelivered'),
      cancelled: this.t('statusCancelled')
    };

    return statusLabels[status] || status;
  }

  loadProducts(): void {
    this.productService.getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.products = data, error => console.error('Error loading products:', error));
  }

  loadCategories(): void {
    this.categoryService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.categories = data, error => console.error('Error loading categories:', error));
  }

  confirmOrder(order: Order): void {
    const id = (order && order.id !== undefined && order.id !== null) ? order.id : null;
    if (id === null) {
      console.error('Invalid order id for confirming order:', order?.id);
      return;
    }

    this.orderService.confirmOrder(id).subscribe(
      () => this.loadOrders(),
      error => console.error('Error confirming order:', error)
    );
  }

  private updatePieChartData(): void {
    const statusCounts = {
      pending: this.orders.filter(order => order.status === 'pending').length,
      confirmed: this.orders.filter(order => order.status === 'confirmed').length,
      shipped: this.orders.filter(order => order.status === 'shipped').length,
      delivered: this.orders.filter(order => order.status === 'delivered').length,
      cancelled: this.orders.filter(order => order.status === 'cancelled').length
    };

    const statusLabels = {
      pending: this.t('statusPending'),
      confirmed: this.t('statusConfirmed'),
      shipped: this.t('statusShipped'),
      delivered: this.t('statusDelivered'),
      cancelled: this.t('statusCancelled')
    };

    this.pieChartData.labels = Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status]) => statusLabels[status as keyof typeof statusLabels]);

    this.pieChartData.datasets[0].data = Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([_, count]) => count);
  }

  getTotalOrders(): number {
    return this.orders.length;
  }

  getTotalRevenue(): number {
    return this.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }

  getPendingOrders(): number {
    return this.orders.filter(order => order.status === 'pending').length;
  }

  getTotalProducts(): number {
    return this.products.length;
  }

  getTotalCategories(): number {
    return this.categories.length;
  }

  getLowStockProducts(): number {
    return this.products.filter(product => product.stock < 5).length;
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    const shouldLogout = confirm('Voulez-vous vraiment vous deconnecter ?');
    if (!shouldLogout) {
      return;
    }

    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private refreshUsersMap(): void {
    const users = this.authService.getUsers();
    this.usersById = users.reduce<Record<string, User>>((accumulator, user) => {
      accumulator[String(user.id)] = user;
      return accumulator;
    }, {});
  }
}
