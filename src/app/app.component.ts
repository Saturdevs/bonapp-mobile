import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ContextService } from 'src/shared/services/context.service';
import { OrderService, User, CashRegister, AuthenticationService } from 'src/shared';
import { CashRegisterService } from 'src/shared/services/cash-register.service';
import { SocketIoService } from 'src/shared/services/socket-io.service';
import { isNullOrUndefined } from 'util';

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

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private contextService: ContextService,
    private orderService: OrderService,
    private CashRegisterService: CashRegisterService,
    private socketService: SocketIoService,
    private authenticationService: AuthenticationService
  ) {
    this.initializeApp();
  }

  callWaiter() {
    this.socketService.callWaiter();
  }

  initializeApp() {
    this.platform.ready().then(() => {
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
      let user = new User();
      user.lastname = 'Lischetti2';
      user.name = 'Lorenzoo';
      user.phone = '341560433';
      user.username = 'llischetti2';

      this.contextService.setUser(user);

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
            this.contextService.setOrder(order);
          }
        }
      )
    });
  }
}
