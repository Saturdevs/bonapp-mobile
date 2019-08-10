import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from 'src/shared';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/shared/services/data.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})

export class CategoryPage implements OnInit {
  category: any;
  products: Product[];

  constructor(public productService: ProductService,
              private _route: ActivatedRoute,
              private navCtrl: NavController,
              private dataService: DataService) { }
    
  ngOnInit(): void {
    this.category = this._route.snapshot.data['category'];
    this.populateProductsByCategory(this.category._id);
  }

  populateProductsByCategory(categoryId) {
    this.productService.getProductsByCategory(categoryId)
      .subscribe(products => {
        this.products = products;
      });
  }

  viewProduct(product) {
    this.dataService.setData(product);
    this.navCtrl.navigateForward("/product")
  }
}

