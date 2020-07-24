import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';

import {
  Category,
  Menu,
  CategoryService,
  MenuService,
  OrderService,
  ApiService,
  UserInOrder,
  PaymentInUserOrder,
  ProductInUserOrder,
  Order,
  TableStatus,
  OpenOrderForUser,
  UserService,
  AuthenticationService,
  NotificationsService,
  Notification,
  NotificationTypes,
  NotificationType,
  SocketIoService,
  User,
  NotificationData
} from '../../shared';

import { DataService } from 'src/shared/services/data.service';
import { DailyMenuService } from 'src/shared/services/daily-menu.service';
import { DailyMenu } from 'src/shared/models/dailyMenu';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ContextService } from 'src/shared/services/context.service';
import { TableService } from 'src/shared/services/table.service';
import { RestaurantService } from 'src/shared/services/restaurant.service';
import { isNullOrUndefined } from 'util';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingService } from 'src/shared/services/loading.service';
import { Subscription } from 'rxjs';
const USER_INFO = "USER_INFO";

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
  numberOfMenus: number;
  numberOfCategories: number;
  pageTitle: string = "Inicio";
  dailyMenus: Array<DailyMenu>;
  numberOfDailyMenus: number;
  dailyMenuText = "Menu del dia";
  showQR: boolean = false;

  constructor(public navCtrl: NavController,
    private categoryService: CategoryService,
    private menuService: MenuService,
    private dataService: DataService,
    private dailyMenuService: DailyMenuService,
    private qrScanner: QRScanner,
    private contextService: ContextService,
    private orderService: OrderService,
    private _tableService: TableService,
    private resutaurantService: RestaurantService,
    private authService: AuthenticationService,
    private nativeStorage: NativeStorage,
    private userService: UserService,
    private notiicationService: NotificationsService,
    private socketIoService: SocketIoService,
    private loadingService: LoadingService,
    private changeDetection: ChangeDetectorRef,
    private socketIOService: SocketIoService) {

    this.contextService.getMessage()
      .subscribe(show => {
        this.showQR = show;
        if (this.showQR) {
          this.pageTitle = "Escanear QR";
        } else {
          this.pageTitle = "Inicio";
        }
        this.changeDetection.detectChanges();
      });

  }

  populateCategories() {
    this.categoryService.getAll()
      .subscribe(categories => {
        this.categories = categories;
        this.numberOfCategories = this.categories.length;
      });
  }

  populateMenus() {
    this.menuService.getAll()
      .subscribe(menus => {
        this.menus = menus;
        this.numberOfMenus = this.menus.length;
      });
  }

  populateMenusAndCategories() {
    this.categoryService.getAll()
      .subscribe(categories => {
        this.categories = categories;
        this.numberOfCategories = this.categories.length;
        this.menuService.getAll()
          .subscribe(menus => {
            this.menus = menus;
            this.numberOfMenus = this.menus.length;
            this.changeDetection.detectChanges();
            this.loadingService.dismissLoader();
          });
      });
  }

  populateDailyMenus() {
    this.dailyMenuService.getAll()
      .subscribe(dailyMenus => {
        this.dailyMenus = dailyMenus;
        this.numberOfDailyMenus = this.dailyMenus.length;
      });
  }

  viewMenu(menu) {
    this.dataService.setData(menu);
    this.navCtrl.navigateForward("/menu");
  }

  viewDailyMenu() {
    this.navCtrl.navigateForward("/dailyMenuList");
  }

  viewCategory(category) {
    this.dataService.setData(category);
    this.navCtrl.navigateForward("/category");
  }

  scanQR() {
    // Optionally request the permission early
    this.contextService.sendMessage(true);
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show();
          let scanSub = this.qrScanner.scan().subscribe((data: string) => {
            let restaurantInfo = JSON.parse(data);
            let user = this.contextService.getUser();

            this.loadingService.presentLoader();
            this.resutaurantService.getByRestaurantId(restaurantInfo.restaurantId)
              .subscribe(data => {
                this.contextService.setTableNro(restaurantInfo.tableNumber);
                this.contextService.setApiURL(data.restaurant[0].url_db);

                this.orderService.getOrderOpenByTable(this.contextService.getTableNro())
                  .subscribe(
                    async order => {
                      if (!isNullOrUndefined(order)) {
                        this.contextService.setOrder(order);
                        const userFind = order.users.find(u => u.username === user.username);

                        if (isNullOrUndefined(userFind)) {

                          let userToAdd = this.createUserToAdd(user, false);
                          order.users.push(userToAdd);
                          console.log('entro aca', order);

                          this.orderService.putOrder(order)
                            .subscribe(updatedOrder => {
                              this.contextService.setOrder(updatedOrder);
                              this.updateUserOrder(updatedOrder, restaurantInfo, scanSub);
                            }, err => {
                              console.log(err);
                            }
                            );
                        } else {
                          this.updateUserOrder(order, restaurantInfo, scanSub);
                        }
                      }
                      else {
                        await this.contextService.sendMessage(false);
                        scanSub.unsubscribe(); // stop scanning
                        await this.qrScanner.hide();
                        this.newOrder(user, restaurantInfo.restaurantId, restaurantInfo.orderType);
                      }
                    }
                  );
              });
          }, async (err) => {
            await this.contextService.sendMessage(false);
            scanSub.unsubscribe();
            await this.qrScanner.hide();
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

  updateUserOrder(order: Order, restaurantInfo: any, scanSub: Subscription): void {
    let openOrder = new OpenOrderForUser();
    openOrder.created = new Date();
    openOrder.orderId = order._id;
    openOrder.tableNumber = restaurantInfo.tableNumber;
    openOrder.restaurantId = restaurantInfo.restaurantId;

    let currentUser = this.contextService.getUser(); //sacar, esta al pedo

    let userToUpdate = new User();
    userToUpdate._id = currentUser._id;
    userToUpdate.openOrder = openOrder;
    userToUpdate.email = currentUser.email;
    console.log(userToUpdate);

    this.userService.updateUser(userToUpdate)
      .subscribe((updatedUser: User) => {
        this.addSocketId();
        console.log(updatedUser);
        this.authService.getUser(updatedUser._id)
          .subscribe(userFound => {
            this.nativeStorage.setItem(USER_INFO, JSON.stringify(userFound)).then(async (res) => {
              this.contextService.setUser(userFound);
             
              await this.contextService.sendMessage(false);
              scanSub.unsubscribe(); // stop scanning
              await this.qrScanner.hide();
              this.populateMenusAndCategories();
            });
          })
      });
  }

  addSocketId() {
    let joinUserToOrderData = {
      orderId: this.contextService.getOrder()._id,
      userId: this.contextService.getUser().username
    }
    this.socketIOService.joinUserToOrder(joinUserToOrderData);

    this.orderService.getOrder(this.contextService.getOrder()._id)
      .subscribe(order => {
        this.contextService.setOrder(order);
      });
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
    userToAdd.username = user.email;

    return userToAdd;
  }

  newOrder(user: User, restaurantId: string, orderType: string) {
    let order = new Order();

    order.type = orderType;
    order.table = this.contextService.getTableNro();
    order.status = "Open";
    order.users = new Array<UserInOrder>();
    order.app = true;

    let userToAdd = this.createUserToAdd(user, true);
    order.users.push(userToAdd);

    this._tableService.getTableByNumber(this.contextService.getTableNro())
      .subscribe(table => {
        table.status = TableStatus.OCUPADA;
        this._tableService.updateTable(table)
          .subscribe(updatedTable => {
            this.orderService.postOrder(order).subscribe(updatedOrder => {
              //traer usuario y actualizarle el openOrder
              let openOrder = new OpenOrderForUser();
              openOrder.created = new Date();
              openOrder.orderId = updatedOrder._id;
              openOrder.tableNumber = table.number;
              openOrder.restaurantId = restaurantId;

              let userToUpdate = new User();

              userToUpdate._id = user._id;
              userToUpdate.openOrder = openOrder;
              userToUpdate.email = user.email;
              console.log(userToUpdate);

              this.userService.updateUser(userToUpdate)
                .subscribe(updatedUser => {
                  console.log(updatedUser);
                  this.authService.getUser(updatedUser._id)
                    .subscribe(userFound => {
                      this.nativeStorage.setItem(USER_INFO, JSON.stringify(userFound)).then((res) => {
                        this.contextService.setUser(userFound);
                        this.contextService.setOrder(updatedOrder);
                        this.populateMenusAndCategories();

                        // NOTIFICACION PARA MESA OCUPADA! 
                        let notification = new Notification()
                        notification.createdAt = new Date();
                        notification.notificationType = NotificationTypes.TableOcuped;;
                        notification.table = table.number;
                        notification.userFrom = updatedUser.username;
                        notification.orderId = order._id;
                        notification.usersTo = [];
                        notification.readBy = null;
                        notification.data = new NotificationData();
                        notification.data.notificationType = NotificationTypes.TableOcuped;
                        notification.actions = [];

                        this.notiicationService.send(notification)
                          .subscribe(notificationSent => {
                            console.log(notificationSent);
                          });

                        this.socketIoService.updateTableStatus();
                        this.addSocketId();
                      });
                    });
                });
            },
              error => {
                console.log(error);
              })
          });
      })
  }

  ngOnInit(): void {
    this.nativeStorage.getItem(USER_INFO).then(async (respose) => {
      if (respose && JSON.stringify(respose) !== '{}') {
        let userinfo = JSON.parse(respose);
        if (!isNullOrUndefined(userinfo.openOrder) && JSON.stringify(userinfo.openOrder) !== '{}') {
          this.loadingService.presentLoader();
          this.resutaurantService.getByRestaurantId(userinfo.openOrder.restaurantId)
            .subscribe(data => {
              this.contextService.setApiURL(data.restaurant[0].url_db);
              this.orderService.getOrder(userinfo.openOrder.orderId)
                .subscribe(order => {
                  this.contextService.setOrder(order);
                  this.contextService.setTableNro(userinfo.openOrder.tableNumber);
                  this.populateMenusAndCategories();
                  this.addSocketId();
                });
            });
        } else {
          this.scanQR();
        }
      }
    })
  }

}
