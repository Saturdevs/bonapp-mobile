import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserInOrder } from '../models';
import { ApiExternalService } from './api.external.service';
import { ApiGeneralService } from './api.general.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private apiExternalService: ApiExternalService,
    private apiGeneralService: ApiGeneralService
  ) { }

  getAvatar(user: UserInOrder) {
    return this.apiExternalService.get(user.username);
  }

  createUser(user) {
    return this.apiGeneralService.post('/user/signup', user)
      .map(data => data)
      .catch(this.handleError);
  }

  updateUser(user) {
    return this.apiGeneralService.put('/user', user)
      .map(data => data.user)
      .catch(this.handleError);
  }

  deleteOpenOrder(userId) {
    return this.apiGeneralService.put(`/user/deleteOpenOrder/${userId}`)
      .map(data => data.user)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {    
    return Observable.throw(err);
  }
}
