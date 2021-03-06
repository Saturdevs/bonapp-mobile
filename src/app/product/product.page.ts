import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

import { OrderService, ProductInUserOrder, ProductService } from '../../shared';
import { Product } from 'src/shared';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/shared/services/data.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  pageTitle: string;
  product: Product;
  selectedSize: number = 0;
  selectedSizePrice: number = 0;
  productInUserOrder: ProductInUserOrder;
  cart: any;

  constructor(private navCtrl: NavController,
    private alertController: AlertController,
    private orderService: OrderService,
    private productService: ProductService,
    private dataService: DataService,
    private _route: ActivatedRoute) { }


  ngOnInit(): void {
    this.product = this._route.snapshot.data['product'];
    this.productInUserOrder = new ProductInUserOrder();
    this.productInUserOrder.quantity = 1;
    this.productInUserOrder.price = this.product.price;
    this.productInUserOrder.name = this.product.name;
    this.productInUserOrder.product = this.product._id;
    this.pageTitle = this.product.name;
    this.cart = {
      products: [],
      total: 0
    };
  }

  plusQty(product) {
    this.productInUserOrder.quantity++;
  }

  minusQty(product) {
    if (this.productInUserOrder.quantity > 1) {
      this.productInUserOrder.quantity--;
    };
  }

  selectSize(size) {
    this.productInUserOrder.price = size.price;
    this.calculatePrice();
    this.alertController.dismiss();
  }

  selectOption(option) {
    if (option.checked) {
      let opt = {
        name: option.name,
        price: option.price
      }

      this.productInUserOrder.options.push(opt)
      this.updateProductPrice(opt.price);
    } else {
      let opt = this.productInUserOrder.options.find(op => op.name === option.name && op.price === option.price);

      if (!isNullOrUndefined(opt)) {
        this.productInUserOrder.options.splice(this.productInUserOrder.options.indexOf(opt), 1);
        this.updateProductPrice(-opt.price);
      }
    }
  }

  updateProductPrice(amount: number) {
    this.productInUserOrder.price += amount;
  }

  calculatePrice() {
    if (!isNullOrUndefined(this.productInUserOrder.options) && this.productInUserOrder.options.length > 0) {
      this.productInUserOrder.options.forEach(opt => {
        this.productInUserOrder.price += opt.price;
      })
    }
  }

  async showSizesModal() {
    let sizeList = [];
    this.product.sizes.map((size) => {
      size = {
        name: size.name,
        label: size.name + ' ($' + size.price + ')',
        type: 'radio',
        value: size
      };
      sizeList.push(size);
    })

    let alert = await this.alertController.create({
      header: "Tama??os",
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'alertCancelButton',
          handler: data => {
            this.alertController.dismiss();
          },
        },
        {
          text: 'Aceptar',
          cssClass: 'alertOKButton',
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

  async addToCart() {
    let productInStorage = new ProductInUserOrder();
    this.orderService.getCart().then(cart => {
      console.log("addtoCart Entro al Then, cart =>", cart);
      if (!cart) {
        cart = this.cart;
        console.log("addtoCart Entro al if de !cart, cart =>", cart);
      }

      productInStorage = cart.products.find(x => this.compareProducts(x, this.productInUserOrder));

      console.log("addtoCart productInStorage =>", productInStorage);

      if (!isNullOrUndefined(productInStorage)) {
        let index = cart.products.indexOf(productInStorage);
        cart.products[index].quantity += this.productInUserOrder.quantity;
      }
      else {
        cart.products.push(this.productInUserOrder);
        console.log("addtoCart entro al else de !productInstorage cart =>", cart);        
      }
      console.log("addtoCart antes del updateTotalPrice=>", cart);              
      this.orderService.updateTotalPrice(cart, this.productInUserOrder.price, this.productInUserOrder.quantity);
      console.log("addtoCart despues del updateTotalPrice=>", cart);              

      this.orderService.setCart(cart, async (order) => {

        if (this.product.stockControl) {
          this.product.stock.current--;
          this.productService.updateProduct(this.product)
            .subscribe(resp => {
              console.log(resp);
            })
        };
        let alert = await this.alertController.create({
          header: "Listo!",
          message: "Agregamos el producto a tu pedido",
          buttons: [
            {
              text: 'Ver Pedido',
              handler: data => {
                this.navCtrl.navigateRoot("/order");
              },
            },
            {
              text: 'Agregar otro',
              handler: data => {
                this.navCtrl.navigateRoot("/menu");
              },
            },
          ],
        });
        await alert.present();
      })
    })
  }

  compareProducts(productInArray: ProductInUserOrder, productToAdd: ProductInUserOrder): boolean {
    if (productInArray.product === productToAdd.product &&
      productInArray.name === productToAdd.name &&
      productInArray.observations === productToAdd.observations &&
      productInArray.options.every(opt => productToAdd.options.indexOf(opt) === -1) &&
      productInArray.price === productToAdd.price &&
      productInArray.size === productToAdd.size &&
      productInArray.deleted === productToAdd.deleted) {
      return true;
    }
    else {
      return false;
    }
  }

  updateTotalPrice(cart: any, price: number, quantity: number) {
    cart.total += price * quantity;
  }

  onBack() {
    this.navCtrl.back();
  }

}
