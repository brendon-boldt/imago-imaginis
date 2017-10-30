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
    constructor(){}
}