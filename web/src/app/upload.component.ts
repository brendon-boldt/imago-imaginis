/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Importing database service so we can upload an image to the database
import { DBService } from './services/db.service';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./app.component.css']
})
export class UploadComponent {
  fileToUpload: File;
  constructor(private router: Router, private db: DBService){
    this.fileToUpload = null;
  }
  btnClick = function() {
    this.router.navigate(['select-style']);
  }
  // Fires when user uploads a file
  // Change so that they can only upload photos
  fileChangeEvent(fileInput: any){
    this.fileToUpload = fileInput.target.files;
    console.log(this.fileToUpload);
    this.upload();
  }
  upload = function() {
    console.log("Uploading...");
    this.db.uploadPhoto(this.fileToUpload).then(result => {
      console.log(result);
      this.router.navigate(['select-style']);
    });
  }

}
