import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  errorMessage: string = '';
  pageTitle: string = "Inicio de sesión";

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) { }

  // convenience getter for easy access to form fields

  ngOnInit() {
  }

  tryGoogleLogin(){
    this.authenticationService.doGoogleLogin();
  }

  tryFacebookLogin(){
    this.authenticationService.doFacebookLogin();
  }

  goAppLoginPage(){
    this.navCtrl.navigateForward("/app-login");
  }
}
