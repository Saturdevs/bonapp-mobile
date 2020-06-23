import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { ContextService } from 'src/shared/services/context.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {
  isHomePage: boolean = false;
  shouldShowSearch : boolean = true;
  showQRAim : boolean = false;
  
  @Input() pageTitle: string;
  @Input() isModal?: boolean = false;
  
  constructor(private _route: ActivatedRoute,
              private navCtrl: NavController,
              private modalController: ModalController,
              private contextService: ContextService,
              private changeDetection: ChangeDetectorRef) { 
                this.contextService.getMessage().subscribe(show => { 
                  this.showQRAim = show;
                  this.changeDetection.detectChanges();
                });
              }

  ngOnInit() {
    if(this._route.snapshot['_routerState'].url == '/home' || this._route.snapshot['_routerState'].url == '/login'){
      this.isHomePage = true;
    }

    if(this._route.snapshot['_routerState'].url === '/payments' 
    || this._route.snapshot['_routerState'].url === '/login' 
    || this._route.snapshot['_routerState'].url === '/app-login' 
    || this._route.snapshot['_routerState'].url === '/register'
    || this.showQRAim === true)
    {
      this.shouldShowSearch = false;
    }
  }

  onBack(){
    if(this.isModal){
      this.modalController.dismiss();
    }else{
      this.navCtrl.back();
    }
  }

  searchProduct() {
    this.navCtrl.navigateForward("/searchbar");
  }

}
