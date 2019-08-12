import { ApiService } from './api.service';
import { Injectable } from "@angular/core";
import { Storage, IonicStorageModule } from "@ionic/storage";
import { Observable } from "rxjs/Rx";
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class OrderService {
    order = {
        products: [],
        total: 0
    };


    constructor(public storage: Storage,
        private apiService: ApiService) { }

    getAll() {
        return this.storage.get('order')
    }

    addProduct(product, qty, callback) {
        let storage = this.storage;

        storage.get('order').then(order => {
            if (!order) {
                order = this.order;
            }

            let record = {
                _id: product._id,
                name: product.name,
                price: product.price,
                options: [],
                size: product.size ? product.sizes[product.size] : null,
                quantity: parseInt(qty),
                subtotal: 0
            };

            record.subtotal = parseFloat(record.size ? record.size.price : record.price);

            if (product.options) {
                for (let i = 0; i < product.options.length; i++) {
                    if (product.options[i].checked) {
                        record.options.push(product.options[i]);
                        record.subtotal += parseFloat(record.options[i].price)
                    }
                }
            }

            let productIndex = -1;
            for (let i = 0; i < order.products.length; i++) {
                let product = order.products[i];
                if ((product._id == record._id) &&
                    (product.size == record.size) &&
                    (JSON.stringify(product.options) == JSON.stringify(record.options))) {
                    productIndex = i;
                }
            }

            if (productIndex == -1) {
                order.products.push(record);
            } else {
                order.products[productIndex].quantity += record.quantity;
                order.products[productIndex].subtotal += record.subtotal;
            }

            order.total = this.calculateTotalPrice(order.products);

            storage.set('order', order)
                .then(callback(order));
        });
    }

    removeProduct(order, index) {
        order.products.splice(index, 1);
        order.total = this.calculateTotalPrice(order.products);
        this.storage.set('order', order);
    }

    changeQty(order) {
        order.total = this.calculateTotalPrice(order.products);
        this.storage.set('order', order);
    }

    calculateTotalPrice(products) {
        let total = 0;
        let subtotal = 0;

        products.forEach(product => {
            subtotal = product.subtotal * product.quantity;
            total += subtotal;
        });
        return total.toFixed(2);
    }

    clearCart() {
        return this.storage.set('order', this.order)
    }

    searchOrders(tableId, status) {
        return this.apiService.get(`/order/status/${tableId}?open=${status}`)
            .map(data => data.orders);
    }

    postOrder(order) {
        this.apiService.post(`/order/${order}`)
    }

    putOrder(order, orderId) {
        this.apiService.put(`/order/${orderId}`, order)
    }

    updateStatus(orderId) {
        this.apiService.put(`/order/${orderId}`)
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err);
    }
}