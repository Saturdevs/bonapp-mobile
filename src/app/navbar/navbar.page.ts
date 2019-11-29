import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {
  isHomePage: boolean = false;
  shouldShowSearch : boolean = true;
  
  @Input() pageTitle: string;
  constructor(private _route: ActivatedRoute,
              private navCtrl: NavController) { }

  ngOnInit() {
    if(this._route.snapshot['_routerState'].url == '/home'){
      this.isHomePage = true;
    }

    if(this._route.snapshot['_routerState'].url === '/payments'){
      this.shouldShowSearch = false;
    }
  }

  onBack(){
    this.navCtrl.back();
  }

  searchProduct() {
    this.navCtrl.navigateForward("/searchbar");
  }

}
