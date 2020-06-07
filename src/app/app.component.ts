import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ContextService } from 'src/shared/services/context.service';
import { 
  OrderService, 
  User, 
  CashRegister,
  CashRegisterService,  
  AuthenticationService, 
  NotificationType, 
  Notification,
  SocketIoService,
  NotificationsService,
  NotificationTypes,
  Client
} from 'src/shared';
import { isNullOrUndefined } from 'util';
import { ClientService } from 'src/shared/services/client.service';

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
      icon: 'home'
    },
    {
      title: 'Mi Pedido',
      url: '/order',
      icon: 'cart'
    },
    {
      title: 'Realizar pago',
      url: '/order',
      icon: 'logo-usd'
    }
  ];
  isUserLoggedIn: Boolean = false;
  notificationsTypes: Array<NotificationType>;

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private contextService: ContextService,
    private orderService: OrderService,
    private CashRegisterService: CashRegisterService,
    private socketService: SocketIoService,
    private authenticationService: AuthenticationService,
    private notificationSerive: NotificationsService,
    private clientService: ClientService
  ) {
    this.initializeApp();
  }

  callWaiter(){
    this.notificationSerive.getAllTypes()
      .subscribe(notificationsTypes => {
        this.notificationsTypes = notificationsTypes;
        
        let currentNotificationType = this.notificationsTypes.find(x => x.type == NotificationTypes.WaiterCall);
        let notification = new Notification();
        notification.createdAt = new Date();
        notification.notificationType = currentNotificationType;
        notification.readBy = null;
        notification.table = this.contextService.getTableNro();
        notification.userFrom = this.contextService.getUser()._id;
        notification.usersTo = [];

        this.notificationSerive.send(notification)
          .subscribe(result => {
            console.log(result);
          })
      });
  }

  logout(){
    this.authenticationService.logout();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.authenticationService.initializeUserInfo();
      this.statusBar.styleDefault();
      this.splashScreen.hide();

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

      let user = this.contextService.getUser();
      
      this.contextService.setTableNro(6);
      this.orderService.getOrderOpenByTable(this.contextService.getTableNro()).subscribe(
        order => {
          if (!isNullOrUndefined(order)) {
            let cashRegister: CashRegister = null;
            this.CashRegisterService.getDefaultCashRegister()
              .subscribe(cashRegister => {
                cashRegister = cashRegister;
              });
            order.cashRegister = cashRegister;
            let client: Client = null;
            this.clientService.getClientByEmail(user.username)
              .subscribe(client => {
                client = client
                if(!isNullOrUndefined(client)){
                  order.users.find(x => x.username == user.username).clientId = client._id.toString();
                }
              })
            this.contextService.setOrder(order);
          }
        }
      )
    });
  }
}
