import { Injectable } from '@angular/core';
import { ApiService } from '.';
import { Notification } from '../models';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { reduce } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private apiService: ApiService,
              private localNotifications: LocalNotifications) { }

  send(notification: Notification) {
    return this.apiService.post('/notification/send', notification)
      .map(data => data.notificationsSent)
      .catch(this.handleError);
  }

  getAllTypes() {
    return this.apiService.get('/notification/types')
      .map(data => data.notificationTypes)
      .catch(this.handleError);
  }

  sendLocalNotification(){
    // Schedule a single notification
    this.localNotifications.schedule({
      id: 1,
      text: 'Nueva notificacion de Bonapp!',
      silent: false,
      lockscreen: true,
      foreground: true,
      priority: 2,
      vibrate: true
    });
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }

}
