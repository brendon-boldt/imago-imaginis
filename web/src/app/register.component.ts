/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the register component page.
 * Allows the user to enter their information in order to create an account for the website.
 * User must enter all information and check the age gate in order to register
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Import services in order to import data and interact with other parts of application
import { UserService } from './services/user.service';
import { DBService } from './services/db.service';
import { AuthService } from './services/auth.service';

// Import the modal component so we can display modals
import { ModalComponent } from './modal/app-modal.component';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./css/app.component.css']
})
export class RegisterComponent {
  @ViewChild('modal') modal; // modal to display on page
  age: any; // age gate
  errorText: String; // text to display in the modal showing that the user misentered information
  form: any = {}; // object to hold form data
  // Images to display on the page
  keyboard: String = "../assets/keyboard.jpg";
  upload: String = "../assets/upload.jpg";
  style: String = "../assets/style.jpg";
  constructor(private router: Router, private user: UserService, private db: DBService, private auth: AuthService){}

  /**
   * Registers the user
   */
  register(): void{
    // Create a new user entry in the database
    if(this.age){
      this.db.createUser(this.form.firstName, this.form.lastName, this.form.email, this.form.password).then(result => {
        if(result.status == 401){
          this.errorText = "Sorry, this email is already registered.";
          this.modal.show();
        }
        else if(result.status == 408){
          this.errorText = "Please enter a valid email.";
          this.modal.show();
        }
        else if(result.status == 406){
          this.errorText = "Please enter valid information into the fields.";
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
