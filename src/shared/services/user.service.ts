import { Injectable } from '@angular/core';
import { ApiExternalService } from './api.external.service';
import { UserInOrder } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiExternalService: ApiExternalService) { }

  getAvatar(user: UserInOrder){
    return this.apiExternalService.get(user.username);
  }
}
