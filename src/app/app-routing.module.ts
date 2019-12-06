import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataResolverService } from 'src/shared/resolver/data-resolver.service';
import { CartResolverService } from './order/cart-resolver.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { path: 'category', 
    resolve: {
      category: DataResolverService
    },
    loadChildren: './category/category.module#CategoryPageModule' },
  { 
    path: 'menu',
    resolve: {
      menu: DataResolverService
    },
    loadChildren: './menu/menu.module#MenuPageModule' 
  },
  { 
    path: 'product',
    resolve: {
      product: DataResolverService
    },
    loadChildren: './product/product.module#ProductPageModule' 
  },
  { path: 'order', 
    resolve: {
      cart: CartResolverService
    },
    loadChildren: './order/order.module#OrderPageModule' 
  },
  { path: 'qrscanner', loadChildren: './qrscanner/qrscanner.module#QrscannerPageModule' },
  { path: 'scanner', loadChildren: './scanner/scanner.module#ScannerPageModule' },
  { path: 'searchbar', loadChildren: './searchbar/searchbar.module#SearchbarPageModule' },
  { path: 'navbar', loadChildren: './navbar/navbar.module#NavbarPageModule' },
  { path: 'payments', loadChildren: './payments/payments.module#PaymentsPageModule' },
  { path: 'mercado-pago', loadChildren: './modals/mercado-pago/mercado-pago.module#MercadoPagoPageModule' },
  { path: 'mercado-pago-costumer', loadChildren: './modals/mercado-pago-costumer/mercado-pago-costumer.module#MercadoPagoCostumerPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
