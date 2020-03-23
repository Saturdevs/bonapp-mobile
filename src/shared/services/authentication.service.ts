import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { ApiGeneralService } from './api.general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

const USER_INFO = "USER_INFO";
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);

  constructor(
    private _apiGeneralService: ApiGeneralService,
    private nativeStorage: NativeStorage,
    private platform: Platform,
    private router: Router
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    })
  }

  ifLoggedIn() {
    this.nativeStorage.getItem(USER_INFO).then((respose) => {
      if (respose) {
        this.authState.next(true);
      }
    })
  }

  login(email: string, password: string) {
    return this._apiGeneralService.post(`/user/signin`, { email, password })
      .map(data => {
        const user = data.user;
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.nativeStorage.setItem(USER_INFO, JSON.stringify(user)).then((res) => {
            this.router.navigate(['home']);
            this.authState.next(true);
          });
        }
      })
      .catch(this.handleError);
  }

  logout() {
    // remove user from local storage to log user out
    this.nativeStorage.remove(USER_INFO).then(() => {
      this.router.navigate(['login']);
      this.authState.next(false);
    });
  }

  isAuthenticated() {
    return this.authState.value;
  }

  private handleError(err: HttpErrorResponse) {
    return Observable.throw(err);
  }
}
