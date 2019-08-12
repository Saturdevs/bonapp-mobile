import { Component, OnInit } from '@angular/core';
import { Order, OrderService } from 'src/shared';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  pageTitle: string = "Pedido";
  public order = {
      products: [],
      total: 0,
  };
  orders: Order[];

  constructor(public nav: NavController, 
              public orderService: OrderService){}

  ngOnInit(): void {
    this.orderService.getAll().then((data) =>  {
    if (data) {
        data.total = this.orderService.calculateTotalPrice(data.products);
        this.order = data;
        console.log(this.order);
        
      }
    });   
  }

  plusQty(product){
      product.quantity++;
      this.orderService.changeQty(this.order);
  }

  minusQty(product){
      if (product.quantity > 1){
          product.quantity--;
      }
      this.orderService.changeQty(this.order);
  }

  remove(index){
      this.orderService.removeProduct(this.order, index);
  }

  searchOrderByTable(table){
      this.orderService.searchOrders(table, true)
      .subscribe(orders => {
      this.orders = orders;
    });
  }

  updateOrder(order,orderId){
      this.orderService.putOrder(order,orderId);
  }

  createOrder(order){
      this.orderService.postOrder(order);
  }

  confirmOrder(order){

      this.searchOrderByTable(5);
      
      if (this.orders.length === 1){
          this.updateOrder(order, order._id);

          console.log('Existe');
      }
      if (this.orders.length === 0){
          this.createOrder(order);
          console.log("no existre")
      }
  }
}