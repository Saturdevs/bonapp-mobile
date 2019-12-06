import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PaymentsPage } from './payments.page';
import { PaymentPerUserModalPage } from '../modals/payment-per-user-modal/payment-per-user-modal.page'
import { SharedModule } from '../../shared/shared.module';
import { MercadoPagoPage } from '../modals/mercado-pago/mercado-pago.page';
import { MercadoPagoCostumerPage } from '../modals/mercado-pago-costumer/mercado-pago-costumer.page';

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
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [
    PaymentsPage,
    PaymentPerUserModalPage,
    MercadoPagoPage,
    MercadoPagoCostumerPage
  ],
  entryComponents: [
    PaymentPerUserModalPage,
    MercadoPagoPage,
    MercadoPagoCostumerPage
  ]
})
export class PaymentsPageModule {}
