import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

import { Category, CategoryService, Menu } from '../../shared';
import { DataService } from 'src/shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/shared/services/loading.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  menu: Menu;
  categories: Category[];
  pageTitle: string = "";
  numberOfCategories: number;

  constructor(public navCtrl: NavController,
              public categoryService: CategoryService,
              private dataService: DataService,
              private _route: ActivatedRoute,
              private loadingService: LoadingService) {}

  populateCategoriesByMenu(menu) {
    this.loadingService.presentLoader();
    this.categoryService.getCategoriesByMenu(menu)
        .subscribe(categories => {
          this.categories = categories;
          this.numberOfCategories = this.categories.length;
          this.loadingService.dismissLoader();
        });
  }

  viewCategory(category) {
    this.dataService.setData(category);
    this.navCtrl.navigateForward("/category");
  }

  ngOnInit(): void {
    this.menu = this._route.snapshot.data['menu'];
    this.pageTitle = this.menu.name;
    this.populateCategoriesByMenu(this.menu._id);
  }
}
