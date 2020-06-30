import { Component, OnInit } from '@angular/core';
import { Order, User, UserInOrder, PaymentInUserOrder, OrderService, PaymentTypes, OrderDiscount, MercadoPagoService, NotificationType, Notification, AuthenticationService, Client, Transaction, PaymentTypeMin, OpenOrderForUser, UserService, CashRegisterService, SocketIoService, NotificationData } from 'src/shared';
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
import { ClientService } from 'src/shared/services/client.service';
import { TransactionService } from 'src/shared/services/transaction.service';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
const USER_INFO = "USER_INFO";

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
  paymentTypesEnum = PaymentTypes;
  notificationsTypes: Array<NotificationType>;
  currentUser: any;
  client: Client;
  canPayWithAccount: boolean = false;
  canPayWithCurrentAccount: boolean = true;
  sendToHomePage: boolean = false;

  constructor(private contextService: ContextService,
    private modalController: ModalController,
    private alertController: AlertController,
    private orderService: OrderService,
    private paymentTypeService: PaymentTypesService,
    private mercadoPagoService: MercadoPagoService,
    private notificationSerive: NotificationsService,
    private authService: AuthenticationService,
    private clientService: ClientService,
    private transactionService: TransactionService,
    private userService: UserService,
    private cashRegisterService: CashRegisterService,
    private router: Router,
    private socketIoService: SocketIoService,
    private nativeStorage: NativeStorage,
    private notiicationService : NotificationsService) { }

  ngOnInit() {
    this.order = this.contextService.getOrder();
    this.user = this.contextService.getUser();
    this.displayProductsForEveryUser = this.contextService.getDisplayProductsForEveryUser();

    this.populateUsersPayments();
    this.getPaymentTypes();

    this.getCurrentUser();
    this.checkClientAccount();
  }

  async getCurrentUser() {
    this.currentUser = await this.authService.getCurrentUser();
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

  /**Verifica si el metodo de pago es CuentaCorriente y el saldo disponible */
  checkAccount(currentTotalPayment): boolean {
    return this.client.balance - currentTotalPayment >= (this.client.limitCtaCte * -1);
  }

  /**Muestra un mensaje pidiendo confirmacion para enviar el pedido
   */
  async confirmPayment(paymentType) {
    // this.paymentType = paymentType;

    // // capaz que volver a traerme la order es al pedo
    this.order = this.contextService.getOrder();
    // let currentTotalPayment = 0;
    // let oldPayments = 0;
    // let totalPayment = this.order.totalPrice;
    // this.usersAmounts.forEach(userAmount => {
    //   currentTotalPayment += userAmount.paymentAmount;
    // });
    // this.order.users.forEach(user => {
    //   user.payments.forEach(payment => {
    //     oldPayments += payment.amount;
    //   });
    // });

    // totalPayment = totalPayment - (currentTotalPayment + oldPayments);
    // let alertMessage = '';

    // if (this.paymentType == PaymentTypes.CuentaCorriente && this.canPayWithAccount && !this.checkAccount(currentTotalPayment)) {
    //   alertMessage = "El monto que estas intentando pagar con Cuenta Corriente sumado al saldo actual, supera el limite para esta cuenta.";
    //   let alert = await this.alertController.create({
    //     header: "Enviar pago",
    //     message: alertMessage,
    //     buttons: [
    //       {
    //         text: 'OK',
    //         handler: data => {
    //           this.alertController.dismiss();
    //         },
    //       }
    //     ],
    //   });
    //   await alert.present();
    //   return;
    // }

    // if (totalPayment > 0) {
    //   alertMessage = "Estas pagando $" + currentTotalPayment.toString() + ". <br/>El pedido permanecera abierto hasta completar el pago.<br/><br/> Monto pendiente: $" + totalPayment.toString();
    // }
    // else {
    //   alertMessage = "Estas pagando $" + currentTotalPayment.toString() + ", equivalente al total del pedido. El mismo se cerrara.";
    //   this.order.completed_at = new Date();
    //   this.order.status = "Closed";
    // }

    // NOTIFICACION PARA PAGO NUEVO! 
    let notification = new Notification()
    notification.createdAt = new Date();
    notification.notificationType = NotificationTypes.NewPayment;
    notification.table =  this.contextService.getTableNro();
    notification.userFrom = this.contextService.getUser().username;
    notification.usersTo = [];
    notification.readBy = null;
    notification.data = new NotificationData();
    notification.data.notificationType = NotificationTypes.NewOrder;
    notification.data.orderId = this.order._id;
    notification.data.username = this.contextService.getUser().username;
    notification.actions = [];

    this.notiicationService.send(notification)
      .subscribe(async (notificationSent) => {
        console.log(notificationSent);
        let alertMessage = "El mozo vendra en un momento con la cuenta! "
    
        let alert = await this.alertController.create({
          header: "Enviar pago",
          message: alertMessage,
          buttons: [
            // {
            //   text: 'Cancelar',
            //   handler: data => {
            //     this.alertController.dismiss();
            //   },
            // },
            {
              text: 'Aceptar',
              handler: data => {
                // this.sendPayment();
                this.modalController.dismiss();
              },
            }
          ],
        });
        await alert.present();
    });


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

  checkClientAccount() {
    let isClient = this.order.users.find(x => x.username == this.contextService.getUser().username).clientId;
    if (!isNullOrUndefined(isClient)) {
      this.clientService.getClient(isClient)
        .subscribe((client: Client) => {
          this.client = client;
          if (this.client.enabledTransactions) {
            this.canPayWithAccount = true;
          }
        })
    }
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

    this.cashRegisterService.getDefaultCashRegister()
      .subscribe(cashRegisters => {

        order.cashRegister = cashRegisters.find(x => x.default === true);

        this.orderService.putOrder(order, order._id)
          .subscribe((updatedOrder: Order) => {

            if (this.paymentType == PaymentTypes.CuentaCorriente) {
              let transaction = new Transaction();
              let amount = this.usersAmounts.reduce((acc, curr) => acc + curr.paymentAmount, 0);
              let paymentTypeMin = new PaymentTypeMin();
              paymentTypeMin._id = this.paymentTypes.find(x => x.name === this.paymentType)._id;
              paymentTypeMin.name = this.paymentType;

              transaction.amount = amount;
              transaction.cashRegister = order.cashRegister;
              transaction.client = this.client;
              transaction.comment = "New Payment on APP";
              transaction.date = new Date();
              transaction.deleted = false;
              transaction.paymentMethod = paymentTypeMin;
              transaction.paymentType = this.paymentTypes.find(x => x.name === this.paymentType)._id;

              this.transactionService.saveTransaction(transaction)
                .subscribe(result => {
                  console.log(result);
                });
            }
            updatedOrder.users.forEach((userInOrder: UserInOrder) => {
              let alreadyPayedByUser = userInOrder.payments.reduce((acc, curr) => acc + curr.amount, 0);

              if (userInOrder.totalPerUser === alreadyPayedByUser) {
                let data = {
                  userName: userInOrder.username,
                  orderId: updatedOrder._id
                }

                this.socketIoService.removeUserFromOrder(data);


                // this.sendToHomePage = false;
                // this.authService.getUserByEmail(userInOrder.username)
                //   .subscribe(user => {
                //     if (!isNullOrUndefined(user.openOrder) && JSON.stringify(user.openOrder) !== '{}') {
                //       user.openOrder = null;
                //       this.userService.deleteOpenOrder(user._id)
                //         .subscribe(userWithoutOpenOrder => {
                //           this.nativeStorage.setItem(USER_INFO, JSON.stringify(userWithoutOpenOrder)).then(async (res) => {
                //             this.contextService.setUser(userWithoutOpenOrder);
                //             this.router.navigate(['home']);
                //           });
                //         })
                //     };
                //   });
              }
            });

            if(updatedOrder.status === "Closed"){
              this.socketIoService.updateTableStatus();
            }
            if(this.sendToHomePage){
              this.router.navigate(['home']);
            }
            // this.notificationSerive.getAllTypes()
            //   .subscribe(notificationsTypes => {
            //     this.notificationsTypes = notificationsTypes;

            //     let currentNotificationType = this.notificationsTypes.find(x => x._id == NotificationTypes.NewOrder);
            //     let notification = new Notification();
            //     notification.createdAt = new Date();
            //     notification.notificationType = currentNotificationType;
            //     notification.readBy = null;
            //     notification.table = this.contextService.getTableNro();
            //     notification.userFrom = this.contextService.getUser()._id;
            //     notification.usersTo = [];

            //     this.notificationSerive.send(notification)
            //       .subscribe(result => {
            //         this.contextService.setOrder(updatedOrder);
            //         this.order = this.contextService.getOrder();

            //         this.order.users.forEach(user => {
            //           let totalPayments = 0;
            //           user.payments.forEach(payment => {
            //             totalPayments += payment.amount;
            //           });

            //           let currentUserAmount = this.usersAmounts.find(x => x.username === user.username);

            //           currentUserAmount.paymentAmount = 0;

            //         });
            //       });
            //   });
          });
      });
  }
}