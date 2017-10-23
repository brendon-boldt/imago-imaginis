/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that manages the user
 * Right now, keeps track if user is logged in or not
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
    public isLoggedIn: boolean = false;
    public uploadedPhoto: File;
    public constructor(){
        // If the user reloads the page, keep them logged in
        console.log(sessionStorage);
        if(sessionStorage.getItem('isLoggedIn') != undefined){
            console.log('SESSION: isLoggedIn');
            this.isLoggedIn = true;
        }
    }
}