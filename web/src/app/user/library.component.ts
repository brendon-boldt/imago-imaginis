/**
 * This is the TypeScript backend for the library component.
 * Here, we reference library.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';

import { ModalComponent } from '../modal/app-modal.component';
import { PictureModalComponent } from '../modal/picture-modal.component';

@Component({
  selector: 'library',
  templateUrl: './library.component.html',
  styleUrls: ['../css/app.component.css', '../css/library.component.css']
})
export class LibraryComponent {
  @ViewChild('modal') modal;
  @ViewChild('video') video;
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
  constructor(private router: Router, private db: DBService, private user: UserService, private elementRef: ElementRef){
    // Get user photos
    // this.photos = [];
    // this.photoArrOne = [];
    // this.photoArrTwo = [];
    // this.photoArrThree = [];
    // this.photoArrFour = [];
    this.getPictures();
  }
  getPictures(): void {
    // async function clear() {
    //   this.photos = await [];
    //   this.photoArrOne = await [];
    //   this.photoArrTwo = await [];
    //   this.photoArrThree = await [];
    //   this.photoArrFour = await [];
    // }
    // clear();
    // Get the user's styled photos and videos
    // Also, get their unstyled photos and videos, but overlay them with a processing image
    this.db.getStyledPhotos(this.user.user_id).then(res => {
      var styledRes = res.json();
      this.db.getUnStyledPhotos(this.user.user_id).then(res => {
        var unStyledRes = res.json();
        this.db.getStyledVideos(this.user.user_id).then(res => {
          var styledVidRes = res.json();
          this.db.getUnStyledVideos(this.user.user_id).then(res => {
            var unStyledVidRes = res.json();
            for(var photo of unStyledRes){
              console.log(photo);
              this.photos.push(photo);
            }
            for(var photo of unStyledVidRes){
              console.log(photo);
              this.photos.push(photo);
            }
            for(var photo of styledRes){
              console.log(photo);
              this.photos.push(photo);
            }
            for(var photo of styledVidRes){
              console.log(photo);
              this.photos.push(photo);
            }
            // Now, split the user's photos into 4 different arrays for display
            var arrNum = 0; var numOfArrs = 4; 
            while(arrNum < numOfArrs && this.photos.length != 0){
              this.photoArraysArray[arrNum].push(this.photos.pop());
              arrNum++;
              if(arrNum == numOfArrs){
                arrNum = 0;;
              }
            }
          })
        })
      });
    });
  }
  /** 
   * Displays picture that was clicked in a pop-up modal
  */
  showPicture(photo: Object): void {
    console.log(photo);
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
   * Deletes a photo
   */
  deletePhoto(): void {
    this.db.deletePhoto(this.user.user_id, this.modalPhoto['photo_id']).then(res => {
      console.log(res);
      // Update the library display
      // this.getPictures();
      location.reload();
    });
  }
  /**
   * Deletes a video
   */
  deleteVideo(): void {
    this.db.deleteVideo(this.user.user_id, this.modalPhoto['video_id']).then(res => {
      console.log(res);
      // Update the library display
      // this.getPictures();
      location.reload();
    });
  }
  /**
   * Sets the displayed photo to be displayed on the user's profile
   */
  displayPictureProfile() {
    if(this.modalPhoto['display']){
      this.db.setPhotoToDisplay(this.modalPhoto, "false").then(res => {
        this.buttonDisplay = "lightgrey";
        console.log(res);
        this.modalPhoto['display'] = false;
      });
    }
    else{
      this.db.setPhotoToDisplay(this.modalPhoto, "true").then(res => {
        this.buttonDisplay = "lightgreen";
        console.log(res);
        this.modalPhoto['display'] = true;
      });
    }
  }
  /**
   * Sets the displayed photo to be displayed on the user's profile
   */
  displayVideoProfile() {
    if(this.modalPhoto['display']){
      this.db.setVideoToDisplay(this.modalPhoto, "false").then(res => {
        this.buttonDisplay = "lightgrey";
        console.log(res);
        this.modalPhoto['display'] = false;
      });
    }
    else{
      this.db.setVideoToDisplay(this.modalPhoto, "true").then(res => {
        this.buttonDisplay = "lightgreen";
        console.log(res);
        this.modalPhoto['display'] = true;
      });
    }
  }
}
