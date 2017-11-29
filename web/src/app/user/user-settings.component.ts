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
  modalText: string;
  cardInfo: string;
  constructor(private router: Router, private db: DBService, private user: UserService){
    // Set form info
    this.user.refreshInfo().then(() => {
        this.firstName = this.user.firstName;
        this.lastName = this.user.lastName;
        this.email = this.user.email;
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
    this.db.saveUserSettings(this.user.userId, this.firstName, this.lastName, this.email, this.password).then(res => {
      console.log(res.status)
      if(res.status == 401){
        // Email already exists
        this.modalText = "Email already registered. Please try again."
        window.scrollTo(0,0);
        this.modal.show();
      }
      else{
        this.user.firstName = this.firstName;
        this.user.lastName = this.lastName;
        this.user.email = this.email;
        this.modalText = "User Settings Saved!";
        this.user.refreshInfo;
        // Scroll user to top of page
        window.scrollTo(0, 0)
        this.modal.show();
      }
      // Relog the user in so JWT is updated
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
    this.db.uploadProfilePhoto(this.user.userId, this.fileToUpload).then(result => {
      // Post shouldn't return anything
      console.log(result);
      // this.user.getProfilePhoto();
      // Get the user's updated information
      this.user.refreshInfo();
      this.modalText = "Profile Picture Updated!";
      window.scrollTo(0, 0);
      this.modal.show();
    });
  }
}
