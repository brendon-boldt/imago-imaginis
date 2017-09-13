/**
 * This is the TypeScript backend for the home component.
 * Here, we reference home.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./app.component.css']
})
export class HomeComponent {
}
