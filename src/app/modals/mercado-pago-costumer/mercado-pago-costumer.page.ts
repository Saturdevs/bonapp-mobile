import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, NavController, LoadingController } from '@ionic/angular';
import { MercadoPagoPage } from '../mercado-pago/mercado-pago.page';
import { Validators, FormBuilder, FormControl } from '@angular/forms';
import { MercadoPagoService, Order, OrderService, PaymentInUserOrder, PaymentTypes, OrderDiscount, MercadoPagoPayment } from 'src/shared';
import { ContextService } from 'src/shared/services/context.service';
import { isNullOrUndefined } from 'util';
import { PaymentType } from 'src/shared/models/payment-type';
import { PaymentTypesService } from 'src/shared/services/payment-types.service';

@Component({
  selector: 'app-mercado-pago-costumer',
  templateUrl: './mercado-pago-costumer.page.html',
  styleUrls: ['./mercado-pago-costumer.page.scss'],
})
export class MercadoPagoCostumerPage implements OnInit {
  payForm = this.fb.group({
    email: ['andre_nolan@yahoo.com', Validators.required],
    cardNumber: ['', Validators.required],
    securityCode: ['', Validators.required],
    cardExpirationMonth: ['', Validators.required],
    cardExpirationYear: ['', Validators.required],
    cardholderName: ['', Validators.required],
    docType: ['', Validators.required],
    docNumber: ['', Validators.required],
    paymentMethodId: ['', Validators.required]
  });
  @Input('customer') customer: any;
  @Input('usersAmounts') usersAmounts: any;
  pageTitle = 'Tus tarjetas'
  cards : Array<any>
  terminadaText = "Terminada en"
  securityCode: any;
  cardNumber: any;
  loading: HTMLIonLoadingElement;
  order: Order;
  paymentTypes: Array<PaymentType> = [];

  constructor(private modalController: ModalController,
              private alertController: AlertController,
              private fb: FormBuilder,
              private mercadoPagoService: MercadoPagoService,
              private navCtrl: NavController,
              public loadingController: LoadingController,
              private contextService: ContextService,
              private orderService: OrderService,
              private paymentTypesService : PaymentTypesService) { }

  ngOnInit() {
    console.log(this.customer);
    console.log(this.usersAmounts);
    this.cards = this.customer.cards;
    this.order = this.contextService.getOrder();
    this.paymentTypesService.getAvailables()
      .subscribe(paymentTypes => {
        this.paymentTypes = paymentTypes;
      })
  }

  async doPaymentWithNewCard(){
    const modal = await this.modalController.create({
      component: MercadoPagoPage,
      componentProps: {
        username: 'llischetti',
        amount: 152
      }
    });
    await modal.present();
  }

  async showSecurityCode(card){
    const alert = await this.alertController.create({
      header: 'Por su seguridad, vuelva  a ingresar los datos',
      inputs: [
        {
          name: 'cardNumber',
          placeholder: 'Numero de tarjeta',
          type: 'number',
          min: 0,
          max: 9999999999999999
        },
        {
          name: 'securityCode',
          placeholder: 'Codigo de Seguridad',
          type: 'number',
          min: 0,
          max: 999
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.alertController.dismiss();
          }
        }, {
          text: 'Pagar',
          handler: (alertData) => {
            this.doPaymentWithExistingCard(card, alertData.cardNumber, alertData.securityCode)
          }
        }
      ]
    });
    await alert.present();
  }

  async doPaymentWithExistingCard(card, cardNumber, securityCode){        
    this.payForm.controls.email.setValue('andre_nolan7@yahoo.com');
    this.payForm.controls.cardNumber.setValue(cardNumber);
    this.payForm.controls.securityCode.setValue(securityCode);
    this.payForm.controls.cardExpirationMonth.setValue(card.expiration_month);
    this.payForm.controls.cardExpirationYear.setValue(card.expiration_year);
    this.payForm.controls.cardholderName.setValue(card.cardholder.name);
    this.payForm.controls.docType.setValue(card.cardholder.identification.type);
    this.payForm.controls.docNumber.setValue(card.cardholder.identification.number)
    this.payForm.controls.paymentMethodId.setValue(card.payment_method.id)


    let cardTokenRequest = Object.assign({}, this.payForm.value)

    this.loading = await this.loadingController.create({
      message: 'Procesando pago. Por favor espere.'
    })
    await this.loading.present();
    // The function "sdkResponseHandler" is defined below
    // @ts-ignore Se usa para que VS CODE no tire el error de que no encuentra Mercadopago en window
    window.Mercadopago.createToken(cardTokenRequest, this.sdkResponseHandler.bind(this));
    return false;
  }

  sdkResponseHandler(status, response){
    this.payForm.addControl('token', new FormControl(response.id, Validators.required));
    this.payForm.addControl('customerId', new FormControl(this.customer.id, Validators.required));
    this.blockUsersInOrder(); //bloquea los usuarios
  }
  
  postPayment(order : Order, totalPayment : number) {
    console.log('asd');
    const p = Object.assign({}, this.payForm.value);
    let request = new MercadoPagoPayment();
    request.order = order;
    request.paymentAmount = totalPayment;
    request.payment = p;
    request.unblockUsers = true;
    console.log(request);
    
    this.mercadoPagoService.postCustomerPayment(request)
      .subscribe(async (resp) => {
        await this.loading.dismiss();
        // await this.loading.dismiss();
        console.log(resp);
        this.contextService.setOrder(resp.order)
        let alert = await this.alertController.create({
          header: "Listo!",
          message: "Tu pago fue procesado correctamente!",
          buttons: [
            {
              text: 'OK!',
              handler: data => {
                this.navCtrl.navigateRoot("/");
              },
            }
          ],
        });
        await alert.present();
      }, async (error) => {
        console.log(error);
        await this.loading.dismiss();
      });
  }

  blockUsersInOrder(){
    this.usersAmounts.forEach(userAmount => {  
      let currentUserInOrder = this.order.users.find(x => (x.username === userAmount.username) && userAmount.paymentAmount > 0);
      if(!isNullOrUndefined(currentUserInOrder)){
        currentUserInOrder.blocked = true;
      }
    });

    this.orderService.blockUsersInOrder(this.order)
      .subscribe(updatedOrder => {
        console.log('a');
        return this.prepareOrder(updatedOrder); //prepara la orden para pasarla al backend
      });
  }

  prepareOrder(order : Order){
    let totalPayment = 0;
    this.usersAmounts.forEach(userAmount => {
      totalPayment += userAmount.paymentAmount;
      let currentUserInOrderWithPayments = order.users.find(x => (x.username === userAmount.username) && (x.blocked === true) && (userAmount.paymentAmount > 0));
      
      if(!isNullOrUndefined(currentUserInOrderWithPayments)){
        let currentPayment = new PaymentInUserOrder();
        currentPayment.amount = userAmount.paymentAmount;
        
        let currentPaymentType = this.paymentTypes.find(x => x.name === PaymentTypes.MercadoPago);
        currentPayment.methodId = currentPaymentType._id;

        currentUserInOrderWithPayments.payments.push(currentPayment);
      };
    });

    let discount = new OrderDiscount()
    discount.discountAmount = 0;
    discount.discountRate = 0;
    discount.subtotal = 0;

    order.discount = discount;
    
    this.postPayment(order,totalPayment);
  }
}
