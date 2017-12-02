/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that manages the user
 * The authentication service sets the user information
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
    public uploadedPhoto: File;
    public userId: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public profilePhoto: string = '../../assets/ii_logo_black.png.png';
    public isAdmin: boolean = false;
    public justLoggedIn: boolean = false;
    public dateJoined: any;
    public isPaid: boolean = false;
    jwtHelper: JwtHelper = new JwtHelper();
    // public dataAvailable: boolean = false;
    constructor(private db: DBService){
        // Get the user profile picture
        // if(this.user_id != null){
        //     this.db.getProfilePhoto(this.user_id).then(res => {
        //         console.log("WEB: User service GET profile photo");
        //         console.log(res.json());
        //         if(res.json()[0].profile_photo != null){
        //             this.profilePhoto = res.json()[0].profile_photo;
        //         }
        //     });
        // }
    }
    setInfo(jwt): void {
        console.log("USERSERVICE - Setting info:");
        jwt = this.jwtHelper.decodeToken(jwt)
        console.log(jwt);
        this.userId = jwt.user_id;
        // this.first_name = jwt.first_name;
        // this.last_name = jwt.last_name;
        // this.email = jwt.email;
        // this.isAdmin = jwt.isAdmin;
        // this.dateJoined = jwt.dateJoined;
        // if(jwt.profilePhoto != null){ // Keep placeholder if user does not have a profile picture
        //     this.profilePhoto = this.db.url + jwt.profilePhoto;
        // }
        // From the user id received, get the user's other info
        // var test = Observable.fromPromise(this.refreshInfo());
        // test.subscribe(res => {
        //   console.log(res);
        //   this.user_id = res.user_id;
        //   this.first_name = res.first_name;
        //   this.last_name = res.last_name;
        //   this.email = res.email;
        //   this.isAdmin = res.admin;
        //   this.dateJoined = res.dateJoined;
        //   if(res.profile_photo != null){
        //       this.profilePhoto = this.db.url + res.profile_photo;
        //   }
        // });
        this.refreshInfo();
    }
    // Refreshes the user info. Typically called after account update
    refreshInfo(): Promise<any> {
      return this.db.getUser(this.userId).then(res => {
        res = res[0];
        console.log(res);
        console.log("WEB: Refreshing user's information");
        this.userId = res.user_id;
        this.firstName = res.first_name;
        this.lastName = res.last_name;
        this.email = res.email;
        this.isAdmin = res.admin;
        this.dateJoined = res.date_joined;
        if(res.paid_id != null){
            this.isPaid = true;
        }
        else{
            this.isPaid = false;
        }
        if(res.profile_photo != null){
            this.profilePhoto = this.db.url + res.profile_photo;
        }
        else{
            this.profilePhoto = '../../assets/ii_logo_black.png';
        }
        // this.dataAvailable = true;
        return res;
      });
    }
}