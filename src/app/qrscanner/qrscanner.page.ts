import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ContextService } from 'src/shared/services/context.service';
import { OrderService, CashRegister, CashRegisterService, Client, Order, UserInOrder, ProductInUserOrder, PaymentInUserOrder, Table, TableStatus, ApiService } from 'src/shared';
import { isNullOrUndefined } from 'util';
import { ClientService } from 'src/shared/services/client.service';
import { TableService } from 'src/shared/services/table.service';
import { NavController } from '@ionic/angular';
import { RestaurantService } from 'src/shared/services/restaurant.service';


@Component({
  selector: 'app-qrscanner',
  templateUrl: './qrscanner.page.html',
  styleUrls: ['./qrscanner.page.scss'],
})
export class QrscannerPage implements OnInit {
  pageTitle: string = "Escanea tu QR!";
  selectedTable: Table;

  constructor(private qrScanner: QRScanner,
    private contextService: ContextService,
    private orderService: OrderService,
    // private _tableService: TableService,
    private navCtrl: NavController,
    private resutaurantService: RestaurantService,
    private _apiService: ApiService) { }

  ngOnInit() {
  }

  scanQR() {
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show();
          document.getElementsByTagName("body")[0].style.opacity = "0";
          let scanSub = this.qrScanner.scan().subscribe((data: string) => {
            let restaurantInfo = JSON.parse(data);
            let user = this.contextService.getUser();
            
            this.resutaurantService.getByRestaurantId(restaurantInfo.restaurantId)
              .subscribe(data  => {
                console.log(data);
                
                this.contextService.setTableNro(restaurantInfo.tableNumber);
                this.contextService.setApiURL(data.restaurant[0].url_db);

                this.orderService.getOrderOpenByTable(this.contextService.getTableNro())
                  .subscribe(
                    order => {
                      if (!isNullOrUndefined(order)) {
    
                        let userToAdd = this.createUserToAdd(user, false);
    
                        order.users.push(userToAdd);
    
                        this.orderService.putOrder(order, order._id)
                          .subscribe(updatedOrder => {
                            this.contextService.setOrder(updatedOrder);
                          });
                      }
                      else {
                        this.newOrder(user);
                      }
                    }
                  );
              });

            document.getElementsByTagName("body")[0].style.opacity = "1";
            
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            this.navCtrl.navigateForward('/home');
          }, (err) => {
            document.getElementsByTagName("body")[0].style.opacity = "1";
            console.log(err);
          });



        } else if (status.denied) {
          //   // camera permission was permanently denied
          //   // you must use QRScanner.openSettings() method to guide the user to the settings page
          //   // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  createUserToAdd(user, owner): UserInOrder {
    let userToAdd = new UserInOrder();
    userToAdd.owner = owner;
    userToAdd.blocked = false;
    userToAdd.lastName = user.lastname;
    userToAdd.name = user.name;
    userToAdd.payments = new Array<PaymentInUserOrder>();
    userToAdd.payments = [];
    userToAdd.products = new Array<ProductInUserOrder>();
    userToAdd.products = [];
    userToAdd.totalPerUser = 0;
    userToAdd.username = user.username;

    return userToAdd;
  }

  newOrder(user) {
    let order = new Order();

    order.type = "App";
    order.table = this.contextService.getTableNro();
    order.status = "Open";
    order.users = new Array<UserInOrder>();
    order.app = true;

    let userToAdd = this.createUserToAdd(user, true);
    order.users.push(userToAdd);

    // this._tableService.getTableByNumber(this.contextService.getTableNro())
    //   .subscribe(table => {
    //     table.status = TableStatus.OCUPADA;
    //     this._tableService.updateTable(table)
    //       .subscribe(updatedTable => {
    //         this.orderService.postOrder(order).subscribe(() => {
    //           this.contextService.setOrder(order);
    //           console.log(order);
    //         },
    //           error => {
    //             console.log(error);
    //           })
    //       });
    //   })
  }

}
