/**
 * Imagino Imaginis
 * ---------------------------------------------------------------------------
 * Binds all of the different user components, modules, and services together.
 * This is so that Angular framework knows how to put everything together properly.
 */
// Imports for the modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'; // This module allows us to make HTTP calls
import { FormsModule } from '@angular/forms'; // This module allows us to have two-way data binding in forms
import { UserRoutingModule } from './user-routing.module';

// References to all the components in the application to be used in the user module
import { UserComponent } from './user.component';
import { UserSettingsComponent } from './user-settings.component';
import { UploadComponent } from './upload.component';
import { SelectStyleComponent } from './select-style.component';
import { LibraryComponent } from './library.component';
import { ModalComponent } from '../modal/app-modal.component';
import { PictureModalComponent } from '../modal/picture-modal.component';

// References to all the services in the application
import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';
import { GeneralService } from '../services/general.service';
import { LibraryService } from '../services/library.service';

@NgModule({
  declarations: [
    ModalComponent,
    UploadComponent,
    SelectStyleComponent,
    LibraryComponent,
    UserComponent,
    UserSettingsComponent,
    PictureModalComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    UserRoutingModule
  ],
  providers: [
    DBService,
    UserService,
    AuthService,
    AuthGuard,
    GeneralService,
    LibraryService
  ],
  exports: [
    ModalComponent
  ]
})
export class UserModule { }