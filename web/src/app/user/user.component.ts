/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the user profile component page.
 * Displays various information relating to the user's profile, including pictures they choose to display.
 * Only users may access this page.
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

import { Observable } from "rxjs/Observable";

// Import services to be used in order to retrieve data and interact with other parts of application
import { UserService } from '../services/user.service';
import { DBService } from '../services/db.service';
import { AuthService } from '../services/auth.service';

import { ModalComponent } from '../modal/app-modal.component';
import { PictureModalComponent } from '../modal/picture-modal.component';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['../css/app.component.css', '../css/user.component.css']
})
export class UserComponent {
  @ViewChild('modal') modal;
  @ViewChild('reportmodal') reportmodal;
  @ViewChild('confirmmodal') confirmmodal;
  userId: number; // id of user being displayed on profile
  firstName: string; // first name of user being displayed on profile
  lastName: string; // last name of user being displayed on profile
  email: string; // email of user being displayed on profile
  dateJoined: any; // date of account creation of user being displayed on profile
  placeholder: String = "../assets/ii_logo_black.png"; // default profile photo to be displayed if user does not have a profile picture
  isPaid: any; // flag for if user is a paid user
  dataReady = false; // flag for when data has been loaded and is ready to display
  photos: Array<Object> = []; // array of filepaths of images
  profilePhoto: String = this.placeholder; // user profile photo. initially set to the placeholder image
  modalPhoto: any = {}; // photo to be displayed in the modal
  form = {}; // structure to hold form information
  /**
   * Constructor which is called when page created.
   * Sets user's displayed photos to empty
   */
  constructor(private user: UserService, private route: ActivatedRoute, private router: Router, private db: DBService, private auth: AuthService){
    this.photos = [];
  }
  /** 
   * Displays picture that was clicked in a pop-up modal
  */
  showPicture(photo: Object): void {
    this.modalPhoto = photo;
    this.modal.show();
  }
  /**
   * Performs the report on the content in the modal being displayed
   */
  executeReport(): void {
    if(this.modalPhoto.photo_id != null){
      this.db.reportPhoto(this.modalPhoto.photo_id).then(res => {
      });
    }
    else if(this.modalPhoto.video_id != null){
      this.db.reportVideo(this.modalPhoto.video_id).then(res => {
      });
    }
  }
  /**
   * Called on page load
   * If a user id is passed to this page, that means we're viewing a user's profile, so load their information.
   * If no user id is passed, or the user id matches the id of the user currently logged in, then that means
   * we're viewing our own profile, so load our own information.
   */
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = null;
      this.photos = [];
      // No params were passed, or the user id is the current user's id, so display the logged in user's profile
      if(params.userId == null){
        this.user.refreshInfo().then(() => {
          this.userId = this.user.userId;
          this.firstName = this.user.firstName;
          this.lastName = this.user.lastName;
          this.email = this.user.email;
          this.dateJoined = this.user.dateJoined.substring(0, this.user.dateJoined.length - 14); // Cut off last 14 characters of date joined
          this.profilePhoto = this.user.profilePhoto;
          this.isPaid = this.user.isPaid;
          // Get the user's photos to display on profile
          this.db.getProfilePhotos(this.user.userId).then(res => {
            console.log("WEB: Get user's profile display photos");
            res = res.json();
            for(var photo of res){
              this.photos.push(photo);
            }
            // Get the user's videos to display on profile
            this.db.getProfileVideos(this.user.userId).then(res => {
              console.log("WEB: Get user's profile display videos");
              res = res.json();
              for(var video of res){
                this.photos.push(video);
              }
              this.dataReady = true; // Data has been fully received, display on page
            });
          });
        });
      }
      // Looking up a user so display their information on the page instead of the logged in user's information
      else{
        console.log("WEB: Looking up user...")
        // Params were passed, so set the page info to the user id's info so we can display it
        // Do DB call that returns user info given their user ID
        if(params.userId == this.user.userId){
          // The passed ID matches the user currently logged in, so just display their profile
          this.router.navigate(['user']);
        }
        else{
          this.db.getUser(params.userId).then(res => {
            this.firstName = res[0].first_name;
            this.lastName = res[0].last_name;
            this.email = res[0].email;
            this.dateJoined = res[0].date_joined.substring(0, res[0].date_joined.length - 14);
            if(res[0].profile_photo != null){ // Show placeholder if they do not have a profile picture
              this.profilePhoto = this.db.url + res[0].profile_photo;
            }
          });
          // Get the photos that user wants to display on their profile
          this.db.getProfilePhotos(params.userId).then(res => {
            console.log("WEB: Get user's profile display photos");
            res = res.json();
            for(var photo of res){
              this.photos.push(photo);
            }
            // Get the user's videos to display on profile
            this.db.getProfileVideos(params.userId).then(res => {
              console.log("WEB: Get user's profile display videos");
              res = res.json();
              for(var video of res){
                this.photos.push(video);
              }
              this.dataReady = true;
            });
          });
        }
      }
    });
  }
}
