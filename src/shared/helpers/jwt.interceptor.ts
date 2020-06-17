import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';

import { _throw } from 'rxjs/observable/throw';
import { User, AuthenticationService } from '..';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { switchMap } from 'rxjs/operators';
import { isObject } from 'util';

const USER_INFO = "USER_INFO"

@Injectable()

export class JwtInterceptor implements HttpInterceptor {
    isLoading: boolean;
    constructor(private authenticationService: AuthenticationService,
        private nativeStorage: NativeStorage) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return (
            from(this.nativeStorage.getItem(USER_INFO))
                .pipe(
                    switchMap(result => {
                        // add authorization header with jwt token if available
                        let currentAuthUser: any
                        if (!isObject(result)) {
                            currentAuthUser = JSON.parse(result);
                        } else {
                            currentAuthUser = result
                        }
                        if (currentAuthUser && currentAuthUser.token) {
                            const headers = {
                                Authorization: `Bearer ${currentAuthUser.token}`,
                            };
                            request = request.clone({
                                setHeaders: headers
                            });
                        }
                        
                        return next.handle(request);
                    })
                )
        );
}
}