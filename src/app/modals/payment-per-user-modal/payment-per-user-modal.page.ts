import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-per-user-modal',
  templateUrl: './payment-per-user-modal.page.html',
  styleUrls: ['./payment-per-user-modal.page.scss'],
})
export class PaymentPerUserModalPage implements OnInit {
  @Input('userName') username: string;
  @Input('userAmount') userAmount: number;
  pageTitle: string;
  totalAmount: boolean = true;
  amountToPay: number;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.pageTitle  = 'Pagos para el usuario ' + this.username;
    this.amountToPay = this.userAmount;
  }

  setAmount(total){
    this.totalAmount = total;
    
    if(this.totalAmount === true){
      this.amountToPay = this.userAmount;
    }
    else{
      this.amountToPay = 0;
    }
  }

  selectAmount(){
    this.modalCtrl.dismiss({
      'username': this.username,
      'paymentAmount': this.amountToPay
    });
  }
}
