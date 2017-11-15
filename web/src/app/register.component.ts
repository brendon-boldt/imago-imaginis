/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { UserService } from './services/user.service';
import { DBService } from './services/db.service';
import { AuthService } from './services/auth.service';

import { ModalComponent } from './modal/app-modal.component';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./css/app.component.css']
})
export class RegisterComponent {
  @ViewChild('modal') modal;
  age: any;
  errorText: String;
  constructor(private router: Router, private user: UserService, private db: DBService, private auth: AuthService){}
  public keyboard: String = "../assets/keyboard.jpg";
  public upload: String = "../assets/upload.jpg";
  public style: String = "../assets/style.jpg";

  form: any = {};

  /**
   * Registers the user
   */
  register(): void{
    // Create a new user entry in the database
    if(this.age){
      this.db.createUser(this.form.firstName, this.form.lastName, this.form.email, this.form.password).then(result => {
        console.log(result);
        if(result.status == 401){
          this.errorText = "Sorry, this email is already registered.";
          this.modal.show();
        }
        else{
          // After user created, log them in and go to home
          this.auth.login(this.form.email, this.form.password).then(result => {
            this.router.navigate(['home']);
          });
        }
      })
    }
    else{
      this.errorText = "Sorry. This website is restricted to ages 18 and over."
      this.modal.show();
    }
  }
}
