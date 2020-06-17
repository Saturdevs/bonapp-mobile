import { ApiService } from './api.service';
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Observable } from "rxjs/Rx";
import { HttpErrorResponse } from '@angular/common/http';
import { ProductInUserOrder, Order, ProductOption } from '../models';
import { isNullOrUndefined } from 'util';

@Injectable()
export class OrderService {
    CART = "cart";
    cart = {
        products: [],
        total: 0
    };

    constructor(public storage: Storage,
        private apiService: ApiService) { }

    updateTotalPrice(cart: any, price: number, quantity: number) {
        cart.total += price * quantity;
    }

    ////////////////////////////////////////////////////////////////////////
    /////////////////////////LOCAL STORAGE METHODS//////////////////////////
    ////////////////////////////////////////////////////////////////////////

    getCart() {
        return this.storage.get(this.CART)
    }

    setCart(cart: any, callback) {
        this.storage.set(this.CART, cart)
            .then(callback(cart));;
    }

    setCartWithoutCallback(cart: any) {
        this.storage.set(this.CART, cart);
    }

    clearCart() {
        return this.storage.set(this.CART, this.cart)
    }

    ////////////////////////////////////////////////////////////////////////
    //////////////////////////////HTTP METHODS//////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    searchOrders(tableId, status) {
        return this.apiService.get(`/order/status/${tableId}?open=${status}`)
            .map(data => data.orders)
            .catch(this.handleError);
    }

    getOrder(idOrder): Observable<Order> {
        return this.apiService.get(`/order/${idOrder}`)
            .map(data => data.order)
            .catch(this.handleError);
    }

    getOrderOpenByTable(tableNumber): Observable<Order> {
        return this.apiService.get(`/order/status/${tableNumber}?open=Open`)
            .map(data => data.order)
            .catch(this.handleError);
    }

    postOrder(order){
        return this.apiService.post(`/order`, order)
            .map(data => data.order)
            .catch(this.handleError);
    }

    putOrder(order, orderId) {
        return this.apiService.put(`/order/`, order)
            .map(data => data.order)
            .catch(this.handleError);
    }

    updateStatus(orderId) {
        this.apiService.put(`/order/${orderId}`)
    }

    updateProductsOrder(order) {
        return this.apiService.put(`/order/products`, order)
            .map(data => data.order)
            .catch(this.handleError);
    }

    blockUsersInOrder(order) {
        return this.apiService.put(`/order/blockUsers`, order)
        .map(data => data.order)
        .catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err);
    }
}