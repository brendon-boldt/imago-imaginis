/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that pulls data from the database via HTTP calls
 * This is where the website interacts with the API.
 * WARNING: This is a very long file
 */
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { GeneralService} from './general.service';

@Injectable()
export class DBService {
    // This is the url of the Express server that is serving as the connection for the DB to the open world
    url = 'https://imagino.reev.us:8000';
    constructor(private http: Http, private gen: GeneralService){}
    /**
     * Log a user in based on email and password
     * Will get a JWT in return
     * @param email email of user
     * @param password password of user
     */
    login(email, password): Promise<any> {
      console.log("WEB: Performing login");
      let login = this.url + '/user/login';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.set('email', email);
      params.set('password', password);
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(login, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Creates new user based on input received
     * @param firstName first name of user
     * @param lastName last name of user
     * @param email email of user
     * @param password password of user
     */
    createUser(firstName, lastName, email, password): Promise<any> {
      console.log("WEB: Creating user");
      let createUser = this.url + '/user/create';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body: any = new URLSearchParams();
      body.append("first_name", firstName);
      body.append("last_name", lastName);
      body.append("email", email);
      body.append("password", password);
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(createUser, body, options)
      .toPromise()
      .then(response => {return response as Object})
      .catch(this.handleError);
    }

    /**
     * Performs an upload of a photo to the database, taking in a file and a filter
     * Only accessible to users (JWT passed into call).
     * @param id user id
     * @param file file uploaded
     * @param filterId filter id to style photo with
     */
    uploadPhoto(id: number, file: File, filterId: number, img: any): Promise<any> {
      console.log("WEB: Performing POST of photo");
      let upload = this.url + '/upload/photo';
      let headers = new Headers();
      this.handleHeader(headers);
      let jwt = sessionStorage.getItem('jwt');
      let formData: any = new FormData();
      formData.append("upload", file);
      formData.append('filter_id', filterId+"");
      formData.append('user_id', id+"");
      formData.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(upload, formData, options)
      .toPromise()
      .then(response => response　as Object)
      .catch(this.handleError);
    }

    /**
     * Performs an upload of a video to the database, taking in a file and a filter
     * Must be paid user to upload videos. (JWT passed into call)
     * @param id user id
     * @param file file that was uploaded
     * @param filterId filter id to style video with
     */
    uploadVideo(id: number, file: File, filterId: number): Promise<any> {
      console.log("WEB: Performing POST of video");
      let videoUpload = this.url + '/upload/video';
      let headers = new Headers();
      this.handleHeader(headers);
      let jwt = sessionStorage.getItem('jwt');
      let formData: any = new FormData();
      formData.append("upload", file);
      formData.append('filter_id', filterId+"");
      formData.append('user_id', ""+id);
      formData.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(videoUpload, formData, options)
      .toPromise()
      .then(response => response　as Object)
      .catch(this.handleError);
    }

    /**
     * Performs an upload of a profile photo to the database, taking in a file
     * Only accessible to users (JWT passed into call)
     * @param id user id
     * @param file file that was uploaded as profile picture
     */
    uploadProfilePhoto(id: number, file: File): Promise<any> {
      console.log("WEB: Performing POST of photo");
      let uploadProfile = this.url + '/user/upload/profile';
      let headers = new Headers();
      this.handleHeader(headers);
      let jwt = sessionStorage.getItem('jwt');
      var formData: any = new FormData();
      formData.append("upload", file);
      formData.append('user_id', ""+id);
      formData.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(uploadProfile, formData, options)
      .toPromise()
      .then(response => response　as Object)
      .catch(this.handleError);
    }

    /**
     * Returns user's styled photos
     * @param id (user id)
     */
    getStyledPhotos(id: number): Promise<any> {
      console.log("WEB: Performing GET of styled photo");
      let photos = this.url + '/user/photos';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.set('user_id', id+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(photos, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Returns user's styled videos
     * @param id (user id)
     */
    getStyledVideos(id: number): Promise<any> {
      console.log("WEB: Performing GET of styled videos");
      let videos = this.url + '/user/videos';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.set('user_id', id+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(videos, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Returns user's unstyled photos
     * @param id (user id)
     */
    getUnStyledPhotos(id: number): Promise<any> {
      console.log("WEB: Performing GET of unstyled photos");
      let photos = this.url + '/user/photos/unstyled';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.set('user_id', id+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(photos, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Returns user's unstyled videos
     * @param id (user id)
     */
    getUnStyledVideos(id: number): Promise<any> {
      console.log("WEB: Performing GET of unstyled vidoes");
      let videos = this.url + '/user/videos/unstyled';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.set('user_id', id+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(videos, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }
    
    /**
     * Returns the photos the user wants to display on their profile
     * @param id (user id)
     */
    getProfilePhotos(id: number): Promise<any> {
      console.log("WEB: Performing GET of profile photos");
      let photos = this.url + '/user/photos/display';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.set('user_id', id+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(photos, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Returns the videos the user wants to display on their profile
     * @param id (user id)
     */
    getProfileVideos(id: number): Promise<any> {
      console.log("WEB: Performing GET of profile videos");
      let videos = this.url + '/user/videos/display';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.set('user_id', id+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(videos, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }
    
    /**
     * Gets list of all filters
     * Only accessible to users (JWT passed into call)
     */
    getFilters(): Promise<any> {
      console.log("WEB: Performing GET of filters");
      let jwt = sessionStorage.getItem('jwt');
      let filters = this.url + '/filters';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.append("jwt", jwt);
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(filters, options)
      .toPromise()
      .then(response => response.json()　as Object)
      .catch(this.handleError);
    }

    /**
     * Performs a search on the users by looking at user's full names
     * Returns all users that match the search string
     * @param searchString 
     */
    searchUsers(searchString): Promise<any> {
      console.log("WEB: Performing GET of users with " + searchString);
      let search = this.url + '/user/search';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.set('searchString', searchString);
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(search, options)
      .toPromise()
      .then(response => response.json()　as Object)
      .catch(this.handleError);
    }

    /**
     * Returns the user information that matches the user id passed in
     * @param user_id 
     */
    getUser(user_id): Promise<any> {
      console.log("WEB: Performing GET of user info");
      let getUser = this.url + '/user/info';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.set('user_id', user_id);
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(getUser, options)
      .toPromise()
      .then(response => response.json() as Object)
      .catch(this.handleError);
    }

    /**
     * Preps the query
     */
    prepQuery(): String {
      return "Q2cx";
    }

    /**
     * Used for account information modification.
     * User information modified to what is passed into the call
     * Only accessible to users
     * @param userId id of user
     * @param firstName first name of user
     * @param lastName last name of user
     * @param email email of user
     * @param password password of user
     */
    saveUserSettings(userId, firstName, lastName, email, password): Promise<any> {
      console.log("WEB: Saving user settings");
      let createUser = this.url + '/user/alter';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      let body = new URLSearchParams();
      body.append("user_id", userId);
      body.append("first_name", firstName);
      body.append("last_name", lastName);
      body.append("email", email);
      body.append("password", password); 
      let jwt = sessionStorage.getItem('jwt');
      body.append('jwt', jwt+"");

      let params = new URLSearchParams();
      params.set('user_id', userId);
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(createUser, body.toString(), options)
      .toPromise()
      .then(response => {return response as Object})
      .catch(this.handleError);
    }

    /**
     * Sets a photo to be displayed on user's profile
     * Only accessible to users (JWT passed to call)
     * @param photo photo which contains id to pass into call
     * @param display true or false depending on whether photo is to be displayed or not
     */
    setPhotoToDisplay(photo: any, display: String): Promise<any> {
      console.log("WEB: Performing photo display change");  
      let setToDisplay = this.url + '/user/photos/set-display';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body = new URLSearchParams();
      body.append('photo_id', photo.photo_id+"");
      body.append('display', display+"");
      let jwt = sessionStorage.getItem('jwt');
      body.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(setToDisplay, body.toString(), options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Sets a video to be displayed on user's profile
     * Only accessible to users (JWT passed to call) 
     * @param video video to be displayed on profile
     * @param display true or false depending on whether video is to be displayed or not
     */
    setVideoToDisplay(video: any, display: String): Promise<any> {
      console.log("WEB: Performing video display change");
      let setToDisplay = this.url + '/user/videos/set-display';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body = new URLSearchParams();
      body.append('video_id', video.video_id+"");
      body.append('display', display+"");
      let jwt = sessionStorage.getItem('jwt');
      body.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(setToDisplay, body.toString(), options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }
	
	/**
     * Upgrades a user to a paid user
     * Only accessible to user (JWT passed to call)
     * @param id user id of user to be upgraded
     */
    upgradeUser(id: number): Promise<any> {
		  console.log("WEB: Upgrading to paid account");
      let upgradeUser = this.url + '/user/paid';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body: any = new URLSearchParams();
      body.append("user_id", id);
      let jwt = sessionStorage.getItem('jwt');
      body.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(upgradeUser, body, options)
      .toPromise()
      .then(response => {return response as Object})
      .catch(this.handleError);
    }

    /**
     * Performs the filter upload
     * Only accessible to paid users (JWT passed to call)
     * @param file file that will be uploaded as a filter
     * @param id id of the user uploading the filter
     */
    uploadFilter(file: File, id: number): Promise<any> {
      console.log("WEB: Performing POST of filter");
      let uploadFilter = this.url + '/filter/upload';
      let headers = new Headers();
      this.handleHeader(headers);
      let formData: any = new FormData();
      formData.append("upload", file);
      formData.append("user_id", id);
      let jwt = sessionStorage.getItem('jwt');
      formData.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(uploadFilter, formData, options)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
    }

    /**
     * Performs a photo delete for the user
     * Only a user can delete their OWN photo
     * Must be a user (JWT passed into call)
     * @param user_id: id of the user
     * @param photo_id id of the photo to be deleted
     */
    deletePhoto(user_id: number, photo_id: number): Promise<any> {
      console.log("WEB: Performing DELETE of photo");
      let deletePhoto = this.url + '/user/photos/delete';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body = new URLSearchParams();
      body.append("user_id", ""+user_id);
      body.append("photo_id", ""+photo_id);
      let jwt = sessionStorage.getItem('jwt');
      body.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(deletePhoto, body, options)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
    }

    /**
     * Performs a video delete for the user
     * Only a user can delete their OWN video
     * Only accessible to users (JWT passed into call)
     * @param user_id id of the user
     * @param video_id id of the video to be deleted
     */
    deleteVideo(user_id: number, video_id: number): Promise<any> {
      console.log("WEB: Performing DELETE of video");
      let deleteVideo = this.url + '/user/videos/delete';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body = new URLSearchParams();
      body.append("user_id", ""+user_id);
      body.append("video_id", ""+video_id);
      let jwt = sessionStorage.getItem('jwt');
      body.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(deleteVideo, body, options)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
    }

    /**
     * Gets the number of photos a user has
     * Only accessible to users (JWT passed to call)
     * @param user_id the id of the user
     */
    getNumPhotos(user_id: number): Promise<any> {
      console.log("WEB: Get num of photos for user");
      let get = this.url + '/user/photos/num';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      params.set('user_id', user_id+"");
      let jwt = sessionStorage.getItem('jwt');
      params.set('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(get, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Performs a get on all system stats
     * Only admins may access this route
     * Only accessible to users (JWT passed to call)
     */
    getSystemStats(): Promise<any> {
      console.log("Performing GET of system stats");
      let stats = this.url + '/system/stats';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response.json()　as Object)
      .catch(this.handleError);
    }

    /**
     * Gets the amount of disk space remaining 
     * Only accessible by admins
     * Must be admin (JWT passed to call)
     */
    getDiskSpaceUsed(): Promise<any> {
      console.log("Performing GET of system space used");
      let stats = this.url + '/system/stats/filesystem/spaceused';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets amount of space in the database
     * Only accessible by admins
     * Must be admin (JWT passed to call)
     */
    getDBSpaceUsed(): Promise<any> {
      console.log("Performing GET of database space used");
      let stats = this.url + '/system/stats/db/spaceused';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets a list of photos undergoing processing by the stylizer
     * Only accessible to admins (JWT passed to call)
     */
    getProcessingPhotos(): Promise<any> {
      console.log("Performing GET of photos being processed");
      let stats = this.url + '/system/stats/photos/processing';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets a list of videos undergoing processing by the stylizer 
     * Only accessible by admins (JWT passed to call)
     */
    getProcessingVideos(): Promise<any> {
      console.log("Performing GET of videos being processed");
      let stats = this.url + '/system/stats/videos/processing';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets the photos that have been flagged
     * Only accessible by admins (JWT passed to call)
     */
    getFlaggedPhotos(): Promise<any> {
      console.log("Performing GET of flagged photos");
      let stats = this.url + '/system/stats/photos/flagged';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    } 

    /**
     * Gets the videos that have been flagged
     */
    getFlaggedVideos(): Promise<any> {
      console.log("Performing GET of flagged videos");
      let stats = this.url + '/system/stats/videos/flagged';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    } 

    /**
     * Gets the stats for uploads in the past day
     * Only accessible by admins (JWT passed to call)
     */
    getPastDayUploads(): Promise<any> {
      console.log("Performing GET of uploads in past day");
      let stats = this.url + '/system/stats/uploads/pastday';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets the stats for uploads in the past week
     * Only accessible by admins (JWT passed to call)
     */
    getPastWeekUploads(): Promise<any> {
      console.log("Performing GET of uploads in past week");
      let stats = this.url + '/system/stats/uploads/pastweek';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets the stats for uploads in the past month
     * Only accessible by admins (JWT passed to call)
     */
    getPastMonthUploads(): Promise<any> {
      console.log("Performing GET of uploads in past month");
      let stats = this.url + '/system/stats/uploads/pastmonth';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets the stats for requests in the past day
     * Only accessible by admins (JWT passed to call)
     */
    getPastDayReqs(): Promise<any> {
      console.log("Performing GET of requests in past day");
      let stats = this.url + '/system/stats/reqs/pastday';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets the stats for requests in the past week
     * Only accessible by admins (JWT passed to call)
     */
    getPastWeekReqs(): Promise<any> {
      console.log("Performing GET of requests in past week");
      let stats = this.url + '/system/stats/reqs/pastweek';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets the stats for requests in the past month
     * Only accessible by admins (JWT passed to call)
     */
    getPastMonthReqs(): Promise<any> {
      console.log("Performing GET of requests in past month");
      let stats = this.url + '/system/stats/reqs/pastmonth';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets the stats for processing times in the past year
     * Only accessible by admins (JWT passed to call)
     */
    getPastYearProcessingTime(): Promise<any> {
      console.log("Performing GET of processing time in past year");
      let stats = this.url + '/system/stats/process/pastyear';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets the stats for processing times in the past week
     * Only accessible by admins (JWT passed to call)
     */
    getPastWeekProcessingTime(): Promise<any> {
      console.log("Performing GET of processing time in past week");
      let stats = this.url + '/system/stats/process/pastweek';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Gets the stats for processing times in the past month
     * Only accessible by admins (JWT passed to call)
     */
    getPastMonthProcessingTime(): Promise<any> {
      console.log("Performing GET of processing time in past month");
      let stats = this.url + '/system/stats/process/pastmonth';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/json');
      let params = new URLSearchParams();
      let jwt = sessionStorage.getItem('jwt');
      params.append('jwt', jwt+"");
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.get(stats, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Sets a photo as reported
     * Only accessible to users (JWT passed to call)
     * @param photo_id the id of the photo to be marked as flagged
     */
    reportPhoto(photo_id): Promise<any> {
      let report = this.url + '/report/photo';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body = new URLSearchParams();
      body.append('photo_id', photo_id+"");
      let jwt = sessionStorage.getItem('jwt');
      body.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(report, body, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Sets a video as reported
     * Only accessible to users (JWT passed to call)
     * @param video_id the id of the video to be marked as flagged
     */
    reportVideo(video_id): Promise<any> {
      let report = this.url + '/report/video';
      let headers = new Headers();
      this.handleHeader(headers);
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      let body = new URLSearchParams();
      body.append('video_id', video_id+"");
      let jwt = sessionStorage.getItem('jwt');
      body.append('jwt', jwt+"");
      let params = new URLSearchParams();
      let options = new RequestOptions({headers: headers, search: params});
      return this.http.post(report, body, options)
      .toPromise()
      .then(response => response as Object)
      .catch(this.handleError);
    }

    /**
     * Handles the headers
     * @param headers the headers object that is called with every GET/POST request
     */
    private handleHeader(headers) {
      var s = this.prepQuery() + this.gen.temp;
      headers.append('bus', s);
    }

    /**
     * Handles any errors that occur in GET/POST requests
     * @param error the error that was thrown and needs to be handled
     */
    private handleError(error: any) {
      console.error('WEB: An error occurred', error); 
      console.log(error);
      // JWT has expired, sign the user out
      if(error.status == 800){
        sessionStorage.clear();
        location.reload();
      }
      // The API is currently not running, provide an alert to the user
      if(error.status == 0){
        alert("THE API CANNOT BE REACHED OR IS CURRENTLY NOT RUNNING.\nPLEASE CONTACT AN ADMINISTRATOR FOR FURTHER ASSISTANCE.");
        sessionStorage.clear();
        location.reload();
      }
      return error;
	}
}
