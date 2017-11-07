/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that serves as a general service to the application
 * Used to communicate between unrelated components, but communication that isn't deemed
 * good enough to create a whole service for
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { RouterModule, Routes, Router } from '@angular/router';

@Injectable()
export class GeneralService {
    public isVideoUpload: boolean = false;
    uploadedImage: any;
    constructor(){}

}