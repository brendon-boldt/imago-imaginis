/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that manages the user.
 * This sets the user information once the authentication service validates that 
 * the user credentials passed are valid.
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { RouterModule, Routes, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { Observable } from "rxjs/Observable";

// Importing database service so we can check to see if the user login information exists
import { DBService } from './db.service';

@Injectable()
export class UserService {
  public uploadedPhoto: File; // photo that the user uploaded
  public userId: number; // id of the user
  public firstName: string; // first name of the user
  public lastName: string; // last name of the user
  public email: string; // email of the user
  public profilePhoto: string = '../../assets/ii_logo_black.png.png'; // default profile picture of the user
  public isAdmin: boolean = false; // flag for if user is an admin
  public justLoggedIn: boolean = false; // flag for if user has just logged in (redirect from login page). Used for login alert.
  public dateJoined: any; // date of user account creation
  public isPaid: boolean = false; // flag for if user is a paid user
  jwtHelper: JwtHelper = new JwtHelper(); // helper to help decode a JWT
  constructor(private db: DBService){}
  /**
   * This sets the user information based on the id in the valid JWT passed in
   */
  setInfo(jwt): void {
    console.log("WEB: - Setting info");
    jwt = this.jwtHelper.decodeToken(jwt)
    this.userId = jwt.user_id;
    this.refreshInfo();
  }
  /**
   * Refreshes the user info. Typically called after an account update
   */
  refreshInfo(): Promise<any> {
    return this.db.getUser(this.userId).then(res => {
      console.log("WEB: Refreshing user's information");
      res = res[0];
      this.userId = res.user_id;
      this.firstName = res.first_name;
      this.lastName = res.last_name;
      this.email = res.email;
      this.isAdmin = res.admin;
      this.dateJoined = res.date_joined;
      // If user is unpaid, database returns null for paid_id
      if(res.paid_id != null){
        this.isPaid = true;
      }
      else{
        this.isPaid = false;
      }
      // If user doesn't have a profile photo, set their profile photo to the default profile photo
      if(res.profile_photo != null){
        this.profilePhoto = this.db.url + res.profile_photo;
      }
      else{
        this.profilePhoto = '../../assets/ii_logo_black.png';
      }
      return res;
    });
  }
}