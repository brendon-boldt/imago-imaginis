/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that serves as a backend service to the library page
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';

import { DBService } from '../services/db.service';
import { UserService } from '../services/user.service';

@Injectable()
export class LibraryService {
    subject = new Subject<any>();
    photos: any  = [];
    photoArrOne: any = [];
    photoArrTwo: any = [];
    photoArrThree: any = [];
    photoArrFour: any = [];
    photoArraysArray: Array<Array<Object>> = [this.photoArrOne, this.photoArrTwo, this.photoArrThree, this.photoArrFour];
    constructor(private db: DBService, private user: UserService){}
    getPictures(firstload: boolean): Observable<any> {
        this.refreshData(firstload);
        return this.subject.asObservable();
    }
    refreshData(firstload: boolean) {
        this.photos = [];
        this.photoArrOne = [];
        this.photoArrTwo = [];
        this.photoArrThree = [];
        this.photoArrFour = [];
        var previousPhotos = this.photoArraysArray;
        this.photoArraysArray = [this.photoArrOne, this.photoArrTwo, this.photoArrThree, this.photoArrFour];
        // Get the user's styled photos and videos
        // Also, get their unstyled photos and videos, but overlay them with a processing image
        this.db.getStyledPhotos(this.user.user_id).then(res => {
            var styledRes = res.json();
            this.db.getUnStyledPhotos(this.user.user_id).then(res => {
                var unStyledRes = res.json();
                this.db.getStyledVideos(this.user.user_id).then(res => {
                    var styledVidRes = res.json();
                    this.db.getUnStyledVideos(this.user.user_id).then(res => {
                        var unStyledVidRes = res.json();
                        for(var photo of unStyledRes){
                            console.log(photo);
                            this.photos.push(photo);
                        }
                        for(var photo of unStyledVidRes){
                            console.log(photo);
                            this.photos.push(photo);
                        }
                        for(var photo of styledRes){
                            console.log(photo);
                            this.photos.push(photo);
                        }
                        for(var photo of styledVidRes){
                            console.log(photo);
                            this.photos.push(photo);
                        }
                        // Now, split the user's photos into 4 different arrays for display
                        var arrNum = 0; var numOfArrs = 4; 
                        while(arrNum < numOfArrs && this.photos.length != 0){
                            this.photoArraysArray[arrNum].push(this.photos.pop());
                            arrNum++;
                            if(arrNum == numOfArrs){
                            arrNum = 0;;
                            }
                        }
                        // Iterate through previous array and current array to find differences
                        // If they are, emit the new array
                        if(this.updatedPhotos(previousPhotos, this.photoArraysArray) || firstload){
                            console.log("Photos have been updated");
                            this.subject.next(this.photoArraysArray);
                        }
                    });
                });
            });
        });
    }
    // Compares two arrays of photos
    updatedPhotos(prev: Array<Array<Object>>, curr: Array<Array<Object>>): boolean {
        for(var i=0; i<prev.length; i++){
            if(prev[i].length != curr[i].length){
                return true;
            }
            for(var j=0; j<prev[i].length; j++){
                if (prev[i][j]['path'] != (curr[i][j]['path']))
                    return true;       
            }
        }
        return false;
    }
}