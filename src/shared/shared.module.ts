import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services';
import { NavbarPageModule } from 'src/app/navbar/navbar.module';
import { NavbarPage } from 'src/app/navbar/navbar.page';



@NgModule({
  declarations: [NavbarPage],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarPage
  ],
  providers: [
    ApiService
  ],
  entryComponents: [NavbarPage],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SharedModule { }
