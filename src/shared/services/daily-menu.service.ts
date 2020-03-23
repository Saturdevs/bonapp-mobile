import { Injectable } from '@angular/core';
import { ApiService } from '.';
import { Observable } from 'rxjs';
import { DailyMenu } from '../models/dailyMenu';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DailyMenuService {

  constructor(private apiService: ApiService) { }

  getAll(): Observable<DailyMenu[]> {
    return this.apiService.get('/dailyMenu')
      .map(data => data.dailyMenus)
      .catch(this.handleError);
  }

  getDailyMenu(id): Observable<DailyMenu>{
    return this.apiService.get(`/dailyMenu/${id}`)
    .map(data => data.dailyMenu)
    .catch(this.handleError)
  }

  private handleError(err: HttpErrorResponse) {
    console.log(err.message);
    return Observable.throw(err);
  }
}
