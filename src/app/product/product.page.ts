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

  async addToCart(){
    let prompt = await this.alertController.create({
      header: "Quantity",
      message: "",
      inputs: [
        {name:"quantity",
        value: "1",
        },
      ],
      buttons: [
        {
          text:"Cancel",
          handler: data => {
            console.log("Cancel");
          }
        },
        {
          text:"Add To Cart",
          handler: data => {
            this.orderService.addProduct(this.product,data.quantity, async (order) => {
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
          },
        }
      ]
    });

    await prompt.present();
  }

}
