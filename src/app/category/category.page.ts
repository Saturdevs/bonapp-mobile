import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from 'src/shared';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/shared/services/data.service';
import { LoadingService } from 'src/shared/services/loading.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})

export class CategoryPage implements OnInit {
  category: any;
  products: Product[];
  pageTitle: string;

  constructor(public productService: ProductService,
              private _route: ActivatedRoute,
              private navCtrl: NavController,
              private dataService: DataService,
              private loadingService: LoadingService) { }
    
  ngOnInit(): void {
    this.category = this._route.snapshot.data['category'];
    this.pageTitle = this.category.name;
    this.populateProductsByCategory(this.category._id);
  }

  populateProductsByCategory(categoryId) {
    this.loadingService.presentLoader();
    this.productService.getProductsByCategory(categoryId)
      .subscribe(products => {
        this.products = products;
        this.loadingService.dismissLoader();
      });
  }

  viewProduct(product) {
    this.dataService.setData(product);
    this.navCtrl.navigateForward("/product")
  }
}

