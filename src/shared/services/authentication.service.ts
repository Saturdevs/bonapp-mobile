import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { ApiGeneralService } from './api.general.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Platform, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook/ngx';
import { isNullOrUndefined } from 'util';
import { UserService } from './user.service';
import { User } from '../models';
import { Roles } from '../enums';

const USER_INFO = "USER_INFO";
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authState = new BehaviorSubject(false);
  googlePlus = GooglePlus;
  FB_APP_ID: number = 287166978959053; //pasar a un enviroments cdo tengamos la de prod
  loggedUser: any = {};
  // private currentUserSubject: BehaviorSubject<User>;
  // public currentUser: Observable<User>;

  constructor(
    private _apiGeneralService: ApiGeneralService,
    private nativeStorage: NativeStorage,
    private platform: Platform,
    private router: Router,
    private loadingController: LoadingController,
    private fb: Facebook,
    private userService: UserService
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  ifLoggedIn() {
    this.nativeStorage.getItem(USER_INFO).then((respose) => {
      if (respose && JSON.stringify(respose) !== '{}') {
        this.authState.next(true);
      }
    })
  }

  getCurrentUser() {
    if (this.isAuthenticated()) {
      this.nativeStorage.getItem(USER_INFO)
        .then((response) => {
          if(response){
            return response;
          }
        })
    }
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
    this.nativeStorage.setItem(USER_INFO, {}).then(() => {
      this.router.navigate(['login']);
      this.authState.next(false);
    });
  }

  isAuthenticated() {
    return this.authState.value;
  }

  initializeUserInfo() {
    this.nativeStorage.keys()
      .then(keys => {
        if (keys.indexOf(USER_INFO) === -1) {
          this.nativeStorage.setItem(USER_INFO, {})
            .then(result => {
            });
        }
      });
  }

  checkUserEmailAndUpdate(user, isGoogle, isFacebook) {
    this._apiGeneralService.get(`/user/userByEmal`, user)
      .subscribe(userResp => {
        if (!isNullOrUndefined(userResp.user)) {
          if (isGoogle) {
            userResp.user.googleId = user.userId
          }
          else if (isFacebook) {
            userResp.user.facebookId = user.id
          }
          if ((isGoogle && isNullOrUndefined(userResp.user.googleId)) || (isFacebook && isNullOrUndefined(userResp.user.facebookId))) {
            this.userService.updateUser(userResp.user)
              .subscribe(u => {
                this.loggedUser = u;
              }, err => {
                this.loggedUser = null;
              });
          } else {
            this.loggedUser = user;
          }
        } else {
          let newUser: any = {};

          if (isGoogle) {
            newUser.googleId = user.userId;
            newUser.name = user.displayName.split(" ")[0];
            newUser.lastname = user.displayName.split(" ")[1];
            newUser.email = user.email;
            newUser.roleId = Roles.UserApp;
          }
          else if (isFacebook) {
            newUser.facebookId = user.id;
            newUser.name = user.name.split(" ")[0];
            newUser.lastname = user.name.split(" ")[1];
            newUser.email = user.email;
            newUser.roleId = Roles.UserApp;
          }

          this.userService.createUser(newUser)
            .subscribe(u => {
              console.log(u);
              this.loggedUser = u;
            }, err => {
              this.loggedUser = null;
            })
        }
      })
  }

  async doGoogleLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '202897263621-trb8oeah0jq5dn59cbo09c19tbadda9l.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
    })
      .then(user => {
        loading.dismiss();

        this.checkUserEmailAndUpdate(user, true, false);

        if (!isNullOrUndefined(this.loggedUser)) {
          this.nativeStorage.setItem(USER_INFO, JSON.stringify(this.loggedUser)).then((res) => {
            this.router.navigate(['home']);
            this.authState.next(true);
            loading.dismiss();
          });
        } else {
          loading.dismiss();
        }
      }, err => {

        loading.dismiss();
      });
  }

  doGoogleLogout() {
    this.googlePlus.logout()
      .then(res => {
        //user logged out so we will remove him from the NativeStorage
        this.nativeStorage.remove('google_user');
        this.router.navigate(["/login"]);
      }, err => {
        console.log(err);
      })
  }

  async doFacebookLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    // let permissions = new Array<string>();

    //the permissions your facebook app needs from the user
    const permissions = ["public_profile", "email"];

    this.fb.login(permissions)
      .then(response => {

        let userId = response.authResponse.userID;

        //Getting name and gender properties
        this.fb.api("/me?fields=name,email", permissions)
          .then(user => {
            user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
            //now we have the users info, let's save it in the NativeStorage
       
            this.checkUserEmailAndUpdate(user, false, true);
            if (!isNullOrUndefined(this.loggedUser)) {
              this.nativeStorage.setItem(USER_INFO, JSON.stringify(user)).then((res) => {
                this.router.navigate(['home']);
                this.authState.next(true);
                loading.dismiss();
              });
            } else {
              loading.dismiss();
            }


            // this.nativeStorage.setItem('facebook_user',
            // {
            // 	name: user.name,
            // 	email: user.email,
            // 	picture: user.picture
            // })
            // .then(() =>{
            //   this.router.navigate(["home"]);
            //   this.authState.next(true);          
            // 	loading.dismiss();
            // }, error =>{
            // 	console.log(error);
            // 	loading.dismiss();
            // })
          })
      }, error => {
        console.log(error);
        loading.dismiss();
      });
  }

  doFbLogout() {
    this.fb.logout()
      .then(res => {
        //user logged out so we will remove him from the NativeStorage
        this.nativeStorage.remove('facebook_user');
        this.router.navigate(["/login"]);
      }, error => {
        console.log(error);
      });
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  private handleError(err: HttpErrorResponse) {
    return Observable.throw(err);
  }
}
