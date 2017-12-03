/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Importing database service so we can check to see if the user login information exists
import { DBService } from './services/db.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

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
  public keyboard: String = "../assets/keyboard.jpg";
  public upload: String = "../assets/upload.jpg";
  public style: String = "../assets/style.jpg";
  private email: string;
  private password: string;
  form: any = {};
  constructor(private db: DBService, private user: UserService, private router: Router, private auth: AuthService){
    if(this.auth.isLoggedIn){
      this.router.navigate(['home']);
    }
  }
  onSubmit() {
    this.login();
  }
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
   */
  onKey(event: any): void {
    if(event.key == "Enter"){
      this.login();
    }
  }
}
