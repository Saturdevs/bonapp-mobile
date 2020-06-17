import { Injectable } from '@angular/core';
import { Order, User } from '../models';
import { Observable, Subject } from 'rxjs';

/**
 * Servicio para almacenar propiedas de contexto (nro de mesa, pedido
 * abierto para la mesa, etc) que pueden ser requeridos en distintas partes
 * de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class ContextService {

  /**Nro de mesa en el que se lee el qr*/
  private tableNro: number;
  private _apiURL: String;
  /**Pedido abierto para la mesa en la que se lee el qr si existe alguno */
  private order: Order;
  private user: User;
  private displayProductsForEveryUser: boolean = false;
  private subject = new Subject<boolean>();
  
  constructor() { }


  async sendMessage(show : boolean) {
     await this.subject.next(show);
  }

  getMessage(): Observable<boolean> {
    return this.subject.asObservable();
  }

  setApiURL(value: String): void {
    this._apiURL = value;
  }

  getApiURL(){
    return this._apiURL;
  }

  setTableNro(tableNro: number): void {
    this.tableNro = tableNro;
  }

  getTableNro(): number {
    return this.tableNro;
  }

  setOrder(openOrder: Order): void {
    this.order = openOrder;
  }

  getOrder(): Order {
    return this.order;
  }

  setUser(user: User): void {
    this.user = user;
  }

  getUser(): User {    
    return this.user;
  }

  setDisplayProductsForEveryUser(displayProductsForEveryUser: boolean): void {
    this.displayProductsForEveryUser = displayProductsForEveryUser;
  }

  getDisplayProductsForEveryUser(): boolean {
    return this.displayProductsForEveryUser;
  }
}
