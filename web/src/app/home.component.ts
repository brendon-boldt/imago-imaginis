/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the home component page.
 * Displays general information about the site and a button to direct them to either the upload page or the login page
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
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
  // Images to display on the home page
  keyboard: String = "../assets/keyboard.jpg";
  upload: String = "../assets/upload.jpg";
  style: String = "../assets/style.jpg";
  /**
   * Constructor for the home page
   */
  constructor(private router: Router, private user: UserService){}
  /**
   * Called when the 'Get Started' button is clicked
   */
  btnClick(): void {
    this.router.navigate(['upload']);
  }
  /**
   * When user navigates away from the page and they had just logged in, set the justLoggedIn flag to false.
   * Prevents login alert from showing up again after they've logged in.
   */
  ngOnDestroy() {
    this.user.justLoggedIn = false;
  }
}
