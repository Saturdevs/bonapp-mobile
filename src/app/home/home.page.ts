import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import {
  Category,
  Menu,
  CategoryService,
  MenuService
} from '../../shared';

import { DataService } from 'src/shared/services/data.service';
import { DailyMenuService } from 'src/shared/services/daily-menu.service';
import { DailyMenu } from 'src/shared/models/dailyMenu';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  // slides for slider
  public slides = [
    "assets/img/slider/slide1.jpg",
    "assets/img/slider/slide2.jpg",
    "assets/img/slider/slide3.jpg"
  ];

  categories: Category[];
  menus: Menu[];
  numberOfMenus: number; 
  numberOfCategories: number;
  pageTitle: string = "Inicio"; 
  dailyMenus: Array<DailyMenu>;
  numberOfDailyMenus: number;
  dailyMenuText = "Menu del dia";

  constructor(public navCtrl: NavController,
              private categoryService: CategoryService,
              private menuService: MenuService,
              private dataService: DataService,
              private dailyMenuService: DailyMenuService) { }

  populateCategories() {
    this.categoryService.getAll()
      .subscribe(categories => {
        this.categories = categories;
        this.numberOfCategories = this.categories.length;
      });
  }

  populateMenus() {
    this.menuService.getAll()
      .subscribe(menus => {
        this.menus = menus;
        this.numberOfMenus = this.menus.length;
      });
  }

  populateDailyMenus(){
    this.dailyMenuService.getAll()
      .subscribe(dailyMenus => {
        this.dailyMenus = dailyMenus;
        this.numberOfDailyMenus = this.dailyMenus.length;
      });
  }

  viewMenu(menu) {    
    this.dataService.setData(menu);
    this.navCtrl.navigateForward("/menu");
  }

  viewDailyMenu() {    
    this.navCtrl.navigateForward("/dailyMenuList");
  }

  viewCategory(category) {
    this.dataService.setData(category);
    this.navCtrl.navigateForward("/category");
  }

  ngOnInit(): void {
    this.populateMenus();
    this.populateCategories();
  }

}
