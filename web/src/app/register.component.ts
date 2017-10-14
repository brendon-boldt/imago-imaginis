/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./app.component.css']
})
export class RegisterComponent {
  constructor(private router: Router){}
  public keyboard: String = "../assets/keyboard.jpg";
  public upload: String = "../assets/upload.jpg";
  public style: String = "../assets/style.jpg";
  register = function(){
    this.router.navigate(['register']);
  }
}
