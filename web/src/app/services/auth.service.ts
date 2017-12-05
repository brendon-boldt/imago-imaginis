/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that manages user authentication
 * Checks to see if the user is logged in by checking if the JWT they pass is valid
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { RouterModule, Routes, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

// Importing database service so we can check to see if the user login information exists
import { DBService } from './db.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  public isLoggedIn: boolean = false;
  public redirectUrl: string;
  jwtHelper: JwtHelper = new JwtHelper();
  enteredPassword: any;
  public constructor(private db: DBService, private router: Router, private user: UserService){
    // If the user reloads the page, keep them logged in.
    // Check session storage for presence of JWT key and verify it.
    // http://angularjs.blogspot.com/2016/11/easy-angular-authentication-with-json.html
    this.checkLogin();
  }
  /**
   * This is called when the page is first created.
   * Will be called again if the user reloads the page.
   */
  checkLogin(): boolean {
    // Check to see if there is a JWT in local storage
    // If there is not, the user is not logged in
    console.log("WEB: CHECK LOGIN");
    if(sessionStorage.getItem('jwt') == null){
      console.log("WEB: NOT SIGNED IN");
      this.isLoggedIn = false;
      return false;
    }
    else{
      // Decode the JWT, set the user's info based on the JWT passed in
      // If the JWT has expired, throw an error
      var token = sessionStorage.getItem('jwt');
      var jwt = this.jwtHelper.decodeToken(token);
      this.user.setInfo(sessionStorage.getItem('jwt'));
      console.log("JWT token expired: " + this.jwtHelper.isTokenExpired(token));
      this.isLoggedIn = true;
      return !this.jwtHelper.isTokenExpired(token);
    }
  }
  /**
   * Performs login for the user by checking entered user credentials with the database
   */ 
  login(email, password): Promise<any> {
    this.enteredPassword = password;
    var userFound = true;
    // Take user information entered in fields and pass to DB service
    return this.db.login(email, password).then(res => {
      if(res._body == "User not found"){
        console.log("WEB: User not found");
        userFound = false;
        return userFound;
      }
      else{
        // User credentials matched a database entry, so log them in
        var res = res.json();
        this.isLoggedIn = true;
        // Take the JWT stored in the response from the DB service and store it local storage
        sessionStorage.setItem('jwt', res.token);
        // Get info from JWT and set user information
        this.user.setInfo(sessionStorage.getItem('jwt'));
        // Navigate the user to home
        this.user.justLoggedIn = true; // For welcoming alert display
        this.router.navigate(['home']);
        userFound = true;
        return userFound;
      }
    });
  }
  /**
   * Redirects the user to the homepage when logging out
   * Clears out session of JWT so application truly logs out user.
   */
  logout(): void {
    this.isLoggedIn = false;
    sessionStorage.clear();
    this.router.navigate(['home']);
  }
}