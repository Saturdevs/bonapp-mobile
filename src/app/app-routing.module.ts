import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataResolverService } from 'src/shared/resolver/data-resolver.service';
import { CartResolverService } from './order/cart-resolver.service';
import { AuthGuard } from 'src/shared';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'category',
    resolve: {
      category: DataResolverService
    },
    loadChildren: './category/category.module#CategoryPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'menu',
    resolve: {
      menu: DataResolverService
    },
    loadChildren: './menu/menu.module#MenuPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'product',
    resolve: {
      product: DataResolverService
    },
    loadChildren: './product/product.module#ProductPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'order',
    resolve: {
      cart: CartResolverService
    },
    loadChildren: './order/order.module#OrderPageModule',
    canActivate: [AuthGuard]
  },
  { path: 'qrscanner', loadChildren: './qrscanner/qrscanner.module#QrscannerPageModule', canActivate: [AuthGuard] },
  { path: 'scanner', loadChildren: './scanner/scanner.module#ScannerPageModule', canActivate: [AuthGuard] },
  { path: 'searchbar', loadChildren: './searchbar/searchbar.module#SearchbarPageModule', canActivate: [AuthGuard] },
  { path: 'navbar', loadChildren: './navbar/navbar.module#NavbarPageModule' },
  { path: 'payments', loadChildren: './payments/payments.module#PaymentsPageModule', canActivate: [AuthGuard] },
  { path: 'mercado-pago', loadChildren: './modals/mercado-pago/mercado-pago.module#MercadoPagoPageModule', canActivate: [AuthGuard] },
  { path: 'mercado-pago-costumer', loadChildren: './modals/mercado-pago-costumer/mercado-pago-costumer.module#MercadoPagoCostumerPageModule', canActivate: [AuthGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'daily-menu', loadChildren: './daily-menu/daily-menu.module#DailyMenuPageModule' },
  { path: 'daily-menu-list', loadChildren: './daily-menu-list/daily-menu-list.module#DailyMenuListPageModule' },
  { path: 'daily-menu', loadChildren: './daily-menu/daily-menu.module#DailyMenuPageModule' },
  { path: 'app-login', loadChildren: './app-login/app-login.module#AppLoginPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
