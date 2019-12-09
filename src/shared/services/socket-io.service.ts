import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ContextService } from './context.service';
import { WaiterCall } from '../models/waiterCall';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private socket;

  constructor(private contextService: ContextService) {
    this.socket = io(`${environment.socket_url}`);
   }

  callWaiter(){
    let waiterCall = new WaiterCall();
    waiterCall.tableNumber = this.contextService.getTableNro();
    waiterCall.userName = this.contextService.getUser().username;
    waiterCall.waiterName = 'Mozo de prueba';
    this.socket.emit('callWaiter', waiterCall);
  }
}
