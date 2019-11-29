import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaymentsPage } from './payments.page';
import { PaymentPerUserModalPage } from '../modals/payment-per-user-modal/payment-per-user-modal.page'
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: PaymentsPage
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
  declarations: [
    PaymentsPage,
    PaymentPerUserModalPage
  ],
  entryComponents: [
    PaymentPerUserModalPage
  ]
})
export class PaymentsPageModule {}
