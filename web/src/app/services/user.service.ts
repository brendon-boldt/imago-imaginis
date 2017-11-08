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

// Importing database service so we can check to see if the user login information exists
import { DBService } from './db.service';

@Injectable()
export class UserService {
    public uploadedPhoto: File;
    public user_id: number;
    public first_name: string;
    public last_name: string;
    public email: string;
    public profilePhoto: string = '../../assets/placeholder.jpg';
    public isAdmin: boolean = false;;
    jwtHelper: JwtHelper = new JwtHelper();
    constructor(private db: DBService){
        // Get the user profile picture
        if(this.user_id != null){
            this.db.getProfilePhoto(this.user_id).then(res => {
                console.log("WEB: User service GET profile photo");
                console.log(res.json());
                if(res.json()[0].profile_photo != null){
                    this.profilePhoto = res.json()[0].profile_photo;
                }
            });
        }
    }
    setInfo(jwt): void {
        console.log("USERSERVICE - Setting info:");
        jwt = this.jwtHelper.decodeToken(jwt)
        console.log(jwt);
        this.user_id = jwt.user_id;
        this.first_name = jwt.first_name;
        this.last_name = jwt.last_name;
        this.email = jwt.email;
        this.isAdmin = jwt.isAdmin;
        this.getProfilePhoto();
    }
    getProfilePhoto(): Promise<any> { 
        return this.db.getProfilePhoto(this.user_id).then(res => {
            console.log("WEB: User service GET profile photo");
            console.log(res.json());
            if(res.json()[0].profile_photo != null){
                this.profilePhoto = this.db.url + res.json()[0].profile_photo;
                return this.db.url + res.json()[0].profile_photo;
            }
            else{
                return null;
            }
        })
    }
}