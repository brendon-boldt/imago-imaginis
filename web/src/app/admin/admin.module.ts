/**
 * This TypeScript file is used to bind all of the different components, modules, and services together.
 * This is so that Angular knows how to put everything together properly.
 */
// Imports for the modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'; // This module allows us to make HTTP calls
import { FormsModule } from '@angular/forms'; // This module allows us to have two-way data binding in forms
import { AdminRoutingModule } from './admin-routing.module';
import { ChartsModule } from 'ng2-charts';

// References to all the components in the application
import { SystemStatsComponent } from './system-stats.component';

// References to all the services in the application
// Are these services needed?
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