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

  loginForm: FormGroup;
  errorMessage: string = '';
  pageTitle: string = "Inicio de sesión";

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) { }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  tryGoogleLogin(){
    this.authenticationService.doGoogleLogin();
  }

  tryFacebookLogin(){
    this.authenticationService.doFacebookLogin();
  }

  login() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .subscribe(
        data => {
          this.navCtrl.navigateForward('/home');
        },
        error => {
          this.errorMessage = error.error.message;
        }
      );
  }

  goRegisterPage() {
    this.navCtrl.navigateForward("/register");
  }
}
