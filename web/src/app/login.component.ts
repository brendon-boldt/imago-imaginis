/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the login component page.
 * Allows user to enter credentials, or allows them to create a new account
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Importing services so we can import data and communicate with other parts of the application
import { DBService } from './services/db.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

// Import custom directives
import { FocusDirective } from './directives/focus.directive';

// Import the modal component
import { ModalComponent } from './modal/app-modal.component';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./css/app.component.css']
})
export class LoginComponent {
  @ViewChild('modal') modal;
  // Images to display on the login page
  keyboard: String = "../assets/keyboard.jpg";
  upload: String = "../assets/upload.jpg";
  style: String = "../assets/style.jpg";
  email: string; // email that the user has entered
  password: string; // password that the user has entered
  form: any = {}; // object to hold the form data
  /**
   * Constructor for the page. If the user accesses this page while logged in already, they will be navigated
   * to the home page.
   */
  constructor(private db: DBService, private user: UserService, private router: Router, private auth: AuthService){
    if(this.auth.isLoggedIn){
      this.router.navigate(['home']);
    }
  }
  /**
   * Fires when the user clicks the submit button
   */
  onSubmit() {
    this.login();
  }
  /**
   * Performs the user login, passing credentials to the auth service which will call the DB to see if
   * their credentials match an entry in the DB
   */
  login(): void {
    async function func(auth, email, password, modal) {
      var login = await auth.login(email, password);
      if(!login){
        console.log('WEB: Login failed');
        modal.show();
      }
      else{
        console.log('WEB: Login was a success!');
      }
    }
    func(this.auth, this.form.email, this.form.password, this.modal);
  }
  /**
   * Submits the form when pressing the enter key
   * TODO: is this really needed?
   */
  onKey(event: any): void {
    if(this.form.valid){
      if(event.key == "Enter"){
        this.login();
      }
    }
  }
}
