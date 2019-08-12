import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DataResolverService } from 'src/shared/resolver/data-resolver.service';

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
  { path: 'order', loadChildren: './order/order.module#OrderPageModule' },
  { path: 'qrscanner', loadChildren: './qrscanner/qrscanner.module#QrscannerPageModule' },
  { path: 'scanner', loadChildren: './scanner/scanner.module#ScannerPageModule' },
  { path: 'searchbar', loadChildren: './searchbar/searchbar.module#SearchbarPageModule' },
  { path: 'navbar', loadChildren: './navbar/navbar.module#NavbarPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
