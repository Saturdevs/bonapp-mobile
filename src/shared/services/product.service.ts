import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { Product } from '../models/product';

@Injectable()
export class ProductService {  

  constructor(
    private apiService: ApiService
  ) {}

  getAll(): Observable<Product[]> {
    return this.apiService.get('/product')
           .map(data => data.products)
           .catch(this.handleError);
  }

  getProduct(productId) {
    return this.apiService.get(`/product/${productId}`)
            .map(data => data.product)
            .catch(this.handleError);
  }
  
  getProductsByCategory(idCategory) {
    return this.apiService.get(`/product/category/${idCategory}`)
           .map(data => data.products)
           .catch(this.handleError);
  }

  updateProduct(product) {
    return this.apiService.put(`/product/${product._id}`, product)
      .map(data => data.product)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse){
    console.log(err.message);
    return Observable.throw(err);
  }
}