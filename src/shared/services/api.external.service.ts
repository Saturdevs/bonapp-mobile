import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class ApiExternalService {
  constructor(private http: HttpClient) { }

  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': '*/*',
      'Accept': '*/*',
    };

    return new HttpHeaders(headersConfig);
  }

  private formatErrors(err: HttpErrorResponse) {
    return Observable.throw(err);
  }

  get(username: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.avatar_url}${username}`, { headers: this.setHeaders(), params: params })
    .catch(this.formatErrors);
  }
  
}
