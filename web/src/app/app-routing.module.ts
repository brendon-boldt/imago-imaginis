/**
 * Imago Imaginis
 * -------------------------------------------
 * Handles the page routing for general app pages within the web application
 * Any visitor of the website may access these pages
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundComponent } from './notFound.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { SystemStatsComponent } from './admin/system-stats.component';
import { SearchComponent } from './search.component';

//The different routes correspond to different components to load based on the route selected
const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'search', component: SearchComponent },
  { path: "**", component: NotFoundComponent } // Must be last
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes, { enableTracing: false }) ],
  exports: [ RouterModule ],
  providers: []
})

export class AppRoutingModule {}
