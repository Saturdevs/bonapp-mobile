import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ContextService } from './context.service';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private _contextService: ContextService
  ){}

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
    let apiURL = this._contextService.getApiURL();

    return this.http.get(`${apiURL}${path}`, { headers: this.setHeaders(), params: params })
    .catch(this.formatErrors);
  }

  put(path: string, body: Object = {}): Observable<any> {
    let apiURL = this._contextService.getApiURL();

    return this.http.put(
      `${apiURL}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors);
  }

  post(path: string, body: Object = {}): Observable<any> {
    let apiURL = this._contextService.getApiURL();

    return this.http.post(
      `${apiURL}${path}`,
      JSON.stringify(body),
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors);
  }

  delete(path): Observable<any> {
    let apiURL = this._contextService.getApiURL();
    
    return this.http.delete(
      `${apiURL}${path}`,
      { headers: this.setHeaders() }
    )
    .catch(this.formatErrors);
  }  
}