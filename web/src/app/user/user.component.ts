/**
 * This is the TypeScript backend for the profile component.
 * Here, we reference profile.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../services/user.service';
import { DBService } from '../services/db.service';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['../css/app.component.css', '../css/user.component.css']
})
export class UserComponent {
  public user_id: number;
  public first_name: string;
  public last_name: string;
  public email: string;
  public placeholder: String = "../assets/placeholder.jpg";
  photos: Array<Object> = []; // array of filepaths of images
  profilePhoto: String = this.placeholder;
  constructor(private user: UserService, private route: ActivatedRoute, private router: Router, private db: DBService){
    this.photos.push({path: this.placeholder});
    this.photos.push({path: this.placeholder});
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      // No params were passed, or the user id is the current user's id, so display the logged in user's profile
      if(params.user_id == null || params.user_id == this.user.user_id){
        this.router.navigate(['user']);
        this.user_id = this.user.user_id;
        this.first_name = this.user.first_name;
        this.last_name = this.user.last_name;
        this.email = this.user.email;
        // Get the user's profile photo
        this.db.getProfilePhoto(this.user_id).then(res => {
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
      else{
        // Params were passed, so set the page info to the user id's info so we can display it
        // Do DB call that returns user info given ID
        this.db.getUser(params.user_id).then(res => {
          this.first_name = res[0].first_name;
          this.last_name = res[0].last_name;
          this.email = res[0].email;
          console.log(res);
        });
        // Get the user's profile photo
        this.db.getProfilePhoto(params.user_id).then(res => {
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
    })
  }
}
