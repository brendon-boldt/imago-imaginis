/**
 * This TypeScript file is used to bind all of the different components, modules, and services together.
 * This is so that Angular knows how to put everything together properly.
 */
//Imports for the modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

//References to all the components in the application
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile.component';
import { UploadComponent } from './upload.component';
import { LoginComponent } from './login.component';
import { ReportComponent } from './report.component';
import { SelectStyleComponent } from './select-style.component';
import { RegisterComponent } from './register.component';
import { SystemStatsComponent } from './system-stats.component';
import { SearchComponent } from './search.component';

//References to all the services in the application
import { DBService } from './services/db.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
    UploadComponent,
    LoginComponent,
    ReportComponent,
    SelectStyleComponent,
    RegisterComponent,
    SystemStatsComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    DBService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
