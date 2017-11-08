/**
 * This TypeScript file handles the routing between components within the web application.
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './notFound.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { ReportComponent } from './report.component';
import { RegisterComponent } from './register.component';
import { SystemStatsComponent } from './admin/system-stats.component';
import { SearchComponent } from './search.component';

// Import the route guard to prevent users not logged in from going places they aren't allowed ti
import { AuthGuard } from './services/auth-guard.service';

//The different routes correspond to different components to load based on the route selected
const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'report', component: ReportComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'system-stats', component: SystemStatsComponent },
  { path: 'search', component: SearchComponent },
  { path: "**", component: NotFoundComponent } // Must be last
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes, { enableTracing: false }) ],
  exports: [ RouterModule ],
  providers: []
})

export class AppRoutingModule {}
