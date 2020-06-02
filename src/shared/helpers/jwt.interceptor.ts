import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';

import { _throw } from 'rxjs/observable/throw';
import { User, AuthenticationService } from '..';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { switchMap } from 'rxjs/operators';
import { isObject } from 'util';

const USER_INFO = "USER_INFO"

@Injectable()

export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
        private nativeStorage: NativeStorage) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return (
            from(this.nativeStorage.getItem(USER_INFO))
                .pipe(
                    switchMap(result => {
                        // add authorization header with jwt token if available
                        // const currentAuthToken = this.authenticationService.currentAuthTokenValue;
                        let currentAuthUser: any
                        if(!isObject(result)){
                            currentAuthUser = JSON.parse(result);
                        }else{
                            currentAuthUser = result
                        }
                         
                        console.log('ENTRO', currentAuthUser);
                        if (currentAuthUser && currentAuthUser.token) {
                            console.log('ENTRO CON TOKEN', currentAuthUser.token);
                            const headers = {
                                Authorization: `Bearer ${currentAuthUser.token}`,
                            };
                            request = request.clone({
                                setHeaders: headers
                            });
                            console.log('req:', JSON.stringify(request));
                        }

                        return next.handle(request);
                    })
                )
        );
    }
}