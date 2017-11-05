/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { UserService } from './services/user.service';
import { DBService } from './services/db.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./css/app.component.css']
})
export class RegisterComponent {
  constructor(private router: Router, private user: UserService, private db: DBService, private auth: AuthService){}
  public keyboard: String = "../assets/keyboard.jpg";
  public upload: String = "../assets/upload.jpg";
  public style: String = "../assets/style.jpg";

  firstName: String;
  lastName: String;
  email: String;
  password: String;

  /**
   * Registers the user
   */
  register(): void{
    // Create a new user entry in the database
    this.db.createUser(this.firstName, this.lastName, this.email, this.password).then(result => {
      // After user created, log them in and go to home
      this.auth.login(this.email, this.password).then(result => {
        this.router.navigate(['home']);
      });
    })
  }
  /**
   * Verifies if the user's passwords match up
   */
  verifyPassword(): void {

  }
  /**
   * Submits form on enter key
   */
  onKey(event: any): void {
    if(event.key == "Enter"){
      this.register();
    }
  }
}
