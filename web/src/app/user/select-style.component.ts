/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the style selection component page.
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
 */
import { Component, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Services used by component
import { UserService } from '../services/user.service';
import { DBService } from '../services/db.service';
import { GeneralService } from '../services/general.service';

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
  selectedStyle: Object = {"filter_id": "Select a style", "name":"Select a Style", "path":"../../assets/brush.png"};
  styles: Array<any> = null; // Comes from DB as [{"filter_id":1,"name":"VanGogh"},...]
  filterToUpload: File; // file that was selected to be used as filter
  modalText: String; // Text to be displayed in the modal 
  uploadingFilter: boolean = false; // used for displaying loading animation when user uploads their own filter
  video: any; // unused
  freeUser: boolean = true; // unused
  /**
   * Constructor for the page. Checks to make sure the user has uploaded a photo before allowing them
   * to choose a style for it.
   */
  constructor(private us: UserService, private router: Router, private db: DBService, private gen: GeneralService){
    // Checks to see if the user uploaded a photo from the previous page
    if(this.us.uploadedPhoto != null){
      // Gets list of filters/styles
      this.db.getFilters().then(filters => {
        this.styles = filters;
        // Convert paths
        for(var i=0; i<this.styles.length; i++){
          this.styles[i].path = this.db.url + this.styles[i].path;
        }
      });
    }
    // If the user has not uploaded a photo, redirect them to upload page
    // This prevents users from navigating directly to the select-style page without first uploading a photo
    // through the upload page
    else{
      this.router.navigate(['upload']);
    }
  }

  /**
   * This changes the style example image based on user selection
   */
  selectStyle = function(style) {
    this.selectedStyle = style;
  }

  /**
   * This uploads the user photo with appropriate filter id to be styled with
   */
  upload = function() {
    // Check to see if the user already has two photos if they're a free user
    this.db.getNumPhotos(this.us.userId).then(async res => {
      if(res.status == 605){
        this.modalText = "You have reached your maximum number of uploaded photos. Please delete some photos before continuing, or upgrade your account.";
        this.uploading.show();
        var router = this.router;
        return;
      }
      if(this.selectedStyle.filter_id != "Select a style"){
        // Calls the database service
        // While waiting for an upload response (aka upload finished), display an unremovable modal displaying upload status
        this.modalText = "Uploading, please wait!";
        this.uploading.show();
        // If the file being uploaded is a video, then...
        if(this.gen.isVideoUpload){
          // Used to get dimensions of the video uploaded
          // Upload the filter if custom is selected
          if(this.selectedStyle.filter_id == "uploadStyle"){
            this.db.uploadFilter(this.filterToUpload, this.us.userId).then(res => {
              // res._body returns the filter id that was just added
              // TODO: Display loading animation while uploading, stop when response received.
              this.db.uploadVideo(this.us.userId, this.us.uploadedPhoto, res._body).then(result => {
                this.router.navigate(['library']);
              });
            });
          }
          else{
            this.db.uploadVideo(this.us.userId, this.us.uploadedPhoto, this.selectedStyle['filter_id']).then(result => {
              this.router.navigate(['library']);
            });
          }
        }
        else{
          // Used to get dimensions of the photo uploaded
          var img = new Image();
          img.src = this.gen.uploadedImage;
          // Upload the filter if custom is selected
          if(this.selectedStyle.filter_id == "uploadStyle"){
            this.db.uploadFilter(this.filterToUpload, this.us.userId).then(res => {
              this.db.uploadPhoto(this.us.userId, this.us.uploadedPhoto, res._body, img).then(result => {
                if(result.status == 501){
                  // File size was too large
                  this.modalText = "Max image file size exceeded! 7MB max.";
                  this.uploading.hide();
                  this.modal.show();
                }
                else{
                  this.router.navigate(['library']);
                }
              });
            });
          }
          // If the user uploads a photo with a preset filter
          else{
            this.db.uploadPhoto(this.us.userId, this.us.uploadedPhoto, this.selectedStyle['filter_id'], img).then(result => {
              if(result.status == 501){
                // File size was too large
                this.modalText = "Max image file size exceeded! 7MB max.";
                this.uploading.hide();
                this.modal.show();
              }
              else{
                this.router.navigate(['library']);
              }
            });
          }
        }
      }
      else{
        this.modalText = "Please select a style!";
        this.modal.show();
      }
    });
  }

  /**
   * This event fires when a user uploads a filter.
   * Verify their upload file type. Only allow .jpg or .png
   * If incorrect file type, display error to the user
   */
  fileChangeEvent = function(fileInput: any) {
    if(fileInput.target.files[0].type == "image/jpeg" || fileInput.target.files[0].type == "image/png"){
      this.filterToUpload = fileInput.target.files[0];
      this.uploadingFilter = true; // The filter is being loaded into the page
      this.selectedStyle = {"filter_id": "uploadStyle", "name":"Upload a Style", "path":"../../assets/brush.png"};
      let reader = new FileReader();
      reader.onload = (e: any) => {
          this.selectedStyle.path = e.target.result;
          this.uploadingFilter = false; // the filter has finished loading into the page
      }
      reader.readAsDataURL(this.filterToUpload);
    }
    else{
      this.modalText = "Error: Filetypes accepted: JPG or PNG";
      this.modal.show();
    }
  }
}
