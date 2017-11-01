/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Importing database service so we can check to see if the user login information exists
import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';

// Import the modal component
import { ModalComponent } from '../modal/app-modal.component';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['../css/app.component.css']
})
export class UserSettingsComponent {
  @ViewChild('modal') modal;
  @ViewChild('modalUpgrade') modalUpgrade;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  fileToUpload: any;
  profilePhoto: any = '../../assets/placeholder.jpg';
  modalText: string;
  cardInfo: string;
  constructor(private router: Router, private db: DBService, private user: UserService){
    this.firstName = this.user.first_name;
    this.lastName = this.user.last_name;
    this.email = this.user.email;
    // Get the user's profile photo
    this.db.getProfilePhoto(this.user.user_id).then(res => {
      if(res._body == "[]"){ // The user had no profile picture
        console.log("User has no profile picture");
      }
      else{
        this.profilePhoto = this.db.url + "/" + res.json()[0].path;
        console.log(res.json());
        console.log(this.profilePhoto);
      }
    });
  }
  /**
   * Pops up a modal to allow the user to upgrade their account
   */
  upgradeAccount(): void {
    this.modalUpgrade.show();
  }
  /**
   * Front-end method to save changes to user account
   */
  save(): void {
    console.log("WEB: Saving user settings");
    this.db.saveUserSettings(this.user.user_id, this.firstName, this.lastName, this.email, this.password).then(res => {
      this.user.first_name = this.firstName;
      this.user.last_name = this.lastName;
      this.user.email = this.email;
      this.modalText = "User Settings Saved!";
      // Scroll user to top of page
      window.scrollTo(0, 0)
      this.modal.show();
    })
  }
  /**
   * Called when file is entered into upload
   */
  fileChangeEvent(fileInput: any): void {
    this.fileToUpload = fileInput.target.files[0];
    console.log(this.fileToUpload);
    this.uploadProfilePhoto();
  }
  /**
   * Submits the form when pressing the enter key
   */
  onKey(event: any): void {
    if(event.key == "Enter"){
      this.save();
    }
  }
  /**
   * Front-end performance of profile photo upload
   */
  uploadProfilePhoto(): void {
    // Uploading photo with no style
    this.db.uploadProfilePhoto(this.fileToUpload).then(result => {
      // Post shouldn't return anything
      console.log(result);
      this.modalText = "Profile Picture Updated!";
      this.modal.show();
      // Update the profile picture
      this.db.getProfilePhoto(this.user.user_id).then(res => {
        if(res._body == "[]"){ // The user had no profile picture
          console.log("User has no profile picture");
        }
        else{
          this.profilePhoto = this.db.url + "/" + res.json()[0].path;
          console.log(res.json());
          console.log(this.profilePhoto);
        }
      });
    });
  }
}
