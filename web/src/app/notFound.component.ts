/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'notFound',
  templateUrl: './notFound.component.html',
  styleUrls: ['./app.component.css']
})
export class NotFoundComponent {
  constructor(private router: Router){}
  returnHome = function(){
    this.router.navigate(['home']);
  }
}
