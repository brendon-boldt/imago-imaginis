/**
 * This is the TypeScript backend for the library component.
 * Here, we reference library.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'library',
  templateUrl: './library.component.html',
  styleUrls: ['./app.component.css', './library.component.css']
})
export class LibraryComponent {
  constructor(private router: Router){}
  public placeholder: String = "../assets/placeholder.jpg";
  public keyboard: String = "../assets/keyboard.jpg";
  public upload: String = "../assets/upload.jpg";
  public style: String = "../assets/style.jpg";
  btnClick = function(){
    this.router.navigate(['login']);
  }
}
