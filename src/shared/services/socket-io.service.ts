import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { NotificationsService } from './notifications.service';
import { AuthenticationService } from './authentication.service';
import { isNullOrUndefined } from 'util';
import { UserService } from './user.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ContextService } from './context.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
const USER_INFO = "USER_INFO";

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket;

  constructor(private notificationService: NotificationsService,
    private authService: AuthenticationService,
    private userService: UserService,
    private nativeStorage: NativeStorage,
    private contextService: ContextService,
    private router: Router,
    private alertController: AlertController,
    private socketIOService: SocketIoService) {

    this.socket = io(`${environment.socket_url}`);

    this.socket.on("orderAccepted", orderAccepted => { //escucha el metodo de actualizar las mesas
      this.notificationService.sendLocalNotification("Su pedido fue aceptado!");
    });

    this.socket.on("userRemovedFromOrder", userRemovedFromOrderData => { //escucha el metodo de eliminar usuarios de la orden
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

    this.socket.on("removingFromOrder", async (userToRemoveData) => {
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

  updateTableStatus() {
    this.socket.emit('updateTable', {});
  }

  joinUserToOrder(data) {
    this.socket.emit('appUserConnection', data);
  }

  removeUserFromOrder(user) {
    this.socket.emit('removeUserFromOrder', user);
  }
}
