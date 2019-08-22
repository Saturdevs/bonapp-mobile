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

  selectSize(size){
    this.selectedSizePrice = size.price;
    this.alertController.dismiss();
  }

  onBack(){
    this.navCtrl.back();
  }

  async showSizesModal(){
    let sizeList =  [];
    this.product.sizes.map((size)=>{
      size = {
        name: size.name,
        label: size.name + ' ($' + size.price + ')',
        type: 'radio',
        value: size
      };
      sizeList.push(size);
    })

    let alert = await this.alertController.create({
      header: "Tamaños",
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
              this.alertController.dismiss();
          },
        },
        {
          text: 'Aceptar',
          handler: data => {
            this.selectSize(data)
          },
        }
      ],
      inputs: sizeList,
      cssClass: 'sizesAlert',
    });
    await alert.present();  
  }

  async addToCart(){
    this.orderService.addProduct(this.product,this.productQty, async (order) => {
      let alert = await this.alertController.create({
        header: "Listo!",
        message: "Agregamos el producto a tu pedido",
        buttons: [
          {
            text: 'Ver Pedido',
            handler: data => {
                this.navCtrl.navigateForward("/order");
            },
          },
          {
            text: 'Agregar otro',
            handler: data => {
                this.navCtrl.navigateForward("/menu");
            },
          },
        ],
      });
      await alert.present();
    });
  }

}
