import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/shared';


@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.page.html',
  styleUrls: ['./app-login.page.scss'],
})
export class AppLoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  pageTitle: string = "Inicio de sesión";

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  get f() { return this.loginForm.controls; }

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
