import { Component, OnInit } from '@angular/core';
import { Order, OrderService, ProductInUserOrder, OrderDiscount, CashRegister, User, UserInOrder, UserService, ProductService, Product, NotificationsService, Notification, NotificationTypes, NotificationData } from 'src/shared';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { ContextService } from 'src/shared/services/context.service';
import { NavController, AlertController } from '@ionic/angular';
import { DailyMenuService } from 'src/shared/services/daily-menu.service';

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
    user: User;
    displayProductsForEveryUser: boolean = false;
    usersToDisplayProducts: Array<UserInOrder> = [];

    constructor(private _route: ActivatedRoute,
        private orderService: OrderService,
        private productService: ProductService,
        private navCtrl: NavController,
        private alertController: AlertController,
        private contextService: ContextService,
        private userService: UserService,
        private dailyMenuService: DailyMenuService,
        private notiicationService: NotificationsService) { }

    ngOnInit(): void {
        //TODO: cuando se lee el codigo qr se debe verificar si ya hay un pedido abierto para esa mesa.
        //Si lo hay se debe almacenar en una variable de un service (puede ser order.service o crear uno nuevo
        //x ejemplo context.service donde se guarden todas las variables necesarias para el sistema, como x
        //el pedido, numero de mesa, usuario, etc). Si no hay un pedido abierto setear dicha variable en null.
        //Por ahora la variable order es null para poder seguir con el desarrollo y pruebas.
        this.order = this.contextService.getOrder();
        this.user = this.contextService.getUser();
        this.cart = this._route.snapshot.data['cart'];
        this.displayProductsForEveryUser = this.contextService.getDisplayProductsForEveryUser();
        let userToDisplay = this.order.users.find(x => x.username === this.user.username);
        if (!isNullOrUndefined(userToDisplay)) {
            this.usersToDisplayProducts.push(userToDisplay);
        };
    }

    /** Se usa para ver que productos del pedido mostrar (DEL USUARIO ACTUAL O DE TODOS) */
    changeProductsDisplay() {
        let usersToDisplayProducts: Array<UserInOrder> = [];

        if (this.displayProductsForEveryUser === true) {
            this.order.users.forEach(user => {
                usersToDisplayProducts.push(user)
            });
        }
        else {
            usersToDisplayProducts.push(this.order.users.find(x => x.username == this.user.username));
        }

        this.contextService.setDisplayProductsForEveryUser(this.displayProductsForEveryUser);
        this.usersToDisplayProducts = usersToDisplayProducts;
    }

    /**Se usa para eliminar un producto del carrito */
    removeProduct(index) {
        let product = new ProductInUserOrder();
        product = this.cart.products[index];
        this.cart.products.splice(index, 1);
        this.orderService.updateTotalPrice(this.cart, product.price, -product.quantity);


        if (!isNullOrUndefined(product.product)) {
            this.productService.getProduct(product.product)
                .subscribe((prod: Product) => {
                    if (prod.stockControl) {
                        prod.stock.current++;
                        this.productService.updateProduct(prod)
                            .subscribe(resp => {
                                console.log(resp);
                            })
                    }
                });
        }
        else {
            if (!isNullOrUndefined(product.dailyMenuId)) {
                this.dailyMenuService.getDailyMenu(product.dailyMenuId)
                    .subscribe(dailyMenu => {
                        dailyMenu.products.forEach(productId => {
                            this.productService.getProduct(productId)
                                .subscribe((product: Product) => {
                                    if (product.stockControl) {
                                        product.stock.current++;
                                        this.productService.updateProduct(product)
                                            .subscribe(resp => {
                                                console.log(resp);
                                            });
                                    }
                                });
                        });
                    });

            }
        }
        this.orderService.setCartWithoutCallback(this.cart);
    }

    /** Reduce de a 1 la cantidad del producto en el carrito, si la cantidad es 1 lo elimina */
    minusQty(product: ProductInUserOrder) {
        if (product.quantity !== 1) {
            product.quantity--;
            this.orderService.updateTotalPrice(this.cart, product.price, -1);
            this.orderService.setCartWithoutCallback(this.cart)
        }
        else {
            let index = this.cart.products.indexOf(product);
            this.removeProduct(index);
        }
    }

    /** Aumenta de a 1 la cantidad del producto en el carrito */
    plusQty(product: ProductInUserOrder) {
        product.quantity++;
        this.orderService.updateTotalPrice(this.cart, product.price, 1);
        this.orderService.setCartWithoutCallback(this.cart)
    }

    async confirmOrder() {
        if (!isNullOrUndefined(this.order)) {
            let data = { products: this.cart.products, total: this.cart.total, username: this.user.username, order: this.order };
            this.orderService.updateProductsOrder(data).subscribe(
                async (orderReturned: Order) => {
                    this.orderService.clearCart();
                    this.contextService.setOrder(orderReturned);

                    // NOTIFICACION PARA PEDIDO NUEVO! 
                    let notification = new Notification()
                    notification.createdAt = new Date();
                    notification.notificationType = NotificationTypes.NewOrder;
                    notification.table =  this.contextService.getTableNro();
                    notification.userFrom = this.contextService.getUser().username;
                    notification.usersTo = [];
                    notification.readBy = null;
                    notification.data = new NotificationData();
                    notification.data.notificationType = NotificationTypes.NewOrder;
                    notification.data.orderId = orderReturned._id;
                    notification.data.username = this.contextService.getUser().username;
                    notification.actions = [];

                    this.notiicationService.send(notification)
                      .subscribe(notificationSent => {
                        console.log(notificationSent);
                    });

                    let alert = await this.alertController.create({
                        header: "Listo!",
                        message: "Tu pedido se envio correctamente.",
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
                    this.navCtrl.navigateRoot("/");
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
            )
        }
    }

    /** Para pasar a la pagina que muestra los metodos de pago */
    showPaymentPage() {
        this.navCtrl.navigateForward('/payments');
    }

    /** Para obtener los avatares de los usuarios o el avatar de las iniciales de las letras en su defecto. Aun no funciona */
    getUserAvatar(user) {
        this.userService.getAvatar(user).subscribe(avatar => {
            return avatar;
        })
    }
}