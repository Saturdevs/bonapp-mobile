import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MercadoPagoService, OrderService, OrderDiscount, PaymentInUserOrder, Order, PaymentTypes, MercadoPagoPayment } from 'src/shared';
import { isNullOrUndefined } from 'util';
import { customerAndCard } from 'src/shared/models/customerAndCard';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { Logs } from 'selenium-webdriver';
import { DataService } from 'src/shared/services/data.service';
import { ContextService } from 'src/shared/services/context.service';
import { PaymentType } from 'src/shared/models/payment-type';

@Component({
  selector: "app-mercado-pago",
  templateUrl: "./mercado-pago.page.html",
  styleUrls: ["./mercado-pago.page.scss"]
})
export class MercadoPagoPage implements OnInit {
  payForm = this.fb.group({
    email: ['andre_nolan@yahoo.com', Validators.required],
    cardNumber: ['', Validators.required],
    securityCode: ['', Validators.required],
    cardExpirationMonth: ['', Validators.required],
    cardExpirationYear: ['', Validators.required],
    cardholderName: ['', Validators.required],
    docType: ['', Validators.required],
    docNumber: ['', Validators.required],
    paymentMethodId: ['', Validators.required],
    saveCard: [false, Validators.required]
  });
  @Input('usersAmounts') usersAmounts: any;
  documentTypes: any;
  paymentMethod: any;
  issuers: any;
  loading: HTMLIonLoadingElement;
  order: Order;
  paymentTypes: Array<PaymentType>;

  constructor(private fb: FormBuilder,
    private mercadoPagoService: MercadoPagoService,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController,
    private contextService: ContextService,
    private orderService: OrderService) { }

  ngOnInit() {
    // @ts-ignore Se usa para que VS CODE no tire el error de que no encuentra Mercadopago en window
    window.Mercadopago.getIdentificationTypes(this.identificationHandler.bind(this));
  }

  identificationHandler(status, response) {
    this.documentTypes = response
    console.log(response);
  }
  /** Devuelve los primeros 6 digitos de la tarjeta de credito, para poder obtener el metodo de pago */
  getBin() {
    return this.payForm.get('cardNumber').value.substring(0, 6);
  }

  /** Obtiene el metodo de pago a partir del numero de tarjeta de credito */
  guessingPaymentMethod(event) {
    const bin = this.getBin();
    if (bin.length >= 6) {
      // @ts-ignore Se usa para que VS CODE no tire el error de que no encuentra Mercadopago en window
      window.Mercadopago.getPaymentMethod(
        {
          bin: bin
        },
        this.setPaymentMethodInfo.bind(this)
      );
    }
  }

  /** Setter del paymentMethod basado en la respuesta del SDK de MP. Sirve como callback para la funcion del SDK getPaymentMethod */
  setPaymentMethodInfo(status, response) {
    if (status === 200) {
      this.paymentMethod = response[0];
      this.payForm.get('paymentMethodId').setValue(this.paymentMethod.id);
      if (this.issuerRequired()) {
        // @ts-ignore Se usa para que VS CODE no tire el error de que no encuentra Mercadopago en window      
        window.Mercadopago.getIssuers(this.paymentMethod.id, this.issuersHandler.bind(this));
      }
    } else {
      console.log(`payment method info error: ${response}`);
    }
  }

  /** Valida si se requiere el emisor de la tarjeta de credito */
  issuerRequired() {
    if (!isNullOrUndefined(this.paymentMethod)) {
      return this.paymentMethod.additional_info_needed.filter(x => x === 'issuer_id').length > 0
    } else {
      return false
    }
  }

