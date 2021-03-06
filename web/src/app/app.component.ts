/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the app component page.
 * This is the main component of the web application.
 * This component is for the top section of the web application (e.g. the header).
 * Since this part stays mostly constant in site navigation, we want to keep this persistent across
 * different components. Therefore, we have a router outlet at the end which will display different
 * components, such as the home page and the profile page, while keeping the top header/app component.
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
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
  title = "Imago Imaginis"; // title that is displayed in the header
  /**
   * Constructor for app component. Called on site creation
   */
  constructor(private router: Router, private user: UserService, private auth: AuthService) {}
  /**
   * Called on site load
   */
  ngOnInit() {
    // This will make the window scroll to the top of the page
    // whenever the user is routed to another page
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
  }
  /**
   * Logs the user out of the website by calling the logout method in the auth service
   */
  logOut = function(){
    console.log("WEB: Logging user out");
    this.auth.logout();
  }
}
