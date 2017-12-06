/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the not found component page.
 * Displays when the user tries to load a page that doesn't exist in the web application
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
 */

import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'notFound',
  templateUrl: './notFound.component.html',
  styleUrls: ['./css/app.component.css']
})
export class NotFoundComponent {
  constructor(private router: Router){}
  /**
   * Returns the user to the home page when they click the return home button
   */
  returnHome = function(){
    this.router.navigate(['home']);
  }
}
