/**
 * This is the TypeScript backend for the library component.
 * Here, we reference library.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'library',
  templateUrl: './library.component.html',
  styleUrls: ['../css/app.component.css', '../css/library.component.css']
})
export class LibraryComponent {
  public placeholder: String = "../assets/placeholder.jpg";
  constructor(private router: Router, private db: DBService, private user: UserService){
    this.db.getStyledPhotos(this.user.user_id).then(res => {
      console.log(res);
    })
  }
}
