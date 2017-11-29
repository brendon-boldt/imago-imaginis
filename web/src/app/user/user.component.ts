/**
 * This is the TypeScript backend for the profile component.
 * Here, we reference profile.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

import { Observable } from "rxjs/Observable";

import { UserService } from '../services/user.service';
import { DBService } from '../services/db.service';

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
  public userId: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public dateJoined: any;
  public placeholder: String = "../assets/placeholder.jpg";
  outside: boolean = true;
  photos: Array<Object> = []; // array of filepaths of images
  profilePhoto: String = this.placeholder;
  modalPhoto: Object = {};
  constructor(private user: UserService, private route: ActivatedRoute, private router: Router, private db: DBService){
    this.photos = [];
  }
  /** 
   * Displays picture that was clicked in a pop-up modal
  */
  showPicture(photo: Object): void {
    this.modalPhoto = photo;
    this.modal.show();
  }
  ngOnInit() {
    console.log("INIT");
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.userId = null;
      this.photos = [];
      // No params were passed, or the user id is the current user's id, so display the logged in user's profile
      this.user.refreshInfo().then(() => {
        if(params.userId == null){
          this.userId = this.user.userId;
          this.firstName = this.user.firstName;
          this.lastName = this.user.lastName;
          this.email = this.user.email;
          this.dateJoined = this.user.dateJoined;
          this.profilePhoto = this.user.profilePhoto;
      // if(params.user_id == null){
      //   this.user_id = this.user.user_id;
      //   this.first_name = this.user.first_name;
      //   this.last_name = this.user.last_name;
      //   this.email = this.user.email;
      //   this.dateJoined = this.user.dateJoined;
      //   this.profilePhoto = this.user.profilePhoto;
        // var test = Observable.fromPromise(this.user.getProfilePhoto());
        // test.subscribe(res => {
        //   console.log(res);
        //   if(res != null){
        //     this.profilePhoto = res
        //   }
        // });
        // Get the user's photos to display on profile
        this.db.getProfilePhotos(this.user.userId).then(res => {
          console.log("WEB: Get user's profile display photos");
          res = res.json();
          for(var photo of res){
            console.log(photo);
            this.photos.push(photo);
          }
        });
        // Get the user's videos to display on profile
        this.db.getProfileVideos(this.user.userId).then(res => {
          console.log("WEB: Get user's profile display videos");
          res = res.json();
          for(var video of res){
            console.log(video);
            this.photos.push(video);
          }
        });
        }
      // Looking up a user so display their information on the page
      else{
        console.log("WEB: Looking up user...")
        // Params were passed, so set the page info to the user id's info so we can display it
        // Do DB call that returns user info given ID
        if(params.userId == this.user.userId){
          this.router.navigate(['user']);
        }
        else{
          this.db.getUser(params.userId).then(res => {
            console.log(res);
            this.firstName = res[0].first_name;
            this.lastName = res[0].last_name;
            this.email = res[0].email;
            this.dateJoined = res[0].date_joined;
            if(res[0].profile_photo != null){ // Show placeholder if they do not have a profile picture
              this.profilePhoto = this.db.url + res[0].profile_photo;
            }
          });
          // Get that user's profile photo
          // this.db.getProfilePhoto(params.user_id).then(res => {
          //   if(res.json()[0].profile_photo == null){ // The user had no profile picture
          //     console.log("User has no profile picture");
          //   }
          //   else{
          //     this.profilePhoto = this.db.url + res.json()[0].profile_photo;
          //     console.log(res.json());
          //     console.log(this.profilePhoto);
          //   }
          // });
          // Get the photos that user wants to display on their profile
          this.db.getProfilePhotos(params.userId).then(res => {
            console.log("WEB: Get user's profile display photos");
            res = res.json();
            for(var photo of res){
              console.log(photo);
              this.photos.push(photo);
            }
          });
          // Get the user's videos to display on profile
          this.db.getProfileVideos(params.userId).then(res => {
            console.log("WEB: Get user's profile display videos");
            res = res.json();
            for(var video of res){
              console.log(video);
              this.photos.push(video);
            }
          });
        }
      }
    });
    });
  }
}
