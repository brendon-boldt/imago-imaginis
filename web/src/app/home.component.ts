/**
 * This is the TypeScript backend for the home component.
 * Here, we reference home.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { UserService } from './services/user.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./css/app.component.css']
})
export class HomeComponent {
  constructor(private router: Router, private user: UserService){}
  public keyboard: String = "../assets/keyboard.jpg";
  public upload: String = "../assets/upload.jpg";
  public style: String = "../assets/style.jpg";
  btnClick(): void {
    this.router.navigate(['upload']);
  }
  ngOnDestroy() {
    this.user.justLoggedIn = false;
  }
}
