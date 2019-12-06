import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {

  constructor(private apiService: ApiService) { }

  postPayment(payment){
    return this.apiService.post(`/mercadoPago`, payment)
    .map(data => data.payment)
    .catch(this.handleError);
  }

  postCustomerPayment(request){
    return this.apiService.post(`/mercadoPago/customerPayment`, request)
    .map(data => data)
    .catch(this.handleError);
  }

  createCustomerAndCard(customerInfo){
    return this.apiService.post(`/mercadoPago/createCustomer`, customerInfo)
    .map(data => data.card)
    .catch(this.handleError);
  }

  saveCustomerCard(cardInfo){
    return this.apiService.post(`/mercadoPago/addCard`, cardInfo)
    .map(data => data.card)
    .catch(this.handleError);
  }

  getCustomerCards(customerId){
    return this.apiService.get(`/mercadoPago/getCustomerCards/${customerId}`)
    .map(data => data.customer)
    .catch(this.handleError);
  }

  getCustomer(email){
    return this.apiService.get(`/mercadoPago/getCustomer/${email}`)
    .map(data => data.customer)
    .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throwError(err);
  }
}
