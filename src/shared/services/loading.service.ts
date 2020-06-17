import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading: any;
  constructor(private loadingCtrl : LoadingController) { }

  async createLoader(){
    this.loading = await this.loadingCtrl.create({
      cssClass: "customLoader",
      message: '<div class="loadingio-spinner-ellipsis-mq7cp6u3r8o"><div class="ldio-1izbv31f41m"><div></div><div></div><div></div><div></div><div></div></div></div>',
      spinner: null
    });
  }

  async presentLoader(){
    await this.createLoader();
    await this.loading.present();
  }

  async dismissLoader(){
    await this.loadingCtrl.dismiss(this.loading);
  }

}