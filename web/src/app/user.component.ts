/**
 * This is the TypeScript backend for the profile component.
 * Here, we reference profile.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./app.component.css']
})
export class UserComponent {
}
