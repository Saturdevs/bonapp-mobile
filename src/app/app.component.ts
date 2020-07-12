import { Component, ChangeDetectorRef } from '@angular/core';

import { Platform, NavController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ContextService } from 'src/shared/services/context.service';
import {
  AuthenticationService,
  NotificationType,
  Notification,
  NotificationsService,
  NotificationTypes,
  NotificationData,
  SocketIoService,
} from 'src/shared';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { type } from 'os';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Inicio',
      url: '/home',
      icon: '../../assets/nav-inicio.png'
    },
    {
      title: 'Mi Pedido',
      url: '/order',
      icon: '../../assets/nav-pedido.png'
    },
    {
      title: 'Realizar pago',
      url: '/order',
      icon: '../../assets/nav-pago.png'
    }
  ];
  isUserLoggedIn: Boolean = false;
  notificationsTypes: Array<NotificationType>;
  showQRAim: boolean = false;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private contextService: ContextService,
    private authenticationService: AuthenticationService,
    private notificationSerive: NotificationsService,
    private changeDetection: ChangeDetectorRef,
    private backgroundMode: BackgroundMode,
    private alertController: AlertController,
    private socketIOService: SocketIoService
  ) {
    this.initializeApp();
    this.contextService.getMessage().subscribe(show => {
      this.showQRAim = show;
      changeDetection.detectChanges();
    });
  }

  async removeUser() {
    let order = this.contextService.getOrder();
    let inputs = Array<any>();
    order.users.forEach((user, index) => {
      let input = {
        name: 'userRemove' + index,
        type: 'checkbox',
        label: user.username,
        value: user.username,
        checked: false
      };

      inputs.push(input);
    })


    const alert = await this.alertController.create({
      header: 'Eliminar Usuarios del Pedido',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'alertCancelButton',
          handler: () => {
            this.alertController.dismiss();
          }
        }, {
          text: 'Aceptar',
          handler: data => {
            data.forEach(userToRemove => {
              let dataToSend = {
                userName: userToRemove,
                orderId: this.contextService.getOrder()._id,
                isRemovingOtherUser: true
              };
              this.socketIOService.removeUserFromOrder(dataToSend);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  callWaiter() {
    let notification = new Notification();
    notification.createdAt = new Date();
    notification.notificationType = NotificationTypes.WaiterCall;
    notification.readBy = null;
    notification.table = this.contextService.getTableNro();
    notification.userFrom = this.contextService.getUser().username;
    notification.usersTo = [];
    notification.data = new NotificationData();
    notification.data.notificationType = NotificationTypes.WaiterCall;
    notification.actions = [];

    this.notificationSerive.send(notification)
      .subscribe(async (result) => {
        let alert = await this.alertController.create({
          header: "Listo!",
          message: "El mozo viene en camino!.",
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
      }, async (err) => {
        let alert = await this.alertController.create({
          header: "Algo salió mal!",
          message: "No se pudo llamar al mozo, intente de nuevo.",
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
      })
  }

  logout() {
    this.authenticationService.logout();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authenticationService.initializeUserInfo();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.setDefaults({ silent: true })
      this.backgroundMode.enable();

      this.authenticationService.authState.subscribe(state => {
        this.isUserLoggedIn = state;
        if (state) {
          this.navCtrl.navigateRoot('/home');

        } else {
          this.navCtrl.navigateRoot('/login');
        }
      });

      //////////////////////////////////////////////////////////////
      /**SOLO PARA PRUEBAS. ESTO DEBE HACERSE CUANDO SE LEE EL QR */
      //////////////////////////////////////////////////////////////
      // let user = new User();
      // user.lastname = 'Lischetti2';
      // user.name = 'Lorenzoo';
      // user.phone = '341560433';
      // user.username = 'imchiodo@hotmail.com';

      // let user = this.contextService.getUser();

      // this.contextService.setTableNro(6);
      // this.orderService.getOrderOpenByTable(this.contextService.getTableNro()).subscribe(
      //   order => {
      //     if (!isNullOrUndefined(order)) {
      //       let cashRegister: CashRegister = null;
      //       this.CashRegisterService.getDefaultCashRegister()
      //         .subscribe(cashRegister => {
      //           cashRegister = cashRegister;
      //         });
      //       order.cashRegister = cashRegister;
      //       let client: Client = null;
      //       this.clientService.getClientByEmail(user.username)
      //         .subscribe(client => {
      //           client = client
      //           if(!isNullOrUndefined(client)){
      //             order.users.find(x => x.username == user.username).clientId = client._id.toString();
      //           }
      //         })
      //       this.contextService.setOrder(order);
      //     }
      //   }
      // )
    });
  }
}
