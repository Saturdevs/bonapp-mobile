import { Component, OnInit } from '@angular/core';
import { DailyMenu } from 'src/shared/models/dailyMenu';
import { DailyMenuService } from 'src/shared/services/daily-menu.service';
import { DataService } from 'src/shared/services/data.service';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/shared/services/loading.service';

@Component({
  selector: 'app-daily-menu-list',
  templateUrl: './daily-menu-list.page.html',
  styleUrls: ['./daily-menu-list.page.scss'],
})
export class DailyMenuListPage implements OnInit {
  category: any;
  dailyMenus: Array<DailyMenu>;
  pageTitle: string = "Menues del dia";

  constructor(private dailyMenuService: DailyMenuService,
              private dataService: DataService,
              private navCtrl: NavController,
              private loadingService: LoadingService) { }

  ngOnInit() {
    this.populateDailyMenus();
  }

  populateDailyMenus(){
    this.loadingService.presentLoader();
    this.dailyMenuService.getAll()
    .subscribe(dailyMenus => {
      this.dailyMenus = dailyMenus;
      this.loadingService.dismissLoader();
    });
  }

  viewDailyMenu(dailyMenu){
    this.dataService.setData(dailyMenu);
    this.navCtrl.navigateForward("/dailyMenu")
  }

}
