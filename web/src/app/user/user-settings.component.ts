/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the user settings component page.
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Importing services in order to receive data and interact with other services 
import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';

// Import the modal component
import { ModalComponent } from '../modal/app-modal.component';

// Import the validator. Used to validate credit card number
import validator from 'validator';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['../css/app.component.css']
})
export class UserSettingsComponent {
  @ViewChild('modal') modal;
  @ViewChild('modalUpgrade') modalUpgrade;
  firstName: string; // first name of user
  lastName: string; // last name of user
  email: string; // email of user 
  password: string; // password of user
  fileToUpload: any; // file user uploaded as profile picture
  modalText: string; // text to be displayed in the modal
  cardInfo: string = ""; // the card information passed to the user
  isValidCard: boolean = true; // flag for valid card
  form: any = {}; // holds information from form
  dataReady = false; // flag to let Angular know to load the page
  constructor(private router: Router, private db: DBService, private user: UserService){
    // Set form info
    this.user.refreshInfo().then(() => {
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.email = this.user.email;
      this.form.firstName = this.user.firstName;
      this.form.lastName = this.user.lastName;
      this.form.email = this.user.email;
      this.dataReady = true;
    });
  }

  /**
   * Pops up a modal to allow the user to upgrade their account
   */
  showUpgradeAccount(): void {
    this.modalUpgrade.show();
  }
  
  /**
   * Processes payment and upgrades account
   */
  processUpgradeAccount(): void {
    if (validator.isCreditCard(this.cardInfo) === false) { // Validate credit card information
      console.log("WEB: Invalid credit card info");
      this.isValidCard = false;
      return;
    }
    this.modalUpgrade.hide();
    this.db.upgradeUser(this.user.userId).then(res => {
        if (res.status == 201) {
          // Unauthorized API request
          this.modalText = "Unauthorized API request."
          window.scrollTo(0, 0);
          this.modal.show();
        } else if (res.status == 303) {
          // Unauthorized: Free User
          this.modalText = "Unauthorized: Free User."
          window.scrollTo(0, 0);
          this.modal.show();
        } else if (res.status == 307) {
          // Account add error
          this.modalText = "Error: user could not be upgraded. Please try again."
          window.scrollTo(0, 0);
          this.modal.show();
        } else if (res.status == 421) {
          // User already paid account
          this.modalText = "Error: user is already paid account"
          window.scrollTo(0, 0);
          this.modal.show();
        } else {
          this.modalText = "Account has been upgraded!";
          this.user.refreshInfo();
          // Scroll user to top of page
          window.scrollTo(0, 0)
          this.modal.show();
        }
      }
    )
  }
  
  /**
   * Front-end method to save changes to user account
   */
  save(): void {
    console.log("WEB: Saving user settings");
    this.db.saveUserSettings(this.user.userId, this.form.firstName, this.form.lastName, this.form.email, this.password).then(res => {
      if(res.status == 401){
        // Email already exists
        this.modalText = "Email already registered. Please try again."
        window.scrollTo(0,0);
        this.modal.show();
      }
      else if(res.status == 409){
        // Invalid email
        this.modalText = "Please enter a valid email."
        window.scrollTo(0,0);
        this.modal.show();
      }
      else{
        // User setting modification was successful
        this.modalText = "User Settings Saved!";
        this.user.refreshInfo();
        // Scroll user to top of page
        window.scrollTo(0, 0)
        this.modal.show();
      }
    })
  }
  /**
   * Called when file is entered into upload
   * Verify that the file they upload is indeed a photo
   */
  fileChangeEvent(fileInput: any): void {
    this.fileToUpload = fileInput.target.files[0];
    // Verify their upload file type. Only allow .jpg or .png
    if(this.fileToUpload.type == "image/jpeg" || this.fileToUpload.type == "image/png"){
      this.uploadProfilePhoto();
    }
    else{
      this.modalText = "Error: Filetypes accepted: JPG or PNG.";
      this.modal.show();
    }
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
      // Refresh the user's information
      this.user.refreshInfo();
      this.modalText = "Profile Picture Updated!";
      window.scrollTo(0, 0);
      this.modal.show();
    });
  }
}
