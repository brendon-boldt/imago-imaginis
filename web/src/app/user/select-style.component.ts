/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { DBService } from '../services/db.service';

// Import the modal component
import { ModalComponent } from '../modal/app-modal.component';

@Component({
  selector: 'select-style',
  templateUrl: './select-style.component.html',
  styleUrls: ['../css/app.component.css', '../css/select-style.component.css']
})
export class SelectStyleComponent {
  @ViewChild('modal') modal;
  @ViewChild('uploading') uploading;
  freeUser: boolean = true;
  uploadImage: String = "../assets/monalisa.jpg";
  selectedStyle: Object = {"filter_id": "Select a style", "name":"Select a Style", "path":"../../assets/brush.png"};
  // styles: Array<Object> = [{"style":"Cubism", "example":"../assets/cubism.jpg"}, {"style":"Flowers", "example":"../assets/flowers.jpg"}, {"style":"Starry Night", "example":"../assets/starrynight.jpg"}, {"style":"Oil Painting", "example":"../assets/oil.jpg"}, {"style":"Impressionism", "example":"../assets/impress.jpg"}];
  styles: Array<Object> = null; // Comes from DB as [{"filter_id":1,"name":"VanGogh"},...]
  uploadedImage: File = null;
  filterToUpload: File;
  constructor(private us: UserService, private router: Router, private db: DBService){
    // Checks to see if the user uploaded a photo from the previous page
    if(this.us.uploadedPhoto != null){
      console.log("Photo user selected");
      console.log(this.us.uploadedPhoto);
      this.uploadedImage = this.us.uploadedPhoto;
      let reader = new FileReader();
      reader.onload = (e: any) => {
          this.uploadedImage = e.target.result;
      }
      reader.readAsDataURL(this.uploadedImage);
      // Gets list of filters/styles
      this.db.getFilters().then(filters => {
        this.styles = filters;
        console.log(this.styles);
      });
    }
    // // If user reloads the page, retrieve image from session storage, convert it from base64 and set it to the user service variable...
    // else if(sessionStorage.getItem('fileToUpload') !== undefined){
    //   console.log("User reloaded page");
    //   this.uploadedImage = JSON.parse(sessionStorage.getItem('fileToUpload'));
    //   let image = this.dataURLtoFile(this.uploadedImage, 'pic');
    //   this.us.uploadedPhoto = image;
    //   console.log(this.us.uploadedPhoto);
    // }
    // If the user has not uploaded a photo, redirect them to upload page
    else{
      this.router.navigate(['upload']);
    }
  }

  /**
   * This changes the style example image based on user selection
   */
  selectStyle = function(style) {
    this.selectedStyle = style;
    this.selectedStyle.path = this.db.url + "/" + this.selectedStyle.path;
    console.log(this.selectedStyle);
  }

  /**
   * This uploads the user photo with appropriate filter id to be styled with
   */
  upload = function() {
    if(this.selectedStyle.filter_id != "Select a Style"){
      // Calls the database service
      // While waiting for an upload response (aka upload finished), display an unremovable modal displaying upload status
      this.uploading.show();
      // Upload the filter if custom is selected
      if(this.selectedStyle.filter_id == "Upload a Style"){
        this.db.uploadFilter(this.filterToUpload, this.us.user_id).then(res => {
          // res._body returns the filter id that was just added
          // TODO: Display loading animation while uploading, stop when response received.
          this.db.uploadPhoto(this.us.user_id, this.us.uploadedPhoto, res._body).then(result => {
            // TODO: Display loading animation while uploading, stop when response received.
            // This should navigate the user to the library page, where it will show the status of the upload for the user
            this.router.navigate(['home']);
          });
        });
      }
      else{
        // TODO: Display loading animation while uploading, stop when response received.
        this.db.uploadPhoto(this.us.user_id, this.us.uploadedPhoto, this.selectedStyle['filter_id']).then(result => {
          // TODO: Display loading animation while uploading, stop when response received.
          // This should navigate the user to the library page, where it will show the status of the upload for the user
          this.router.navigate(['home']);
        });
      }
      
    }
    else{
      this.modal.show();
    }
  }

  /**
   * This event fires when a user uploads a filter
   * TODO: Change so that they can only upload photos. Put more checks!
   */
  fileChangeEvent = function(fileInput: any) {
    this.filterToUpload = fileInput.target.files[0];
    this.selectedStyle = {"filter_id": "Upload a Style", "name":"Upload a Style", "path":"../../assets/brush.png"};
    let reader = new FileReader();
    reader.onload = (e: any) => {
        this.selectedStyle.path = e.target.result;
    }
    reader.readAsDataURL(this.filterToUpload);
    // this.selectedStyle.path = this.filterToUpload;
    console.log(this.filterToUpload);
  }

  // This is used to convert a base-64 encoded string back into a File
  // Used for when the user reloads the page
  // dataURLtoFile(dataurl, filename) {
  //   var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  //       bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  //   while(n--){
  //       u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], filename, {type:mime});
  // }
}
