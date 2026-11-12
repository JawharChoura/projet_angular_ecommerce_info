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

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit, OnDestroy {
  activeTab = 'categories';
  orders: Order[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  currentUser: any = null;
  usersById: Record<string, User> = {};
  languageOptions: UiLanguageOption[] = [];
  selectedLanguage: SupportedLanguage = 'fr';
  showAddCategoryForm = false;
  showEditCategoryForm = false;
  private destroy$ = new Subject<void>();
  editingCategory: Category | null = null;
  newCategory: Omit<Category, 'id'> = { name: '', description: '' };

  private readonly labels: Record<SupportedLanguage, Record<string, string>> = {
    fr: { adminDashboard: 'Dashboard Admin', profile: 'Voir le profil', changeLanguage: 'Changer la langue', logout: 'Deconnexion', quickPending: 'Commandes en attente:', quickLowStock: 'Stock faible:', tabOrders: 'Commandes', tabProducts: 'Produits', tabCategories: 'Categories', ordersManagement: 'Gestion des Commandes', thUser: 'Utilisateur', thAmount: 'Montant', thStatus: 'Statut', thDate: 'Date', thAction: 'Action', statusPending: 'En attente', statusConfirmed: 'Confirmee', statusShipped: 'Expediee', statusDelivered: 'Livree', statusCancelled: 'Annulee', actionConfirm: 'Confirmer', actionProcessed: 'Traitee', unknownUser: 'Utilisateur inconnu', noContact: 'Contact indisponible' },
    en: { adminDashboard: 'Admin Dashboard', profile: 'View profile', changeLanguage: 'Change language', logout: 'Logout', quickPending: 'Pending orders:', quickLowStock: 'Low stock:', tabOrders: 'Orders', tabProducts: 'Products', tabCategories: 'Categories', ordersManagement: 'Orders Management', thUser: 'User', thAmount: 'Amount', thStatus: 'Status', thDate: 'Date', thAction: 'Action', statusPending: 'Pending', statusConfirmed: 'Confirmed', statusShipped: 'Shipped', statusDelivered: 'Delivered', statusCancelled: 'Cancelled', actionConfirm: 'Confirm', actionProcessed: 'Processed', unknownUser: 'Unknown user', noContact: 'No contact' },
    es: { adminDashboard: 'Panel de Administracion', profile: 'Ver perfil', changeLanguage: 'Cambiar idioma', logout: 'Cerrar sesion', quickPending: 'Pedidos pendientes:', quickLowStock: 'Stock bajo:', tabOrders: 'Pedidos', tabProducts: 'Productos', tabCategories: 'Categorias', ordersManagement: 'Gestion de Pedidos', thUser: 'Usuario', thAmount: 'Importe', thStatus: 'Estado', thDate: 'Fecha', thAction: 'Accion', statusPending: 'Pendiente', statusConfirmed: 'Confirmado', statusShipped: 'Enviado', statusDelivered: 'Entregado', statusCancelled: 'Cancelado', actionConfirm: 'Confirmar', actionProcessed: 'Procesado', unknownUser: 'Usuario desconocido', noContact: 'Sin contacto' },
    ar: { adminDashboard: 'لوحة الادارة', profile: 'عرض الملف الشخصي', changeLanguage: 'تغيير اللغة', logout: 'تسجيل الخروج', quickPending: 'الطلبات المعلقة:', quickLowStock: 'مخزون منخفض:', tabOrders: 'الطلبات', tabProducts: 'المنتجات', tabCategories: 'الفئات', ordersManagement: 'ادارة الطلبات', thUser: 'المستخدم', thAmount: 'المبلغ', thStatus: 'الحالة', thDate: 'التاريخ', thAction: 'الاجراء', statusPending: 'معلق', statusConfirmed: 'مؤكد', statusShipped: 'تم الشحن', statusDelivered: 'تم التسليم', statusCancelled: 'ملغي', actionConfirm: 'تأكيد', actionProcessed: 'تمت المعالجة', unknownUser: 'مستخدم غير معروف', noContact: 'لا يوجد تواصل' }
  } as const;

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

  getFlag(code: SupportedLanguage): string { switch (code) { case 'fr': return '🇫🇷'; case 'en': return '🇬🇧'; case 'es': return '🇪🇸'; case 'ar': return '🇸🇦'; default: return '🌐'; } }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
  onLanguageChange(language: SupportedLanguage): void { this.languageService.setLanguage(language); }
  getSelectedLanguageLabel(): string { return this.languageOptions.find(option => option.code === this.selectedLanguage)?.nativeLabel || this.selectedLanguage.toUpperCase(); }
  t(key: string): string { return this.labels[this.selectedLanguage][key] ?? this.labels.fr[key] ?? key; }
  loadOrders(): void { this.refreshUsersMap(); this.orderService.getOrders().pipe(takeUntil(this.destroy$)).subscribe(data => this.orders = data, error => console.error('Error loading orders:', error)); }
  loadProducts(): void { this.productService.getProducts().pipe(takeUntil(this.destroy$)).subscribe(data => this.products = data, error => console.error('Error loading products:', error)); }
  loadCategories(): void { this.categoryService.getCategories().pipe(takeUntil(this.destroy$)).subscribe(data => this.categories = data, error => console.error('Error loading categories:', error)); }
  getTotalOrders(): number { return this.orders.length; }
  getTotalRevenue(): number { return this.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0); }
  getPendingOrders(): number { return this.orders.filter(order => order.status === 'pending').length; }
  getTotalProducts(): number { return this.products.length; }
  getTotalCategories(): number { return this.categories.length; }
  getLowStockProducts(): number { return this.products.filter(product => product.stock < 5).length; }
  addCategory(): void { if (this.newCategory.name) { this.categoryService.addCategory(this.newCategory).subscribe(() => { this.newCategory = { name: '', description: '' }; this.showAddCategoryForm = false; this.loadCategories(); alert('Catégorie ajoutée avec succès'); }); } }
  editCategory(category: Category): void { this.editingCategory = { ...category }; this.showEditCategoryForm = true; }
  saveCategoryChanges(): void { if (this.editingCategory && this.editingCategory.name) { this.categoryService.updateCategory(this.editingCategory.id, this.editingCategory).subscribe(() => { this.showEditCategoryForm = false; this.editingCategory = null; this.loadCategories(); alert('Catégorie mise à jour avec succès'); }); } }
  cancelEditCategory(): void { this.showEditCategoryForm = false; this.editingCategory = null; }
  deleteCategory(id: any): void { const categoryId = this.toValidResourceId(id); if (!categoryId) { return; } if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) { this.categoryService.deleteCategory(categoryId).subscribe(() => this.loadCategories()); } }
  goToProfile(): void { this.router.navigate(['/profile']); }
  logout(): void { if (confirm('Voulez-vous vraiment vous deconnecter ?')) { this.authService.logout(); this.router.navigate(['/login']); } }
  private toValidResourceId(id: unknown): string | null { if (id === null || id === undefined) return null; const normalizedId = String(id).trim(); if (!normalizedId || normalizedId === '0') return null; return normalizedId; }
  private refreshUsersMap(): void { const users = this.authService.getUsers(); this.usersById = users.reduce<Record<string, User>>((accumulator, user) => { accumulator[String(user.id)] = user; return accumulator; }, {}); }
}
