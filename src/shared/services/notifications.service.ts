import { Injectable } from '@angular/core';
import { ApiService } from '.';
import { Notification } from '../models';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private apiService: ApiService) { }

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

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }

}
