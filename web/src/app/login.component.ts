/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Importing database service so we can check to see if the user login information exists
import { DBService } from './services/db.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./app.component.css']
})
export class LoginComponent {
  public keyboard: String = "../assets/keyboard.jpg";
  public upload: String = "../assets/upload.jpg";
  public style: String = "../assets/style.jpg";
  private email: String = "test.user@email.com";
  private password: String = "123456";
  constructor(private db: DBService, private user: UserService, private router: Router){}
  login = function(){
    console.log(this.user.isLoggedIn);
    // Take user information entered in fields and pass to DB service
    this.db.getUserREST(this.email, this.password).then(user => {
      // The user information matched a row in the DB so log the user in
      if(user != null){
        this.user.isLoggedIn = true;
        this.router.navigate(['home']);
      }
    });
  }
}
