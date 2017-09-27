/**
 * This TypeScript file handles the routing between components within the web application.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile.component';
import { UploadComponent } from './upload.component';
import { LoginComponent } from './login.component';
import { ReportComponent } from './report.component';

//The different routes correspond to different components to load based on the route selected
const appRoutes: Routes = [
  { path: '', redirectTo: '/app-home', pathMatch: 'full' },
  { path: 'app-home', component: HomeComponent },
  { path: 'app-profile', component: ProfileComponent },
  { path: 'app-upload', component: UploadComponent },
  { path: 'app-login', component: LoginComponent },
  { path: 'app-report', component: ReportComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes, { enableTracing: true }) ],
  exports: [ RouterModule ],
  providers: []
})

export class AppRoutingModule {}
