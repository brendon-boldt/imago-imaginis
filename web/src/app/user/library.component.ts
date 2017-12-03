/**
 * This is the TypeScript backend for the library component.
 * Here, we reference library.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';
import { GeneralService } from '../services/general.service';
import { LibraryService } from '../services/library.service';

import { ModalComponent } from '../modal/app-modal.component';
import { PictureModalComponent } from '../modal/picture-modal.component';

import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'library',
  templateUrl: './library.component.html',
  styleUrls: ['../css/app.component.css', '../css/library.component.css', '../css/scrollbar.css']
})
export class LibraryComponent {
  @ViewChild('modal') modal;
  @ViewChild('video') video;
  // Holder for photos pulled from the database
  photos: Array<Object> = [];
  public placeholder: String = "../assets/ii_logo_black.png";
  subscription: Subscription;
  timerSubscription: Subscription;
  // These are used for displaying the photos properly on the page
  photoArrOne: Array<Object> = [];
  photoArrTwo: Array<Object> = [];
  photoArrThree: Array<Object> = [];
  photoArrFour: Array<Object> = [];
  photoArraysArray: Array<Array<Object>> = [this.photoArrOne, this.photoArrTwo, this.photoArrThree, this.photoArrFour];
  modalPhoto: any = {}; // The photo to be displayed in the modal
  buttonDisplay: String = ""; // Color differently depending on if photo is displayed on user profile or not
  dataReady = false;
  rerender = false;
  constructor(private router: Router, private db: DBService, private user: UserService, private lib: LibraryService){}
  ngOnInit() {
    this.loadPics(true);
  }
  loadPics(firstload: boolean) {
    this.subscription = this.lib.getPictures(firstload).subscribe(res => {
        this.photoArraysArray = res;
        this.photoArrOne = this.photoArraysArray[0];
        this.photoArrTwo = this.photoArraysArray[1];
        this.photoArrThree = this.photoArraysArray[2];
        this.photoArrFour = this.photoArraysArray[3];
        this.dataReady = true;
    });
    this.refreshData();
  }
  refreshData() {
    // Refresh the data every 5 seconds
    this.timerSubscription = Observable.timer(5000).first().subscribe(() => this.loadPics(false));
  }
  ngOnDestroy() {
    // Prevent memory leaks
    this.subscription.unsubscribe();
    this.timerSubscription.unsubscribe();
  }
  /** 
   * Displays picture that was clicked in a pop-up modal
  */
  showPicture(photo: Object): void {
    this.rerender = true;
    this.modalPhoto = photo;
    console.log(this.modalPhoto);
    if(photo['display']){
      this.buttonDisplay = "lightgreen";
    }
    else{
      this.buttonDisplay = "lightgrey";
    }
    setTimeout(() => this.modal.show(), 5);
    setTimeout(() => this.rerender = false, 5);
  }
  /**
   * Deletes a photo
   */
  deletePhoto(): void {
    this.db.deletePhoto(this.user.userId, this.modalPhoto['photo_id']).then(res => {
      console.log(res);
      // Update the library display
      this.subscription.unsubscribe();
      this.timerSubscription.unsubscribe();
      this.photoArrOne = [];
      this.photoArrTwo = [];
      this.photoArrThree = [];
      this.photoArrFour = [];
      this.loadPics(false);
      this.modal.hide();
      // this.getPictures();
      // location.reload();
    });
  }
  /**
   * Deletes a video
   */
  deleteVideo(): void {
    this.db.deleteVideo(this.user.userId, this.modalPhoto['video_id']).then(res => {
      console.log(res);
      // Update the library display
      this.subscription.unsubscribe();
      this.timerSubscription.unsubscribe();
      this.photoArrOne = [];
      this.photoArrTwo = [];
      this.photoArrThree = [];
      this.photoArrFour = [];
      this.loadPics(false);
      this.modal.hide();
      // this.getPictures();
      // location.reload();
    });
  }
  /**
   * Sets the displayed photo to be displayed on the user's profile
   */
  displayPictureProfile() {
    console.log("HWEY");
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
