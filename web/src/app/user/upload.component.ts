/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Importing database service so we can upload an image to the database
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
  fileToUpload: File;
  modalText: String;
  constructor(private router: Router, private db: DBService, private us: UserService, private gen: GeneralService){
    this.fileToUpload = null;
  }

  ngOnInit() {
    // Check to see if the user already has two photos if they're a free user
    this.db.getNumPhotos(this.us.userId).then(async res => {
      if(res.status == 605){
        this.modalText = "You have reached your maximum number of uploaded photos. Please delete some photos before continuing, or upgrade your account. You will be redirected automatically in 10 seconds...";
        this.modal.show();
        var router = this.router;
        setTimeout(function(){
          router.navigate(['home']);
        }, 10000);
        
      }
    })
  }
  
  btnClick(): void {
    this.router.navigate(['select-style']);
  }
  /**
   * This event fires when a user uploads a file
   * TODO: Change so that they can only upload photos. Put more checks!
   */
  fileChangeEvent(fileInput: any): void {
    this.fileToUpload = fileInput.target.files;
    console.log(this.fileToUpload);
    this.upload();
  }
  /**
   * Performs necessary file conversions for display and takes user to next page
   */
  upload(): void {
    console.log("Redirecting to select style...");
    // Set the photo selected to user.service so we can access it in next page
    this.us.uploadedPhoto = this.fileToUpload[0];
    // If video upload, let the general service know so we can display properly on next page
    this.gen.isVideoUpload = false;
    if(this.fileToUpload[0].type == "video/mp4"){
      this.gen.isVideoUpload = true;
    }
    // We need to convert this to base 64 so that we can display it on the page
    let reader = new FileReader();
    reader.onload = (e: any) => {
        this.gen.uploadedImage = e.target.result;
        // Navigate to style selection page
        this.router.navigate(['select-style']);
    }
    // reader.readAsDataURL(this.uploadedImage);
    reader.readAsDataURL(this.us.uploadedPhoto);
  }

}
