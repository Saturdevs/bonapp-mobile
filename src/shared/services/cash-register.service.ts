import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { CashRegister } from '../models/index';

@Injectable({
  providedIn: 'root'
})
export class CashRegisterService {

  constructor(
    private apiService: ApiService
  ) {}

  getDefaultCashRegister(): Observable<CashRegister> {
    return this.apiService.get('/default')
      .map(data => data.cashRegister)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }
}
