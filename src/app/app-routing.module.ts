import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminOrdersComponent } from './components/admin-dashboard/orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin-dashboard/products/admin-products.component';
import { AdminCategoriesComponent } from './components/admin-dashboard/categories/admin-categories.component';
import { ClientProductsComponent } from './components/client-dashboard/products/client-products.component';
import { ClientCartComponent } from './components/client-dashboard/cart/client-cart.component';
import { ClientOrdersComponent } from './components/client-dashboard/orders/client-orders.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', redirectTo: '/admin/orders', pathMatch: 'full' },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/categories', component: AdminCategoriesComponent, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'client', redirectTo: '/client/products', pathMatch: 'full' },
  { path: 'client/products', component: ClientProductsComponent, canActivate: [AuthGuard], data: { role: 'client' } },
  { path: 'client/cart', component: ClientCartComponent, canActivate: [AuthGuard], data: { role: 'client' } },
  { path: 'client/orders', component: ClientOrdersComponent, canActivate: [AuthGuard], data: { role: 'client' } },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

