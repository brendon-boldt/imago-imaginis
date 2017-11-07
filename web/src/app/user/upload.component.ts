/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
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
  fileToUpload: File;
  constructor(private router: Router, private db: DBService, private us: UserService, private gen: GeneralService){
    this.fileToUpload = null;
  }

  ngOnInit() {}
  
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
  upload(): void {
    console.log("Redirecting to select style...");
    // Set the photo selected to user.service so we can access it in next page
    this.us.uploadedPhoto = this.fileToUpload[0];
    // If video upload, let the general service know so we can display properly on next page
    this.gen.isVideoUpload = false;
    if(this.fileToUpload[0].type == "video/mp4"){
      this.gen.isVideoUpload = true;
    }

    // Also, put in user's local storage
    // let reader = new FileReader();
    // reader.onload = (e: any) => {
    //     sessionStorage.setItem('fileToUpload', JSON.stringify(e.target.result));
    // }
    // reader.readAsDataURL(this.fileToUpload[0]);
    
    // Navigate to style selection page
    this.router.navigate(['select-style']);
  }

}
