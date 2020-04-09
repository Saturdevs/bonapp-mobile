import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private apiService: ApiService) { }

  baseUrl: String = 'transaction';

  getAll(): Observable<Transaction[]> {
    return this.apiService.get(`/${this.baseUrl}`)
      .map(data => data.transactions)
      .catch(this.handleError);
  }

  getTransaction(idTransaction): Observable<Transaction> {
    return this.apiService.get(`/${this.baseUrl}/${idTransaction}`)
      .map(data => data.transaction);
  }

  deleteTransaction(idTransaction) {
    return this.apiService.delete(`/${this.baseUrl}/${idTransaction}`)
      .map(data => data.transaction)
      .catch(this.handleError);
  }

  saveTransaction(transaction) {
    return this.apiService.post(`/${this.baseUrl}`, transaction)
      .map(data => data.transaction)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }
}
