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
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./app.component.css']
})
export class UserSettingsComponent {
  constructor(private router: Router){}
  public keyboard: String = "../assets/keyboard.jpg";
  public upload: String = "../assets/upload.jpg";
  public style: String = "../assets/style.jpg";
  upgradeAccount = function(){
    this.router.navigate(['upgradeAccount']);
  }
  save = function(){
	console.log("save settings");
  }
}
