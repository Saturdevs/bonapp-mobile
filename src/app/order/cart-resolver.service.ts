import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { OrderService } from 'src/shared';

@Injectable({
  providedIn: 'root'
})
export class CartResolverService implements Resolve<any> {

  constructor(private orderService: OrderService) { }

  resolve() {    
    return this.orderService.getCart();
  }
}
