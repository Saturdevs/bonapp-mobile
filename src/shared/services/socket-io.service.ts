import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket;

  constructor() {

    this.socket = io(`${environment.socket_url}`);
  }

  public getSocket(){
    return this.socket;
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
