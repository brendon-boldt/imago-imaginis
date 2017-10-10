/**
 * This is the TypeScript backend for the home component.
 * Here, we reference home.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./app.component.css']
})
export class HomeComponent {
  constructor(private router: Router){}
  public keyboard: String = "../assets/keyboard.jpg";
  public upload: String = "../assets/upload.jpg";
  public style: String = "../assets/style.jpg";
  public one: String = "../assets/chicago_cropped.jpg";
  public two: String = "../assets/sailboat_cropped.jpg";
  public three: String = "../assets/modern_cropped.jpg";
  public four: String = "../assets/cornell_cropped.jpg";
  btnClick = function(){
    this.router.navigate(['login']);
  }
}
