/**
 * This is the TypeScript backend for the search component.
 * Here, we reference search.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./app.component.css']
})
export class SearchComponent {
  showSearch: boolean = false;
  constructor(private router: Router){}
  search = function(){
    this.showSearch = true;
  }
}
