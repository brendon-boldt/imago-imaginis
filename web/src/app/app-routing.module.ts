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
import { SelectStyleComponent } from './select-style.component';
import { RegisterComponent } from './register.component';
import { SystemStatsComponent } from './system-stats.component';

//The different routes correspond to different components to load based on the route selected
const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'login', component: LoginComponent },
  { path: 'report', component: ReportComponent },
  { path: 'select-style', component: SelectStyleComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'system-stats', component: SystemStatsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes, { enableTracing: true }) ],
  exports: [ RouterModule ],
  providers: []
})

export class AppRoutingModule {}
