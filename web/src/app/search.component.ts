/**
 * This is the TypeScript backend for the search component.
 * Here, we reference search.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

// Import services
import { DBService } from './services/db.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./app.component.css', './css/search.component.css']
})
export class SearchComponent {
  showSearch: boolean;
  searchString: String = "";
  results: Array<Object>;
  constructor(private router: Router, private db: DBService){
    this.results = [{}];
  }
  search = function() {
    console.log("Search string: " + this.searchString);
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
  goToProfile = function(index) {
    // Get the user based on the table index selected
    let user = this.results[index];
    // Navigate to the user profile, with route parameters set
    this.router.navigate(['user'], "hi");
  }
}
