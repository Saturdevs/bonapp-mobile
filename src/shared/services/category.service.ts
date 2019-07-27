import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Category } from '../models/category';

@Injectable()
export class CategoryService {  

  constructor(
    private apiService: ApiService
  ) {}

  getAll(): Observable<Category[]> {
    return this.apiService.get('/category')
           .map(data => data.categories)
           .catch(this.handleError);
  }

  getCategoriesByMenu(idMenu) {
    return this.apiService.get(`/category/parent/${idMenu}`)
           .map(data => data.categories)
           .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }
}