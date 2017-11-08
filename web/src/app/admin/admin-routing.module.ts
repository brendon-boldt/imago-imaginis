/**
 * This TypeScript file handles the routing between components within the web application.
 * Only admins can access these routes!
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SystemStatsComponent } from './system-stats.component';

// Import the route guard to prevent users not logged in from going places they aren't allowed ti
import { AuthGuard } from '../services/auth-guard.service';

//The different routes correspond to different components to load based on the route selected
const adminRoutes: Routes = [
  // {
    // path: '',
    // canActivate: [AuthGuard],
    // children: [
      { path: '', redirectTo:'/home', pathMatch:'full'},
      { path: 'system-stats', component: SystemStatsComponent, canActivate: [AuthGuard]}
    // ]
  // }
];

@NgModule({
  imports: [ RouterModule.forChild(adminRoutes) ],
  exports: [ RouterModule ],
  providers: []
})

export class AdminRoutingModule {}
