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
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  activeTab = 'products';
  orders: Order[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  currentUser: any = null;
  usersById: Record<string, User> = {};
  languageOptions: UiLanguageOption[] = [];
  selectedLanguage: SupportedLanguage = 'fr';

  showAddProductForm = false;
  showEditProductForm = false;
  private destroy$ = new Subject<void>();

  editingProduct: Product | null = null;

  newProduct: Omit<Product, 'id'> = {
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
    stock: 0,
    image: ''
  };

  barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Nombre de Achats',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true, position: 'top' } },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Purchases' } },
      x: { title: { display: true, text: 'Product Names' } }
    }
  };

  private readonly labels: Record<SupportedLanguage, Record<string, string>> = {
    fr: {
      adminDashboard: 'Dashboard Admin', profile: 'Voir le profil', changeLanguage: 'Changer la langue', logout: 'Deconnexion',
      quickPending: 'Commandes en attente:', quickLowStock: 'Stock faible:', tabOrders: 'Commandes', tabProducts: 'Produits', tabCategories: 'Categories',
      ordersManagement: 'Gestion des Commandes', thUser: 'Utilisateur', thAmount: 'Montant', thStatus: 'Statut', thDate: 'Date', thAction: 'Action',
      statusPending: 'En attente', statusConfirmed: 'Confirmee', statusShipped: 'Expediee', statusDelivered: 'Livree', statusCancelled: 'Annulee',
      actionConfirm: 'Confirmer', actionProcessed: 'Traitee', unknownUser: 'Utilisateur inconnu', noContact: 'Contact indisponible'
    },
    en: {
      adminDashboard: 'Admin Dashboard', profile: 'View profile', changeLanguage: 'Change language', logout: 'Logout',
      quickPending: 'Pending orders:', quickLowStock: 'Low stock:', tabOrders: 'Orders', tabProducts: 'Products', tabCategories: 'Categories',
      ordersManagement: 'Orders Management', thUser: 'User', thAmount: 'Amount', thStatus: 'Status', thDate: 'Date', thAction: 'Action',
      statusPending: 'Pending', statusConfirmed: 'Confirmed', statusShipped: 'Shipped', statusDelivered: 'Delivered', statusCancelled: 'Cancelled',
      actionConfirm: 'Confirm', actionProcessed: 'Processed', unknownUser: 'Unknown user', noContact: 'No contact'
    },
    es: {
      adminDashboard: 'Panel de Administracion', profile: 'Ver perfil', changeLanguage: 'Cambiar idioma', logout: 'Cerrar sesion',
      quickPending: 'Pedidos pendientes:', quickLowStock: 'Stock bajo:', tabOrders: 'Pedidos', tabProducts: 'Productos', tabCategories: 'Categorias',
      ordersManagement: 'Gestion de Pedidos', thUser: 'Usuario', thAmount: 'Importe', thStatus: 'Estado', thDate: 'Fecha', thAction: 'Accion',
      statusPending: 'Pendiente', statusConfirmed: 'Confirmado', statusShipped: 'Enviado', statusDelivered: 'Entregado', statusCancelled: 'Cancelado',
      actionConfirm: 'Confirmar', actionProcessed: 'Procesado', unknownUser: 'Usuario desconocido', noContact: 'Sin contacto'
    },
    ar: {
      adminDashboard: 'لوحة الادارة', profile: 'عرض الملف الشخصي', changeLanguage: 'تغيير اللغة', logout: 'تسجيل الخروج',
      quickPending: 'الطلبات المعلقة:', quickLowStock: 'مخزون منخفض:', tabOrders: 'الطلبات', tabProducts: 'المنتجات', tabCategories: 'الفئات',
      ordersManagement: 'ادارة الطلبات', thUser: 'المستخدم', thAmount: 'المبلغ', thStatus: 'الحالة', thDate: 'التاريخ', thAction: 'الاجراء',
      statusPending: 'معلق', statusConfirmed: 'مؤكد', statusShipped: 'تم الشحن', statusDelivered: 'تم التسليم', statusCancelled: 'ملغي',
      actionConfirm: 'تأكيد', actionProcessed: 'تمت المعالجة', unknownUser: 'مستخدم غير معروف', noContact: 'لا يوجد تواصل'
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
    this.languageService.activeLanguage$.pipe(takeUntil(this.destroy$)).subscribe(language => this.selectedLanguage = language);
    this.refreshUsersMap();
    this.loadOrders();
    this.loadProducts();
    this.loadCategories();
  }

  getFlag(code: SupportedLanguage): string {
    switch (code) { case 'fr': return '🇫🇷'; case 'en': return '🇬🇧'; case 'es': return '🇪🇸'; case 'ar': return '🇸🇦'; default: return '🌐'; }
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadOrders(): void {
    this.refreshUsersMap();
    this.orderService.getOrders().pipe(takeUntil(this.destroy$)).subscribe(data => { this.orders = data; this.updatePurchaseChart(); }, error => console.error('Error loading orders:', error));
  }

  loadProducts(): void { this.productService.getProducts().pipe(takeUntil(this.destroy$)).subscribe(data => this.products = data, error => console.error('Error loading products:', error)); }
  loadCategories(): void { this.categoryService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(data => this.categories = data, error => console.error('Error loading categories:', error)); }

  onLanguageChange(language: SupportedLanguage): void { this.languageService.setLanguage(language); }
  getSelectedLanguageLabel(): string { return this.languageOptions.find(option => option.code === this.selectedLanguage)?.nativeLabel || this.selectedLanguage.toUpperCase(); }
  t(key: string): string { return this.labels[this.selectedLanguage][key] ?? this.labels.fr[key] ?? key; }
  getOrderStatusLabel(status: Order['status']): string { const map: Record<Order['status'], string> = { pending: this.t('statusPending'), confirmed: this.t('statusConfirmed'), shipped: this.t('statusShipped'), delivered: this.t('statusDelivered'), cancelled: this.t('statusCancelled') }; return map[status] || status; }
  getOrderUserName(userId: unknown): string { const user = this.usersById[String(userId)]; return user?.name || this.t('unknownUser'); }
  getOrderUserContact(userId: unknown): string { const user = this.usersById[String(userId)]; return user?.email || this.t('noContact'); }
  getOrderItemsSummary(itemsCount: number): string { return `${this.t('viewItems')} (${itemsCount || 0})`; }

  getTotalOrders(): number { return this.orders.length; }
  getTotalRevenue(): number { return this.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0); }
  getPendingOrders(): number { return this.orders.filter(order => order.status === 'pending').length; }
  getTotalProducts(): number { return this.products.length; }
  getTotalCategories(): number { return this.categories.length; }
  getLowStockProducts(): number { return this.products.filter(product => product.stock < 5).length; }
  getCategoryName(categoryId: unknown): string { const category = this.categories.find(current => String(current.id) === String(categoryId)); return category?.name || 'Categorie inconnue'; }

  

  addProduct(): void { const normalizedImageUrl = (this.newProduct.image ?? '').trim(); const payload: Omit<Product, 'id'> = { ...this.newProduct, price: Number(this.newProduct.price), stock: Number(this.newProduct.stock), categoryId: this.newProduct.categoryId, image: normalizedImageUrl || undefined }; const normalizedCategoryId = String(payload.categoryId).trim(); if (payload.name && payload.price > 0 && normalizedCategoryId && normalizedCategoryId !== '0') { this.productService.addProduct(payload).subscribe(() => { this.loadProducts(); this.newProduct = { name: '', description: '', price: 0, categoryId: 0, stock: 0, image: '' }; this.showAddProductForm = false; alert('Produit ajouté avec succès'); }, error => console.error('Error adding product:', error)); } else { alert('Veuillez remplir tous les champs obligatoires'); } }

  editProduct(product: Product): void { this.editingProduct = { ...product }; this.showEditProductForm = true; }
  saveProductChanges(): void { if (this.editingProduct && this.editingProduct.name && this.editingProduct.price > 0) { this.productService.updateProduct(this.editingProduct.id, this.editingProduct).subscribe(() => { this.loadProducts(); this.showEditProductForm = false; this.editingProduct = null; alert('Produit mis à jour avec succès'); }, error => console.error('Error updating product:', error)); } }
  cancelEditProduct(): void { this.showEditProductForm = false; this.editingProduct = null; }
  deleteProduct(id: any): void { const productId = this.toValidResourceId(id); if (!productId) { alert('Identifiant produit invalide. Rechargez la page puis réessayez.'); return; } if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) { this.productService.deleteProduct(productId).subscribe(() => { this.loadProducts(); alert('Produit supprimé'); }, error => console.error('Error deleting product:', error)); } }
  onNewProductImageSelected(event: Event): void { const input = event.target as HTMLInputElement; const selectedFile = input.files?.[0]; if (!selectedFile) { this.newProduct.image = ''; return; } const reader = new FileReader(); reader.onload = () => { this.newProduct.image = typeof reader.result === 'string' ? reader.result : ''; }; reader.readAsDataURL(selectedFile); }
  clearNewProductImage(input: HTMLInputElement): void { input.value = ''; this.newProduct.image = ''; }
  onEditingProductImageSelected(event: Event): void { const input = event.target as HTMLInputElement; const selectedFile = input.files?.[0]; if (!this.editingProduct || !selectedFile) { return; } const reader = new FileReader(); reader.onload = () => { if (this.editingProduct) { this.editingProduct.image = typeof reader.result === 'string' ? reader.result : ''; } }; reader.readAsDataURL(selectedFile); }
  clearEditingProductImage(input: HTMLInputElement): void { input.value = ''; if (this.editingProduct) { this.editingProduct.image = ''; } }


  goToProfile(): void { this.router.navigate(['/profile']); }
  logout(): void { if (confirm('Voulez-vous vraiment vous deconnecter ?')) { this.authService.logout(); this.router.navigate(['/login']); } }
  private updatePurchaseChart(): void { const purchasesByProduct: Record<string, number> = {}; this.orders.forEach(order => { if (order.items && Array.isArray(order.items)) { order.items.forEach(item => { const productName = item.productName || `Product ${item.productId}`; purchasesByProduct[productName] = (purchasesByProduct[productName] || 0) + (item.quantity || 1); }); } }); const productNames = Object.keys(purchasesByProduct); const purchaseCounts = Object.values(purchasesByProduct); this.barChartData = { labels: productNames, datasets: [{ label: 'Number of Purchases', data: purchaseCounts, backgroundColor: 'rgba(75, 192, 192, 0.6)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] }; }
  private toValidResourceId(id: unknown): string | null { if (id === null || id === undefined) { return null; } const normalizedId = String(id).trim(); if (!normalizedId || normalizedId === '0') { return null; } return normalizedId; }
  private refreshUsersMap(): void { const users = this.authService.getUsers(); this.usersById = users.reduce<Record<string, User>>((accumulator, user) => { accumulator[String(user.id)] = user; return accumulator; }, {}); }
}
