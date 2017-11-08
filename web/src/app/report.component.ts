/**
 * This is the TypeScript backend for the home component.
 * Here, we reference home.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'report',
  templateUrl: './report.component.html',
  styleUrls: ['./css/app.component.css', './css/report.component.css']
})
export class ReportComponent {
}
