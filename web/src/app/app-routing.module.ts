/**
 * This TypeScript file handles the routing between components within the web application.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './notFound.component';
import { HomeComponent } from './home.component';
import { UserComponent } from './user.component';
import { UserSettingsComponent } from './user-settings.component';
import { UploadComponent } from './upload.component';
import { LoginComponent } from './login.component';
import { ReportComponent } from './report.component';
import { SelectStyleComponent } from './select-style.component';
import { RegisterComponent } from './register.component';
import { SystemStatsComponent } from './system-stats.component';
import { SearchComponent } from './search.component';
import { LibraryComponent } from './library.component';

// Import the route guard to prevent users not logged in from going places they aren't allowed ti
import { AuthGuard } from './services/auth-guard.service';

//The different routes correspond to different components to load based on the route selected
const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'user-settings', component: UserSettingsComponent },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] }, // user needs to log in before navigating to this page
  { path: 'login', component: LoginComponent },
  { path: 'report', component: ReportComponent },
  { path: 'select-style', component: SelectStyleComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'system-stats', component: SystemStatsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'library', component: LibraryComponent },
  { path: "**", component: NotFoundComponent } // Must be last
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes, { enableTracing: true }) ],
  exports: [ RouterModule ],
  providers: []
})

export class AppRoutingModule {}
