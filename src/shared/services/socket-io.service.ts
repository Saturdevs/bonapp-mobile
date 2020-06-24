import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket;

  constructor(private notificationService: NotificationsService) {
    this.socket = io(`${environment.socket_url}`);
    this.socket.on("orderAccepted", orderAccepted => { //escucha el metodo de actualizar las mesas
      this.notificationService.sendLocalNotification("Su pedido fue aceptado!");
    });
  }

  updateTableStatus() {
    this.socket.emit('updateTable', {});
  }

  joinUserToOrder(data){
    this.socket.emit('appUserConnection', data);
  }
}
