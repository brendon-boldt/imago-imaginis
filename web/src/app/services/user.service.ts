/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that manages the user
 * Right now, keeps track if user is logged in or not
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
    jwtHelper: JwtHelper = new JwtHelper();
    constructor(){}
    setInfo(jwt): void {
        console.log("USERSERVICE - Setting info:");
        jwt = this.jwtHelper.decodeToken(jwt)
        console.log(jwt);
        this.user_id = jwt.user_id;
        this.first_name = jwt.first_name;
        this.last_name = jwt.last_name;
        this.email = jwt.email;
    }
}