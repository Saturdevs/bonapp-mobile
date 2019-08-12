import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

import { ProductService, OrderService } from '../../shared';
import { Product } from 'src/shared';
import { ActivatedRoute } from '@angular/router';
import { async } from 'q';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  pageTitle : string;
  product: Product;
  selectedSize: number = 0;
  selectedSizePrice: number = 0;
  productQty: number = 1;

  constructor(public navCtrl: NavController, 
              public productService: ProductService,
              public alertController: AlertController,
              public orderService : OrderService,
              private _route: ActivatedRoute) {}


  ngOnInit(): void {
    this.product = this._route.snapshot.data['product'];
    console.log(this.product);
    this.pageTitle = this.product.name;
    
  }

  plusQty(product){
    this.productQty++;
  }

  minusQty(product){
      if (this.productQty > 1){
          this.productQty--;
      };
  }

  selectSize(price){
    this.selectedSizePrice = price;
  }

  async addToCart(){
    this.orderService.addProduct(this.product,this.productQty, async (order) => {
      let alert = await this.alertController.create({
        header: "Info",
        message: "Item added to cart",
        buttons: [
          {
            text: 'Cart',
            handler: data => {
                this.navCtrl.navigateForward("/order");
            },
          },
        ],
      });
      await alert.present();
    });
  }

}
