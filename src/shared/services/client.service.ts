import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Client } from '../models/client';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<Client[]> {
    return this.apiService.get('/client')
      .map(data => data.clients)
      .catch(this.handleError);
  }

  getWithCurrentAccountEnabled(): Observable<Client[]> {
    return this.apiService.get('/client/withCurrentAccountEnabled')
      .map(data => data.clients)
      .catch(this.handleError);
  }

  getClient(idClient): Observable<Client> {
    return this.apiService.get(`/client/${idClient}`)
      .map(data => data.client);
  }

  getClientByEmail(email){
    return this.apiService.get(`/client/email/${email}`)
      .map(data => data.client);
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }

}