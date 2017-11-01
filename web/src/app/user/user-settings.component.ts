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
  constructor(private router: Router, private db: DBService){}
  public keyboard: String = "../assets/keyboard.jpg";
  public upload: String = "../assets/upload.jpg";
  public style: String = "../assets/style.jpg";
  fileToUpload: any;
  upgradeAccount = function() {
    this.router.navigate(['upgradeAccount']);
  }
  save = function() {
	console.log("save settings");
  }
  fileChangeEvent(fileInput: any): void {
    this.fileToUpload = fileInput.target.files[0];
    console.log(this.fileToUpload);
    this.uploadProfilePhoto();
  }
  uploadProfilePhoto(): void {
    // Uploading photo with no style
    this.db.uploadProfilePhoto(this.fileToUpload).then(result => {
      // Post shouldn't return anything
      console.log(result);
      this.modal.show();
    });
  }
}
