import { Injectable } from '@angular/core';
import { ApiGeneralService } from './api.general.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Restaurant } from '../models/restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  constructor(
    private apiGeneralService: ApiGeneralService
  ) { }

  getByRestaurantId(resturantId): Observable<any> {
    return this.apiGeneralService.get(`/restaurant/byRestaurantId/${resturantId}`)
      .map(data => data)
      .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    return Observable.throw(err);
  }

}
