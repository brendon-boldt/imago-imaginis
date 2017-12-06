/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the library component page.
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Services used on this page
import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';
import { GeneralService } from '../services/general.service';
import { LibraryService } from '../services/library.service';

// Components used on this page
import { ModalComponent } from '../modal/app-modal.component';
import { PictureModalComponent } from '../modal/picture-modal.component';

// Other libraries used for subscribing to the library service
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
  photos: Array<Object> = []; // array of all photos received from library service
  placeholder: String = "../assets/ii_logo_black.png"; // placeholder for images displayed in library
  subscription: Subscription; // subscribing to library service data refresh
  timerSubscription: Subscription; // subscribing to a timer that polls database for changes
  // These are used for displaying the photos properly on the page
  photoArrOne: Array<Object> = []; // column one photos
  photoArrTwo: Array<Object> = []; // column two photos
  photoArrThree: Array<Object> = []; // column three photos
  photoArrFour: Array<Object> = []; // column four photos
  photoArraysArray: Array<Array<Object>> = [this.photoArrOne, this.photoArrTwo, this.photoArrThree, this.photoArrFour];
  modalPhoto: any = {}; // The photo to be displayed in the modal
  buttonDisplay: String = ""; // Color differently depending on if photo is displayed on user profile or not
  dataReady: boolean = false; // Flag to determine if data is ready to be displayed on the page
  rerender: boolean = false; // Flag to determine if photo/video in modal is to be rerendered
  constructor(private router: Router, private db: DBService, private user: UserService, private lib: LibraryService){}
  /**
   * Called when library is loaded
   */
  ngOnInit() {
    this.loadPics(true); // first time loading the library, so pass in true
  }
  /**
   * Creates a subscription to the library service to get user content.
   * Must be a subscription, otherwise data will not be loaded properly
   * @param firstload true or false if first time loading the library
   */
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
  /**
   * This creates a timer subscirption such that data is refreshed every 5 seconds
   */
  refreshData() {
    this.timerSubscription = Observable.timer(5000).first().subscribe(() => this.loadPics(false));
  }
  /**
   * Called when page is unloaded. We unsubscribe from services in order to prevent memory leaks.
   */
  ngOnDestroy() {
    // Prevent memory leaks
    this.subscription.unsubscribe();
    this.timerSubscription.unsubscribe();
  }
  /** 
   * Displays picture that was clicked in a pop-up modal
   * @param photo the photo that was clicked that will be displayed in the modal
  */
  showPicture(photo: Object): void {
    this.rerender = true;
    this.modalPhoto = photo;
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
   * Deletes a photo that is being displayed in the modal
   */
  deletePhoto(): void {
    this.db.deletePhoto(this.user.userId, this.modalPhoto['photo_id']).then(res => {
      console.log("WEB: Performing delete of photo");
      // Update the library display by clearing arrays and resubscribing
      this.subscription.unsubscribe();
      this.timerSubscription.unsubscribe();
      this.photoArrOne = [];
      this.photoArrTwo = [];
      this.photoArrThree = [];
      this.photoArrFour = [];
      this.loadPics(false);
      this.modal.hide();
    });
  }
  /**
   * Deletes a video that is being displayed in the modal
   */
  deleteVideo(): void {
    this.db.deleteVideo(this.user.userId, this.modalPhoto['video_id']).then(res => {
      console.log("WEB: Performing delete of video");
      // Update the library display by clearing arrays and resubscribing
      this.subscription.unsubscribe();
      this.timerSubscription.unsubscribe();
      this.photoArrOne = [];
      this.photoArrTwo = [];
      this.photoArrThree = [];
      this.photoArrFour = [];
      this.loadPics(false);
      this.modal.hide();
    });
  }
  /**
   * Sets the photo to be displayed on the user's profile
   */
  displayPictureProfile() {
    console.log("WEB: Setting photo display");
    if(this.modalPhoto['display']){
      this.db.setPhotoToDisplay(this.modalPhoto, "false").then(res => {
        this.buttonDisplay = "lightgrey";
        this.modalPhoto['display'] = false;
      });
    }
    else{
      this.db.setPhotoToDisplay(this.modalPhoto, "true").then(res => {
        this.buttonDisplay = "lightgreen";
        this.modalPhoto['display'] = true;
      });
    }
  }
  /**
   * Sets the video to be displayed on the user's profile
   */
  displayVideoProfile() {
    console.log("WEB: Setting video display");
    if(this.modalPhoto['display']){
      this.db.setVideoToDisplay(this.modalPhoto, "false").then(res => {
        this.buttonDisplay = "lightgrey";
        this.modalPhoto['display'] = false;
      });
    }
    else{
      this.db.setVideoToDisplay(this.modalPhoto, "true").then(res => {
        this.buttonDisplay = "lightgreen";
        this.modalPhoto['display'] = true;
      });
    }
  }
}
