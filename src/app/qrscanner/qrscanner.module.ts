import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QrscannerPage } from './qrscanner.page';
import { SharedModule } from 'src/shared/shared.module';
import { ScannerPage } from '../scanner/scanner.page';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { TableService } from 'src/shared/services/table.service';
import { RestaurantService } from 'src/shared/services/restaurant.service';

const routes: Routes = [
  {
    path: '',
    component: QrscannerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QrscannerPage, ScannerPage],
  providers: [QRScanner, RestaurantService]  
})
export class QrscannerPageModule {}
