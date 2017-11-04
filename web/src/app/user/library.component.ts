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
  // All the photos pulled from the database
  photos: Array<Object> = [];
  public placeholder: String = "../assets/placeholder.jpg";
  // These are used for displaying the photos properly on the page
  photoArrOne: Array<Object> = [];
  photoArrTwo: Array<Object> = [];
  photoArrThree: Array<Object> = [];
  photoArrFour: Array<Object> = [];
  photoArraysArray: Array<Array<Object>> = [this.photoArrOne, this.photoArrTwo, this.photoArrThree, this.photoArrFour]
  constructor(private router: Router, private db: DBService, private user: UserService){
    // Get the user's styled photos
    this.db.getStyledPhotos(this.user.user_id).then(res => {
      res = res.json();
      for(var photo of res){
        console.log(photo);
        this.photos.push(photo);
      }
      // Now, split the user's photos into 4 different arrays
      var arrNum = 0; var numOfArrs = 4; 
      while(arrNum < numOfArrs && this.photos.length != 0){
        this.photoArraysArray[arrNum].push(this.photos.pop());
        arrNum++;
        if(arrNum == numOfArrs){
          arrNum = 0;;
        }
      }
    });
  }
}
