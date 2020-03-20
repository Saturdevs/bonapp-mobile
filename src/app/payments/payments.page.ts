import { Component, OnInit } from '@angular/core';
import { Order, User, UserInOrder, PaymentInUserOrder, OrderService, PaymentTypes, OrderDiscount, MercadoPagoService, NotificationType, Notification } from 'src/shared';
import { ContextService } from 'src/shared/services/context.service';
import { ModalController, AlertController } from '@ionic/angular';
import { PaymentPerUserModalPage } from '../modals/payment-per-user-modal/payment-per-user-modal.page';
import { isNullOrUndefined } from 'util';
import { PaymentTypesService } from 'src/shared/services/payment-types.service';
import { PaymentType } from 'src/shared/models/payment-type';
import { MercadoPagoPage } from '../modals/mercado-pago/mercado-pago.page';
import { MercadoPagoCostumerPage } from '../modals/mercado-pago-costumer/mercado-pago-costumer.page';
import { NotificationsService } from 'src/shared/services/notifications.service';
import { NotificationTypes } from '../../shared/enums/notificationsTypes'

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})

export class PaymentsPage implements OnInit {
  pageTitle: string = 'Metodos de pago';
  order: Order;
  user: User;
  usersAmounts: Array<any> = [];
  displayProductsForEveryUser: boolean = false;
  paymentType: PaymentTypes;
  paymentTypes: Array<PaymentType>;
  notificationsTypes: Array<NotificationType>;

  constructor(private contextService: ContextService,
    private modalController: ModalController,
    private alertController: AlertController,
    private orderService: OrderService,
    private paymentTypeService: PaymentTypesService,
    private mercadoPagoService: MercadoPagoService,
    private notificationSerive: NotificationsService) { }

  ngOnInit() {
    this.order = this.contextService.getOrder();
    this.user = this.contextService.getUser();
    this.displayProductsForEveryUser = this.contextService.getDisplayProductsForEveryUser();

    this.populateUsersPayments();
    this.getPaymentTypes();
  }

  /**Muesta el componente modal para seleccionar el
   *  monto (parcial o total) a pagar por cada usuario
   */
  async showModalPayment(userAmount) {
    const currentUserInOrder = this.order.users.find(x => x.username === userAmount.username);

    let userOldPaymentsAmount = 0;

    currentUserInOrder.payments.forEach(payment => {
      userOldPaymentsAmount += payment.amount;
    });

    const modal = await this.modalController.create({
      component: PaymentPerUserModalPage,
      componentProps: {
        username: currentUserInOrder.username,
        userAmount: currentUserInOrder.totalPerUser - userOldPaymentsAmount
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    let currentUserAmount = this.usersAmounts.find(x => x.username === data.username);

    currentUserAmount.paymentAmount = data.paymentAmount;
    currentUserAmount.amount = currentUserInOrder.totalPerUser - userOldPaymentsAmount - currentUserAmount.paymentAmount;
  }

  async showModalMercadoPago(userAmount) {
    // const currentUserInOrder = this.order.users.find(x => x.username === userAmount.username);

    // let userOldPaymentsAmount = 0;

    // currentUserInOrder.payments.forEach(payment => {
    //   userOldPaymentsAmount += payment.amount;
    // });

    let email = 'andre_nolan7@yahoo.com' //cuanto tengamos el usuario lo saco de ahi

    this.mercadoPagoService.getCustomer(email)
      .subscribe(async (response) => {
        if ((response.status === 200 || response.status === 201) && response.body.results.length > 0) {
          let customer = response.body.results[0];
          const modal = await this.modalController.create({
            component: MercadoPagoCostumerPage,
            componentProps: {
              customer: customer,
              usersAmounts: this.usersAmounts
            }
          });
          await modal.present();
        } else {
          const modal = await this.modalController.create({
            component: MercadoPagoPage,
            componentProps: {
              usersAmounts: this.usersAmounts
            }
          });
          await modal.present();
        }
      })
  }

  /** Se usa para ver que productos del pedido mostrar (DEL USUARIO ACTUAL O DE TODOS) */
  changeProductsDisplay() {
    this.contextService.setDisplayProductsForEveryUser(this.displayProductsForEveryUser);
  }

  /** Valida si tiene que mostrar el usuario en el listado de usuarios y montos a pagar 
   *  para verificar eso, valida que el usuario deba ser mostrado por monto mayor a 0, que el 
   * check de mostrar todos este checkeado
   * y que el sea o no el que esta usando la app
   */
  shouldDisplayUser(user: any) {
    return user.shouldDisplay && ((this.user.username !== user.username && this.displayProductsForEveryUser)
      || this.user.username === user.username);
  }
  /**Carga el array de payments para mostrar en el frontend con los datos traidos desde el backend
   */
  populateUsersPayments() {
    this.order.users.forEach(user => {

      let totalPaymentsAmount = 0;

      user.payments.forEach(payment => {
        totalPaymentsAmount += payment.amount;
      });

      let userAmount: any = {};

      if (user.username === this.user.username) {
        userAmount.username = user.username;
        userAmount.amount = 0;
        userAmount.shouldDisplay = (user.totalPerUser - totalPaymentsAmount) === 0 ? false : true;
        userAmount.paymentAmount = user.totalPerUser - totalPaymentsAmount;
      }
      else {
        userAmount.username = user.username;
        userAmount.amount = user.totalPerUser - totalPaymentsAmount;
        userAmount.shouldDisplay = (user.totalPerUser - totalPaymentsAmount) === 0 ? false : true;
        userAmount.paymentAmount = 0;
      }

      this.usersAmounts.push(userAmount);
    })
  }

  /**Muestra un mensaje pidiendo confirmacion para enviar el pedido
   */
  async confirmPayment(isCash) {
    if (isCash) {
      this.paymentType = PaymentTypes.Efectivo;
    }
    else {
      this.paymentType = PaymentTypes.MercadoPago;
    }
    // capaz que volver a traerme la order es al pedo
    this.order = this.contextService.getOrder();
    let currentTotalPayment = 0;
    let oldPayments = 0;
    let totalPayment = this.order.totalPrice;
    this.usersAmounts.forEach(userAmount => {
      currentTotalPayment += userAmount.paymentAmount;
    });
    this.order.users.forEach(user => {
      user.payments.forEach(payment => {
        oldPayments += payment.amount;
      });
    });

    totalPayment = totalPayment - (currentTotalPayment + oldPayments);
    let alertMessage = '';
    if (totalPayment > 0) {
      alertMessage = "Estas pagando $" + currentTotalPayment.toString() + ". <br/>El pedido permanecera abierto hasta completar el pago.<br/><br/> Monto pendiente: $" + totalPayment.toString();
    }
    else {
      alertMessage = "Estas pagando $" + currentTotalPayment.toString() + ", equivalente al total del pedido. El mismo se cerrara.";
    }

    let alert = await this.alertController.create({
      header: "Enviar pago",
      message: alertMessage,
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            this.alertController.dismiss();
          },
        },
        {
          text: 'Aceptar',
          handler: data => {
            this.sendPayment();
          },
        }
      ],
    });
    await alert.present();
  }

