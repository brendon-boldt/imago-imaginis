/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the upload component page.
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Import services we need to communicate with the rest of the application
import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['../css/app.component.css']
})
export class UploadComponent {
  @ViewChild('modal') modal;
  @ViewChild('typemodal') typemodal;
  fileToUpload: File; // the file that the user selects in upload window
  modalText: String; // text to be displayed in the modal
  loadingImage = false; // flag to display image loading into the platform
  
  /**
   * Constructor for page. Sets fileToUpload to null, clearing out previously uploaded photo
   */
  constructor(private router: Router, private db: DBService, private us: UserService, private gen: GeneralService){
    this.fileToUpload = null;
  }

  /**
   * Called on page load
   * Displays a modal that notifies free users, if they have > 2 photos, that they must
   * delete some photos or upgrade
   */
  ngOnInit() {
    // Check to see if the user already has two photos if they're a free user
    this.db.getNumPhotos(this.us.userId).then(async res => {
      if(res.status == 605){
        this.modalText = "You have reached your maximum number of uploaded photos. Please delete some photos before continuing, or upgrade your account.";
        this.modal.show();
        return;
      }
    });
  }

  /**
   * This event fires when a user uploads a file
   * Also, if they're a paid user, allow them to upload videos.
   * If they're a free user, make sure they don't have more than 2 photos already on the platform
   * 
   */
  fileChangeEvent(fileInput: any): void {
    // Check to see if the user already has two photos if they're a free user
    this.db.getNumPhotos(this.us.userId).then(async res => {
      if(res.status == 605){
        this.modalText = "You have reached your maximum number of uploaded photos. Please delete some photos before continuing, or upgrade your account.";
        this.modal.show();
        return;
      }
      else{
        this.fileToUpload = fileInput.target.files;
        // If they're a free user, don't allow them to upload videos
        if(this.us.isPaid == true){
          // Verify their upload file type. Only allow .jpg or .png or .mp4
          if(this.fileToUpload[0].type == "image/jpeg" || this.fileToUpload[0].type == "image/png" || this.fileToUpload[0].type == "video/mp4"){
            this.upload();
          }
          else{
            this.modalText = "Error: Filetypes accepted: JPG, PNG, MP4";
            this.typemodal.show();
          }
        }
        else{
          // Verify their upload file type. Only allow .jpg or .png
          if(this.fileToUpload[0].type == "image/jpeg" || this.fileToUpload[0].type == "image/png"){
            this.upload();
          }
          else{
            this.modalText = "Error: Filetypes accepted: JPG or PNG. Upgrade your account to upload videos!";
            this.typemodal.show();
          }
        }
      }
    });
  }

  /**
   * Performs necessary file conversions for display and takes user to next page
   */
  upload(): void {
    this.loadingImage = true;
    // Set the photo uploaded to user.service so we can access it in next page
    this.us.uploadedPhoto = this.fileToUpload[0];
    // If video upload, let the general service know so we can display it properly on next page
    this.gen.isVideoUpload = false;
    if(this.fileToUpload[0].type == "video/mp4"){
      this.gen.isVideoUpload = true;
    }
    // We need to convert this to base 64 so that we can display it on the page
    let reader = new FileReader();
    reader.onload = (e: any) => {
        this.gen.uploadedImage = e.target.result;
        // Navigate to style selection page once image fully uploaded
        this.router.navigate(['select-style']);
    }
    reader.readAsDataURL(this.us.uploadedPhoto);
  }
}
