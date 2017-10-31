/**
 * This is the TypeScript backend for the app component.
 * Here, we reference app.component.html as the HTML for this component, as well as the css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd } from '@angular/router';

// Importing user service so can keep track of the user
import { UserService } from './services/user.service';
import { AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./css/app.component.css']
})
export class AppComponent {
  //The title that is displayed in the header. Example of two-way data binding.
  title = 'Artistic Stylizer Platform';
  constructor(private router: Router, private user: UserService, private auth: AuthService) {}
  ngOnInit() {
      // Check to see if the user is logged in
      if(this.auth.checkLogin()){
        this.auth.isLoggedIn = true;
        // Set user info from JWT
        this.user.setInfo(sessionStorage.getItem('jwt'));
      }
      // This will make the window scroll to the top of the page
      // whenever the user is router to another page
      this.router.events.subscribe((evt) => {
          if (!(evt instanceof NavigationEnd)) {
              return;
          }
          window.scrollTo(0, 0)
      });
  }
  logOut = function(){
    console.log("WEB: Logging user out");
    this.auth.logout();
    sessionStorage.clear();
    console.log(sessionStorage);
  }
}
