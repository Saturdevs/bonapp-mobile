import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ScannerPage } from './scanner.page';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';

const routes: Routes = [
  {
    path: '',
    component: ScannerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ScannerPage],
  providers: [QRScanner]
})
export class ScannerPageModule {}
