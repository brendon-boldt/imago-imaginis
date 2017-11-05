/**
 * This is the TypeScript backend for the library component.
 * Here, we reference library.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';

import { ModalComponent } from '../modal/app-modal.component';

@Component({
  selector: 'library',
  templateUrl: './library.component.html',
  styleUrls: ['../css/app.component.css', '../css/library.component.css']
})
export class LibraryComponent {
  @ViewChild('modal') modal;
  // All the photos pulled from the database
  photos: Array<Object> = [];
  public placeholder: String = "../assets/placeholder.jpg";
  // These are used for displaying the photos properly on the page
  photoArrOne: Array<Object> = [];
  photoArrTwo: Array<Object> = [];
  photoArrThree: Array<Object> = [];
  photoArrFour: Array<Object> = [];
  photoArraysArray: Array<Array<Object>> = [this.photoArrOne, this.photoArrTwo, this.photoArrThree, this.photoArrFour];
  modalPhoto: Object = {}; // The photo to be displayed in the modal
  buttonDisplay: String = ""; // Color differently depending on if photo is displayed on user profile or not
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
  /** 
   * Displays picture that was clicked in a pop-up modal
  */
  showPicture(photo: Object): void {
    this.modalPhoto = photo;
    if(photo['display']){
      this.buttonDisplay = "lightgreen";
    }
    else{
      this.buttonDisplay = "lightgrey";
    }
    this.modal.show();
  }
  /**
   * Sets the displayed photo to be displayed on the user's profile
   */
  displayProfile() {
    if(this.modalPhoto['display']){
      this.db.setToDisplay(this.modalPhoto, "false").then(res => {
        this.buttonDisplay = "lightgrey";
        console.log(res);
        this.modalPhoto['display'] = false;
      });
    }
    else{
      this.db.setToDisplay(this.modalPhoto, "true").then(res => {
        this.buttonDisplay = "lightgreen";
        console.log(res);
        this.modalPhoto['display'] = true;
      });
    }
  }
}
