import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { UserService, User } from 'src/shared';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  pageTitle: string = "Registro";

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public _userService: UserService
  ) { }

  // convenience getter for easy access to form fields
  get form() { return this.registerForm.controls; }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  createUser() {
    let newUser = {
      name: this.form.name.value,
      lastname: this.form.lastname.value,
      email: this.form.email.value,
      password: this.form.password.value
    }
    
    this._userService.createUser(newUser).subscribe(
      data => {
        this.errorMessage = "";
        this.successMessage = "El usuario ha sido creado correctamente. Por favor, incie sesión.";
      }, err => {
        this.errorMessage = err.message;
        this.successMessage = "";
      }
    )
  }

  goLoginPage() {
    this.navCtrl.pop();
  }
}
