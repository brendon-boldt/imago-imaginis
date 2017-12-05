/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that serves as a general service to the application.
 * Used to communicate between unrelated components, but communication that isn't deemed
 * important enough to create a dedicated service for.
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { RouterModule, Routes, Router } from '@angular/router';

@Injectable()
export class GeneralService {
    public isVideoUpload: boolean = false; // Used to tell select-style component that the upload was a video
    public temp = "Nw=="; // Placeholder
    uploadedImage: any; // An image that was uploaded
    constructor(){}
}