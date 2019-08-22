import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService, Product } from 'src/shared';
import { NavController, IonSearchbar } from '@ionic/angular';
import { DataService } from 'src/shared/services/data.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.page.html',
  styleUrls: ['./searchbar.page.scss'],
})
export class SearchbarPage implements OnInit {

  products: Product[];
  items: String[];
  @ViewChild('searchbar',{static:false}) searchbar:IonSearchbar;

  constructor(private productService: ProductService,
              private navCtrl: NavController,
              private dataService: DataService) { }

  ngOnInit() {
    this.initializeItems();
  }

  initializeItems() {
    this.productService.getAll()
    .subscribe(products => {
        this.products = products;       
    });
  }

  getItems(ev) {
    // set val to the value of the ev target
    let val = ev.target.value;
    // if the value is an empty string don't filter the items
    if(this.products.length === 0){
      this.productService.getAll()
      .subscribe(products => {
          this.products = products.filter((product) => {          
          return (product.name.toLowerCase().indexOf(val.toLowerCase()) > -1);        
        });
      });
    }

    if (val.trim() === ''){
      this.initializeItems();   
    }
    
    if(this.products.length !== 0) {
      if (val && val.trim() !== '') {
        this.products = this.products.filter((product) => {
          return (product.name.toLowerCase().indexOf(val.toLowerCase()) > -1);        
        });
      }
    }
  }

  ionViewDidEnter(){
    setTimeout(()=>{
      this.searchbar.setFocus()
    })

   }

  viewProduct(product) {
    this.dataService.setData(product);
    this.navCtrl.navigateForward("/product")
  }

  onBack(){
    this.navCtrl.back();
  }
}
