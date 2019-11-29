import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentType } from '../models/payment-type';

@Injectable({
  providedIn: 'root'
})
export class PaymentTypesService {
  apiService: any;

  constructor() { }

  getPaymentType(idPaymentType): Observable<PaymentType> {
    return this.apiService.get(`/paymentType/${idPaymentType}`)
        .map(data => data.paymentType);
  }

  getAvailables(): Observable<PaymentType[]> {
    return this.apiService.get('/paymentType/availables')
            .map(data => data.paymentTypes)
  }
}
