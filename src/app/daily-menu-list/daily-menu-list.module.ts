import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DailyMenuListPage } from './daily-menu-list.page';

const routes: Routes = [
  {
    path: '',
    component: DailyMenuListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DailyMenuListPage]
})
export class DailyMenuListPageModule {}
