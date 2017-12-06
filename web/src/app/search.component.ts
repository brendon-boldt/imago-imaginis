/**
 * Imago Imaginis
 * -------------------------------------------
 * Backend for the search component page.
 * Allows the user to search for other users.
 * This ties in the HTML template and any CSS that goes along with it.
 * Also controls page functionality and imports data from Angular services.
 */

import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Import services to import data from DB
import { DBService } from './services/db.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./css/app.component.css', './css/search.component.css', './css/scrollbar.css']
})
export class SearchComponent {
  showSearch: boolean; // flag to display the results of the search
  searchString: String = ""; // what the user typed into the box
  searchedString: String = ""; // what the user searched
  results: Array<Object>; // rows returned by the DB
  /**
   * Constructor for the page, sets search results to empty
   */
  constructor(private router: Router, private db: DBService){
    this.results = [{}];
  }
  /**
   * Performs the search 
   */
  search = function() {
    this.searchedString = this.searchString.valueOf();
    console.log("Search string: " + this.searchedString);
    // Get users that matched the query string
    this.db.searchUsers(this.searchString).then(result => {
      this.results = result;
      if(this.results[0] != null){
        // Converts status to user readable format
        for(var i of this.results){
          if(i.status == true){
            i.status = "Yes"; 
          }
          else{
            i.status = "No";
          }
        }
        // Handle the rows returned by the DB
        this.showSearch = true;
      }
      else{
        this.showSearch = false;
      }
    });
  }
  /**
   * When the search entry is clicked, go to the profile for that user
   */
  goToProfile = function(index) {
    // Get the user based on the table index selected
    let user = this.results[index];
    // Navigate to the user profile, with route parameters set
    this.router.navigate(['user'], { queryParams: { userId: user.user_id }});
  }
}
