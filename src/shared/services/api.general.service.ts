import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class ApiGeneralService {

  constructor(
    private http: HttpClient
  ) { }

  private setHeaders(): HttpHeaders {
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    return new HttpHeaders(headersConfig);
  }

  private formatErrors(err: HttpErrorResponse) {
    return Observable.throw(err);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.api_general_url}${path}`, { headers: this.setHeaders(), params: params })
    .catch(this.formatErrors);
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(
      `${environment.api_general_url}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors);
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(
      `${environment.api_general_url}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors);
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_general_url}${path}`,
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors);
  }  

}
