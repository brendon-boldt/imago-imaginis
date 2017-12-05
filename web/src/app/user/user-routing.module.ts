/**
 * Imago Imaginis
 * -------------------------------------------
 * Handles the page routing for user pages within the web application
 * Only users may access the routes listed in this module.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components that belong to this module
import { UserComponent } from './user.component';
import { UserSettingsComponent } from './user-settings.component';
import { UploadComponent } from './upload.component';
import { SelectStyleComponent } from './select-style.component';
import { LibraryComponent } from './library.component';

// Import the route guard to prevent users not logged in from going places they aren't allowed to
import { AuthGuard } from '../services/auth-guard.service';

// The different routes correspond to different components to load based on the route selected
// Users need to be logged in before being able to navigate to any of these routes
const userRoutes: Routes = [
  { path: '', redirectTo:'/home', pathMatch:'full'},
  { path: 'user', component: UserComponent, canActivate: [AuthGuard]},
  { path: 'user-settings', component: UserSettingsComponent, canActivate: [AuthGuard]},
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'library', component: LibraryComponent, canActivate: [AuthGuard] },
  { path: 'select-style', component: SelectStyleComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [ RouterModule.forChild(userRoutes) ],
  exports: [ RouterModule ],
  providers: []
})

export class UserRoutingModule {}
