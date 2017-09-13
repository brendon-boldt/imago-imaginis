/**
 * This is the TypeScript backend for the app component.
 * Here, we reference app.component.html as the HTML for this component, as well as the css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //The title that is displayed in the header. Example of two-way data binding.
  title = 'Artistic Stylizer Platform';
}
