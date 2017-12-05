/**
 * Imagino Imaginis
 * ---------------------------------------------------------------------------
 * Binds all of the different admin components, modules, and services together.
 * This is so that Angular framework knows how to put everything together properly.
 */
// Imports for the modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'; // Allows us to make HTTP calls
import { FormsModule } from '@angular/forms'; // Allows us to have two-way data binding in forms
import { AdminRoutingModule } from './admin-routing.module';
import { ChartsModule } from 'ng2-charts'; // Allows us to have easy-to-implement charts

// All the components to be used in the admin module
import { SystemStatsComponent } from './system-stats.component';

// All the services to be used in the admin module
import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { GeneralService } from '../services/general.service';

@NgModule({
  declarations: [
    SystemStatsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AdminRoutingModule,
    ChartsModule
  ],
  providers: [
    DBService,
    UserService,
    AuthService,
    AuthGuard,
    GeneralService
  ],
  exports: [
  ]
})
export class AdminModule { }