import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Menu } from '../models/menu';

@Injectable()
export class MenuService {  

  constructor(
    private apiService: ApiService
  ) {}

  getAll(): Observable<Menu[]> {
    return this.apiService.get('/menu')
           .map(data => data.menus)
           .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }
}