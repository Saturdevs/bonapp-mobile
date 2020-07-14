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
  UserService,
  Order,
  OrderService,
} from 'src/shared';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { isNullOrUndefined } from 'util';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router } from '@angular/router';
const USER_INFO = "USER_INFO";

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
  socket: any;

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
    private socketIOService: SocketIoService,
    private notificationService: NotificationsService,
    private authService: AuthenticationService,
    private userService: UserService,
    private nativeStorage: NativeStorage,
    private router: Router,
    private orderService: OrderService
  ) {
    this.initializeApp();
    this.contextService.getMessage().subscribe(show => {
      this.showQRAim = show;
      changeDetection.detectChanges();
    });

    this.socket = this.socketIOService.getSocket();
    this.socket.on('orderAccepted', orderAccepted => { //escucha el metodo de actualizar las mesas
      this.notificationService.sendLocalNotification("Su pedido fue aceptado!");
    });

    this.socket.on('userRemovedFromOrder', userRemovedFromOrderData => { //escucha el metodo de eliminar usuarios de la orden
      this.authService.getUserByEmail(userRemovedFromOrderData.username)
        .subscribe(user => {
          if (!isNullOrUndefined(user.openOrder) && JSON.stringify(user.openOrder) !== '{}') {
            user.openOrder = null;
            this.userService.deleteOpenOrder(user._id)
              .subscribe(userWithoutOpenOrder => {
                this.nativeStorage.setItem(USER_INFO, JSON.stringify(userWithoutOpenOrder)).then(async (res) => {
                  this.contextService.setUser(userWithoutOpenOrder);
                  this.router.navigate(['home']);
                });
              })
          };
        });
    });

    this.socket.on('removingFromOrder', async (userToRemoveData) => {
      const alert = await this.alertController.create({
        header: 'Eliminar Usuarios del Pedido',
        message: 'Un usuario esta intentando quitarte de la mesa.',
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
              let dataToSend = {
                userName: this.contextService.getUser().username,
                orderId: this.contextService.getOrder()._id
              };
              this.socketIOService.removeUserFromOrder(dataToSend);
            }
          }
        ]
      });

      await alert.present();
    })
  }

  async removeUser() {
    this.orderService.getOrder(this.contextService.getOrder()._id)
    .subscribe(async (order: Order) =>{
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
                console.log(data);
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
    });
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
