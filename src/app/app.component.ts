import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ContextService } from 'src/shared/services/context.service';
import { OrderService, User, CashRegister, NotificationType, Notification } from 'src/shared';
import { CashRegisterService } from 'src/shared/services/cash-register.service';
import { NotificationsService } from 'src/shared/services/notifications.service';
import { NotificationTypes } from '../shared/enums/notificationsTypes';

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
  notificationsTypes: Array<NotificationType>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private contextService: ContextService,
    private orderService: OrderService,
    private CashRegisterService: CashRegisterService,
    private notificationSerive: NotificationsService
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

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      //////////////////////////////////////////////////////////////
      /**SOLO PARA PRUEBAS. ESTO DEBE HACERSE CUANDO SE LEE EL QR */
      //////////////////////////////////////////////////////////////
      let user = new User();
      user.lastname = 'Lischetti2';
      user.name = 'Lorenzoo';
      user.phone = '341560433';
      user.username = 'llischetti2';

      this.contextService.setUser(user);

      this.contextService.setTableNro(6);
      this.orderService.getOrderOpenByTable(this.contextService.getTableNro()).subscribe(
        order => {
          let cashRegister: CashRegister = null;
          this.CashRegisterService.getDefaultCashRegister()
            .subscribe(cashRegister => {
              cashRegister = cashRegister;
            });
          order.cashRegister = cashRegister;
          this.contextService.setOrder(order);
        }
      )
    });
  }
}