  sendPayment() {
    this.usersAmounts.forEach(async userPayment => {
      let totalPerUser = 0;
      totalPerUser += userPayment.paymentAmount;

      if (totalPerUser > userPayment.totalPerUser || totalPerUser === 0) {
        const alertMessage = 'Estas intentando pagar un monto mayor al monto pendiente para el usuario: ' + userPayment.username;

        const alert = await this.alertController.create({
          header: 'Error',
          message: alertMessage,
          buttons: [
            {
              text: 'OK',
              handler: data => {
                this.alertController.dismiss();
              },
            }
          ],
        });
        await alert.present();
      } else {
        this.blockUsersInOrder();
      }
    });
  }

  blockUsersInOrder() {
    this.usersAmounts.forEach(userAmount => {
      let currentUserInOrder = this.order.users.find(x => (x.username === userAmount.username) && userAmount.paymentAmount > 0);
      if (!isNullOrUndefined(currentUserInOrder)) {
        currentUserInOrder.blocked = true;
      }
    });

    this.orderService.blockUsersInOrder(this.order)
      .subscribe(updatedOrder => {
        this.makePayment(updatedOrder);
      });
  }

  getPaymentTypes() {
    this.paymentTypeService.getAvailables()
      .subscribe(types => {
        this.paymentTypes = types;
      })
  }

  makePayment(order: Order) {
    this.usersAmounts.forEach(userAmount => {
      let currentUserInOrderWithPayments = order.users.find(x => (x.username === userAmount.username) && (x.blocked === true) && (userAmount.paymentAmount > 0));

      if (!isNullOrUndefined(currentUserInOrderWithPayments)) {
        let currentPayment = new PaymentInUserOrder();
        currentPayment.amount = userAmount.paymentAmount;

        let currentPaymentType = this.paymentTypes.find(x => x.name === this.paymentType);
        currentPayment.methodId = currentPaymentType._id;

        currentUserInOrderWithPayments.payments.push(currentPayment);
      };
    });

    let discount = new OrderDiscount()
    discount.discountAmount = 0;
    discount.discountRate = 0;
    discount.subtotal = 0;

    order.discount = discount;

    this.orderService.putOrder(order, order._id)
      .subscribe(updatedOrder => {
        this.notificationSerive.getAllTypes()
          .subscribe(notificationsTypes => {
            this.notificationsTypes = notificationsTypes;

            let currentNotificationType = this.notificationsTypes.find(x => x.type == NotificationTypes.NewOrder);
            let notification = new Notification();
            notification.createdAt = new Date();
            notification.notificationType = currentNotificationType;
            notification.readBy = null;
            notification.table = this.contextService.getTableNro();
            notification.userFrom = this.contextService.getUser()._id;
            notification.usersTo = [];

            this.notificationSerive.send(notification)
              .subscribe(result => {
                this.contextService.setOrder(updatedOrder);
                this.order = this.contextService.getOrder();

                this.order.users.forEach(user => {
                  let totalPayments = 0;
                  user.payments.forEach(payment => {
                    totalPayments += payment.amount;
                  });

                  let currentUserAmount = this.usersAmounts.find(x => x.username === user.username);

                  currentUserAmount.paymentAmount = 0;

                });
              });
          });
      });
  }
}