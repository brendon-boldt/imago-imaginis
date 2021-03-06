/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that serves as a backend service to the library page
 * This performs many of the functions that the library needs
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
  subject = new Subject<any>(); // Observable in Angular/TypeScript
  photos: any  = []; // Array to hold photos received from DB
  photoArrOne: any = []; // Array to hold photos displayed in first column
  photoArrTwo: any = []; // Array to hold photos displayed in second column
  photoArrThree: any = []; // Array to hold photos displayed in third column
  photoArrFour: any = []; // Array to hold photos displayed in fourth column
  // Array to hold all the photo arrays
  photoArraysArray: Array<Array<Object>> = [this.photoArrOne, this.photoArrTwo, this.photoArrThree, this.photoArrFour];
  constructor(private db: DBService, private user: UserService){}
  /**
   * Refrehes the photos from the database and returns an observable, which
   * the library component subscribes to and pings periodically to see if 
   * photos have been updated
   */
  getPictures(firstload: boolean): Observable<any> {
    this.refreshData(firstload);
    return this.subject.asObservable();
  }
  /**
   * This pulls in the user's styled and unstyled content from the database
   */
  refreshData(firstload: boolean) {
    // Empty the photo arrays
    this.photos = [];
    this.photoArrOne = [];
    this.photoArrTwo = [];
    this.photoArrThree = [];
    this.photoArrFour = [];
    var previousPhotos = this.photoArraysArray;
    this.photoArraysArray = [this.photoArrOne, this.photoArrTwo, this.photoArrThree, this.photoArrFour];
    // TODO: Replace promises with await/async
    this.db.getStyledPhotos(this.user.userId).then(res => {
      var styledRes = res.json();
      this.db.getUnStyledPhotos(this.user.userId).then(res => {
        var unStyledRes = res.json();
        this.db.getStyledVideos(this.user.userId).then(res => {
          var styledVidRes = res.json();
          this.db.getUnStyledVideos(this.user.userId).then(res => {
            var unStyledVidRes = res.json();
            for(var photo of unStyledRes){
              this.photos.push(photo);
            }
            for(var photo of unStyledVidRes){
              this.photos.push(photo);
            }
            for(var photo of styledRes){
              this.photos.push(photo);
            }
            for(var photo of styledVidRes){
              this.photos.push(photo);
            }
            // Now, split the user's photos into 4 different arrays for display
            var arrNum = 0; var numOfArrs = 4; 
            while(arrNum < numOfArrs && this.photos.length != 0){
              this.photoArraysArray[arrNum].push(this.photos.pop());
              arrNum++;
              if(arrNum == numOfArrs){
                arrNum = 0;
              }
            }
            // Iterate through previous array and current array to find differences
            // If they are, emit the new array so that the library is updated with the new photos
            if(this.updatedPhotos(previousPhotos, this.photoArraysArray) || firstload){
                console.log("Photos have been updated");
                this.subject.next(this.photoArraysArray);
            }
          });
        });
      });
    });
  }

  /**
   * After photos are received from the database, compare the received photos
   * to the photos already received previously.
   * If there are any differences, return true, else return false
   */
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