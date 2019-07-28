import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import {
  Category,
  Menu,
  CategoryService,
  MenuService
} from '../../shared';

import { MenuPage } from '../menu/menu.page';
import { CategoryPage } from '../category/category.page';
import { SearchbarPage } from '../searchbar/searchbar.page';
import { NavigationExtras } from '@angular/router';
import { DataService } from 'src/shared/services/data.service';

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
  number_of_menus: number;  

  constructor(public navCtrl: NavController,
              private categoryService: CategoryService,
              private menuService: MenuService,
              private dataService: DataService) { }

  populateCategories() {
    this.categoryService.getAll()
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  populateMenus() {
    this.menuService.getAll()
      .subscribe(menus => {
        this.menus = menus;
        this.number_of_menus = this.menus.length;
        console.log(this.number_of_menus);
      });
  }

  viewMenu(menu) {    
    this.dataService.setData(menu);
    this.navCtrl.navigateForward("/menu");
  }

  viewCategory(category) {
    this.dataService.setData(category);
    this.navCtrl.navigateForward("/category");
  }

  searchProduct() {
    this.navCtrl.navigateForward("/searchbar");
  }


  ngOnInit(): void {
    this.populateMenus();
    this.populateCategories();
  }

}
