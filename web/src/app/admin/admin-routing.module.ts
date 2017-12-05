/**
 * Imago Imaginis
 * -------------------------------------------
 * Handles the page routing for admin pages within the web application
 * Only admins may access the routes listed in this module.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SystemStatsComponent } from './system-stats.component';

// Import the route guard to prevent users not logged in or not admins from going places they aren't allowed to
import { AuthGuard } from '../services/auth-guard.service';

// The different routes correspond to different components to load based on the route selected
const adminRoutes: Routes = [
  { path: '', redirectTo:'/home', pathMatch:'full'},
  { path: 'system-stats', component: SystemStatsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [ RouterModule.forChild(adminRoutes) ],
  exports: [ RouterModule ],
  providers: []
})

export class AdminRoutingModule {}
