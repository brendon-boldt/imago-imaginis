/**
 * This is the TypeScript backend for the upload component.
 * Here, we reference upload.component.html as the HTML for this component, as well as the app's css
 */
import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { DBService } from '../services/db.service';

@Component({
  selector: 'system-stats',
  templateUrl: './system-stats.component.html',
  styleUrls: ['../css/app.component.css', '../css/system-stats.component.css']
})
export class SystemStatsComponent {
  stats: any;
  constructor(private db: DBService){
    this.db.getSystemStats().then(res => {
      console.log("WEB: Stats received:");
      console.log(res);
      this.stats = res;
    });
    this.db.getDiskSpaceUsed().then(res => {
      console.log("WEB: Spaced used received:");
      console.log(res);
      // TODO: Complete
    })
  }
}
