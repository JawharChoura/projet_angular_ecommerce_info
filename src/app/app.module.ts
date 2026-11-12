import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { BaseChartDirective } from 'ng2-charts';
import Chart from 'chart.js/auto';
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PieController,
  ArcElement
} from 'chart.js';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemberComponent } from './member/member.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';
import { SiteNavbarComponent } from './components/site-navbar/site-navbar.component';
import { AdminOrdersComponent } from './components/admin-dashboard/orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin-dashboard/products/admin-products.component';
import { AdminCategoriesComponent } from './components/admin-dashboard/categories/admin-categories.component';
import { ClientProductsComponent } from './components/client-dashboard/products/client-products.component';
import { ClientCartComponent } from './components/client-dashboard/cart/client-cart.component';
import { ClientOrdersComponent } from './components/client-dashboard/orders/client-orders.component';

// Interceptors
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Register Chart.js plugins explicitly to ensure all scales and plugins are available
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PieController,
  ArcElement
);

@NgModule({
  declarations: [
    AppComponent,
    MemberComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    EditProfileComponent,
    SiteFooterComponent,
    SiteNavbarComponent,
    AdminOrdersComponent,
    AdminProductsComponent,
    AdminCategoriesComponent,
    ClientProductsComponent,
    ClientCartComponent,
    ClientOrdersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
    BaseChartDirective
  ],
  providers: [
    // Enregistrer les interceptors HTTP
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

