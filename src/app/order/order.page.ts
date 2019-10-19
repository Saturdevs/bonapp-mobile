import { Component, OnInit } from '@angular/core';
import { Order, OrderService, ProductInUserOrder } from 'src/shared';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { ContextService } from 'src/shared/services/context.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.page.html',
    styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
    pageTitle: string = "Pedido";
    public cart = {
        products: [],
        total: 0
    };
    order: Order;

    constructor(private _route: ActivatedRoute,
        private orderService: OrderService,
        private contextService: ContextService) { }

    ngOnInit(): void {
        //TODO: cuando se lee el codigo qr se debe verificar si ya hay un pedido abierto para esa mesa.
        //Si lo hay se debe almacenar en una variable de un service (puede ser order.service o crear uno nuevo
        //x ejemplo context.service donde se guarden todas las variables necesarias para el sistema, como x 
        //el pedido, numero de mesa, usuario, etc). Si no hay un pedido abierto setear dicha variable en null.
        //Por ahora la variable order es null para poder seguir con el desarrollo y pruebas.
        this.order = this.contextService.getOrder();
        this.cart = this._route.snapshot.data['cart'];
    }

    removeProduct(index) {
        let product = new ProductInUserOrder();
        product = this.cart.products[index];
        this.cart.products.splice(index, 1);
        this.orderService.updateTotalPrice(this.cart, product.price, -product.quantity);
        this.orderService.setCartWithoutCallback(this.cart);
    }

    async confirmOrder() {
        if (!isNullOrUndefined(this.order)) {
            console.log(this.cart);
            console.log(this.order);
            /* this.orderService.updateProductsOrder(this.order).subscribe(
                orderReturned => {
                    this.navCtrl.navigateForward("/menu");
                },
                async error => {
                    let alert = await this.alertController.create({
                        header: "Se produjo un error!",
                        message: "Se produjo un error al intentar confirmar el pedido. \n Intente nuevamente.",
                        buttons: [
                            {
                                text: 'Aceptar',
                                handler: data => {
                                    this.alertController.dismiss();
                                },
                            }
                        ],
                    });
                    await alert.present();
                }
            ) */
        }
    }
}