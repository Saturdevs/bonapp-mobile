import { Component, OnInit } from '@angular/core';
import { DailyMenu } from 'src/shared/models/dailyMenu';
import { NavController, AlertController } from '@ionic/angular';
import { OrderService, ProductService, ProductInUserOrder } from 'src/shared';
import { DataService } from 'src/shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-daily-menu',
  templateUrl: './daily-menu.page.html',
  styleUrls: ['./daily-menu.page.scss'],
})
export class DailyMenuPage implements OnInit {
  pageTitle: string;
  dailyMenu: DailyMenu;
  selectedSize: number = 0;
  productInUserOrder: ProductInUserOrder;
  selectedSizePrice: number = 0;
  cart = {
    dailyMenus: [],
    total: 0
  };

  constructor(private navCtrl: NavController,
    private alertController: AlertController,
    private orderService: OrderService,
    private productService: ProductService,
    private dataService: DataService,
    private _route: ActivatedRoute) { }

  ngOnInit() {
    this.dailyMenu = this.dataService.getData();
    this.pageTitle = this.dailyMenu.name;
    this.productInUserOrder = new ProductInUserOrder();
    this.productInUserOrder.quantity = 1;
    this.productInUserOrder.price = this.dailyMenu.price;
    this.productInUserOrder.name = this.dailyMenu.name;
    this.productInUserOrder.dailyMenuId = this.dailyMenu._id;
    this.productInUserOrder.size = null;
    this.productInUserOrder.options = null;
    this.productInUserOrder.deleted = false;
    this.productInUserOrder.product = null;
  }

  plusQty(product) {
    this.productInUserOrder.quantity++;
  }

  minusQty(product) {
    if (this.productInUserOrder.quantity > 1) {
      this.productInUserOrder.quantity--;
    };
  }

  updateProductPrice(amount: number) {
    this.productInUserOrder.price += amount;
  }

  async addToCart() {
    let productInStorage = new ProductInUserOrder();
    this.orderService.getCart().then(cart => {
      if (!cart) {
        cart = this.cart;
      }

      productInStorage = cart.products.find(x => this.compareProducts(x, this.productInUserOrder));

      if (!isNullOrUndefined(productInStorage)) {
        let index = cart.products.indexOf(productInStorage);
        cart.products[index].quantity += this.productInUserOrder.quantity;
      }
      else {
        cart.products.push(this.productInUserOrder);
      }

      this.orderService.updateTotalPrice(cart, this.productInUserOrder.price, this.productInUserOrder.quantity);

      this.orderService.setCart(cart, async (order) => {

        this.dailyMenu.products.forEach(productId => {
          this.productService.getProduct(productId)
          .subscribe(product => {
            if(product.stockControl){
              product.stock.current--;
              this.productService.updateProduct(product)
                .subscribe(resp => {
                  console.log(resp);
              }); 
            };
          });
        });

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
      productInArray.dailyMenuId === productToAdd.dailyMenuId &&
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
