import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { 
  Category, 
  Menu, 
  CategoryService, 
  MenuService 
} from '../../shared';
import { MenuPage } from '../menu/menu';
import { CategoryPage } from '../category/category';
import { searchBar } from '../searchbar/searchbar'

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
              private menuService: MenuService) {}

  populateCategories() {
    this.categoryService.getAll()
      .subscribe(categories => {         
        this.categories = categories;
        //console.log(this.categories);
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
    this.navCtrl.push(MenuPage, {menu: menu});
  }

  viewCategory(category) {
    this.navCtrl.push(CategoryPage, {category: category});
  }

  searchProduct(){    
    this.navCtrl.push(searchBar);
  }


  ngOnInit(): void {
    this.populateMenus();
    this.populateCategories();
  }

}
