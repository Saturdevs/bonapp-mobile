import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CategoryPageModule } from './category/category.module';
import { MenuPageModule } from './menu/menu.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from 'src/shared/shared.module';
import { IonicStorageModule } from '@ionic/storage';
import { ProductPageModule } from './product/product.module';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { JwtInterceptor, ErrorInterceptor } from 'src/shared/helpers';
import { LoadingService } from 'src/shared/services/loading.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    CategoryPageModule,
    MenuPageModule,
    ProductPageModule,
    SharedModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    QRScanner,
    LoadingService,
    Facebook,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  schemas: [ NO_ERRORS_SCHEMA ,CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [AppComponent]
})
export class AppModule {}
