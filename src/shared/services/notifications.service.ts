import { Injectable } from '@angular/core';
import { ApiService } from '.';
import { Notification } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private apiService: ApiService) { }

  send(notification : Notification) {
    return this.apiService.post('/notification/send', notification);
  }

  getAllTypes() {
    return this.apiService.get('/notification/types');
  }

}