  issuersHandler(status, response) {
    if (status === 200) {
      console.log(response);

      this.issuers = response
      // this.payForm.addControl('issuerId', new FormControl(response.id, Validators.required));
    } else {
      console.log(`issuer info error: ${response}`);
    }
  }
  /** Crea el token de tarjeta de credito en base a la informacion del formulario y
   *  llama al Callback Method sdkResponseHandler para settear el valor del token
   */
  doPay() {
    // Esto lo hago asi pq a el SDK de MercadoPago le tengo que mandar el Form en ese formato.
    // Tal vez pueda hacerlo con un viewchild para que quede mas piola. Probe y no funcionaba.

    let cardTokenRequest = Object.assign({}, this.payForm.value);

    // The function "sdkResponseHandler" is defined below
    // @ts-ignore Se usa para que VS CODE no tire el error de que no encuentra Mercadopago en window
    window.Mercadopago.createToken(cardTokenRequest, this.sdkResponseHandler.bind(this));
    return false;
  }

  /** Callback method del metodo del SKD createToken.
   *  Setea el valor del token en el form para enviarlo al backend o bien muestra un error indicando cual es el dato incorrecto.
   *  @param status HTTP Status Code - 200 o 201 correcto, otros incorrectos
   *  @param response Detalle de la respuesta. Si fallo, muestra cuales campos son incorrectos.
   */
  async sdkResponseHandler(status, response) {
    if (status !== 200 && status !== 201) {
      console.log('verify filled data', response);
    } else {
      this.payForm.addControl('token', new FormControl(response.id, Validators.required));

      let customerAndCardReq = new customerAndCard();
      customerAndCardReq.email = this.payForm.controls.email.value;
      customerAndCardReq.token = this.payForm.controls.token.value;
      this.loading = await this.loadingController.create({
        message: 'Procesando pago. Por favor espere.'
      })

      if (this.payForm.controls.saveCard) {  //Si hizo click en el check de guardar tarjeta
        await this.loading.present();
        this.mercadoPagoService.getCustomer(this.payForm.controls.email.value) //me fijo si el cliente ya es costumer (por si viene de la pantalla de MercadoPagoCostumer)
          .subscribe(response => {
            if ((response.status === 200 || response.status === 201) && response.body.results.length > 0) {
              let customer = response.body.results[0];
              let cardRequest = new customerAndCard();

              cardRequest.token = this.payForm.controls.token.value;
              cardRequest.customerId = customer.id;

              this.mercadoPagoService.saveCustomerCard(cardRequest) //guardo la nueva tarjeta cargada
                .subscribe(response => {
                  if (response.status === 201 || response.status === 200) {
                    this.blockUsersInOrder(); //hago el pago con la nueva tarjeta
                  }
                })
            } else { //si no es costumer pero igualmente quiere guardar la tarjeta, tnego que crear costumer and card
              this.mercadoPagoService.createCustomerAndCard(customerAndCardReq) //creo costumer and card
                .subscribe(response => {
                  if (response.status === 201 || response.status === 200) {
                    this.blockUsersInOrder(); //hago el pago con la nueva tarjeta guardada
                  }
                });
            }
          });
      } else {
        await this.loading.present();
        this.blockUsersInOrder();
      }
    }
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
        return this.prepareOrder(updatedOrder); //prepara la orden para pasarla al backend
      });
  }

  prepareOrder(order: Order) {
    let totalPayment = 0;
    this.usersAmounts.forEach(userAmount => {
      totalPayment += userAmount.paymentAmount;
      let currentUserInOrderWithPayments = order.users.find(x => (x.username === userAmount.username) && (x.blocked === true) && (userAmount.paymentAmount > 0));

      if (!isNullOrUndefined(currentUserInOrderWithPayments)) {
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

    this.postPayment(order, totalPayment);
  }

  postPayment(order: Order, totalPayment: number) {
    const p = Object.assign({}, this.payForm.value);
    let request = new MercadoPagoPayment();
    request.order = order;
    request.paymentAmount = totalPayment;
    request.payment = p;
    request.unblockUsers = true;
    this.mercadoPagoService.postPayment(request)
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
                this.navCtrl.navigateForward("/");
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
}
