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
    constructor(private db: DBService){}
    setInfo(jwt): void {
        console.log("USERSERVICE - Setting info:");
        jwt = this.jwtHelper.decodeToken(jwt)
        this.userId = jwt.user_id;
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
        return res;
      });
    }
}