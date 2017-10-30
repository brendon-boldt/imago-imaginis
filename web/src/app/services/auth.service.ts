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
export class AuthService {
    public isLoggedIn: boolean = false;
    public redirectUrl: string;
    jwtHelper: JwtHelper = new JwtHelper();
    public constructor(private db: DBService, private router: Router){
        // If the user reloads the page, keep them logged in
        // Check session storage for presence of JWT key and verify it
        // http://angularjs.blogspot.com/2016/11/easy-angular-authentication-with-json.html
        // this.checkLogin(); // Move this to route guard
    }
    checkLogin(): boolean {
        // Check to see if there is jwt in local storage
        // If not, return false
        if(sessionStorage.getItem('jwt') == null){
            return false;
        }
        else{
            var token = sessionStorage.getItem('jwt');
            console.log(this.jwtHelper.decodeToken(token));
            console.log(this.jwtHelper.isTokenExpired(token));
            return !this.jwtHelper.isTokenExpired(token);
        }
    }
    login(email, password): void {
        console.log(this.isLoggedIn);
        // Take user information entered in fields and pass to DB service
        this.db.getUser(email, password).then(res => {
            console.log(res);
            this.isLoggedIn = true;
            // Take the JWT stored in the response and store it local storage
            sessionStorage.setItem('jwt', res._body);
            console.log(sessionStorage);
            this.router.navigate(['home']);
        });
    }
    /**
     * Redirects the user to the homepage when logging out
     */
    logout(): void {
        this.isLoggedIn = false;
        this.router.navigate(['home']);
    }
}