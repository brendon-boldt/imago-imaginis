/**
 * Imago Imaginis 
 * ----------------------------
 * Angular Service that pulls data from the database via HTTP calls
 */
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DBService {
    // This is the url of the Express server that is serving as the connection for the DB to the open world
    url = `http://10.10.7.189:8000`;
    // url = `http://localhost:8000`;
    constructor(private http: Http){}

    /**
     * Log a user in based on email and password
     * Will get a JWT in return
     * @param email 
     * @param password 
     */
    login(email, password): Promise<any> {
        console.log("Performing login");
        let login = this.url + '/user/login';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let params = new URLSearchParams();
        params.set('email', email);
        params.set('password', password);
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.get(login, options)
        .toPromise()
        // .then(response => response.json()　as Object)
        .then(response => response as Object)
        .catch(this.handleError);
    }

    /**
     * Creates new user based on input received
     * @param firstName 
     * @param lastName 
     * @param email 
     * @param password 
     */
    createUser(firstName, lastName, email, password): Promise<any> {
        console.log("WEB: Creating user");
        let createUser = this.url + '/user/create';
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        // Looks like form data is not supported
        // let formData: any = new FormData();
        // formData.append("first_name", firstName);
        // formData.append("last_name", lastName);
        // formData.append("email", email);
        // formData.append("password", password);
        let body = new URLSearchParams();
        body.append("first_name", firstName);
        body.append("last_name", lastName);
        body.append("email", email);
        body.append("password", password);

        let params = new URLSearchParams();
        // params.set('filter_id', style['filter_id']);
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.post(createUser, body.toString(), options)
        .toPromise()
        .then(response => {return response as Object})
        .catch(this.handleError);
    }

    /**
     * Performs an upload of a photo to the database, taking in a file and a filter
     * Must be user.
     * @param file 
     */
    uploadPhoto(id: number, file: File, filterId: number, img: any): Promise<any> {
        console.log("WEB: Performing POST of photo");
        let upload = this.url + '/upload/photo';
        let headers = new Headers();
        // headers.append('Content-Type', 'image/jpeg');
        // Pass in JWT for Express to verify if valid
        let jwt = sessionStorage.getItem('jwt');
        let formData: any = new FormData();
        formData.append("upload", file);
        formData.append('filter_id', filterId+"");
        formData.append('user_id', id+"");
        formData.append('height', img.width+"");
        formData.append('width', img.height+"");
        formData.append('jwt', jwt+"");
        console.log("WEB: File that will be uploaded with filter id " + filterId + ":");
        console.log(file);

        // TODO: USE PROPER BODY POSTING
        let params = new URLSearchParams();
        // params.set('filter_id', filterId+"");
        // params.set('user_id', id+"");
        // params.set('height', img.width+"");
        // params.set('width', img.height+"");
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.post(upload, formData, options)
        .toPromise()
        .then(response => response　as Object)
        .catch(this.handleError);
    }

    /**
     * Performs an upload of a video to the database, taking in a file and a filter
     * Must be paid user
     * @param file 
     */
    uploadVideo(id: number, file: File, filterId: number): Promise<any> {
        console.log("WEB: Performing POST of video");
        let videoUpload = this.url + '/upload/video';
        let headers = new Headers();
        // headers.append('Content-Type', 'image/jpeg');

        let formData: any = new FormData();
        formData.append("upload", file);
        formData.append('filter_id', filterId+"");
        formData.append('user_id', ""+id);
        let jwt = sessionStorage.getItem('jwt');
        formData.append('jwt', jwt+"");
        console.log("WEB: File that will be uploaded with filter id " + filterId + ":");
        console.log(file);

        let params = new URLSearchParams();
        // params.set('filter_id', filterId+"");
        // params.set('user_id', ""+id);
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.post(videoUpload, formData, options)
        .toPromise()
        .then(response => response　as Object)
        .catch(this.handleError);
    }

    /**
     * Performs an upload of a profile photo to the database, taking in a file
     * Must be user
     * @param file 
     */
    uploadProfilePhoto(id: number, file: File): Promise<any> {
        console.log("WEB: Performing POST of photo");
        let uploadProfile = this.url + '/user/upload/profile';
        let headers = new Headers();
        // headers.append('Content-Type', 'image/jpeg');

        let formData: any = new FormData();
        formData.append("upload", file);
        formData.append('user_id', ""+id);
        let jwt = sessionStorage.getItem('jwt');
        formData.append('jwt', jwt+"");
        console.log("WEB: Profile photo that will be uploaded: ");
        console.log(file);

        let params = new URLSearchParams();
        // params.set('user_id', ""+id);
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
        console.log(id);
        let photos = this.url + '/user/photos';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let params = new URLSearchParams();
        params.set('user_id', id+"");
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.get(photos, options)
        .toPromise()
        // .then(response => response.json()　as Object)
        .then(response => response as Object)
        .catch(this.handleError);
    }

    /**
     * Returns user's styled videos
     * @param id (user id)
     */
    getStyledVideos(id: number): Promise<any> {
        console.log(id);
        let videos = this.url + '/user/videos';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let params = new URLSearchParams();
        params.set('user_id', id+"");
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.get(videos, options)
        .toPromise()
        // .then(response => response.json()　as Object)
        .then(response => response as Object)
        .catch(this.handleError);
    }

    /**
     * Returns user's unstyled photos
     * @param id (user id)
     */
    getUnStyledPhotos(id: number): Promise<any> {
        console.log(id);
        let photos = this.url + '/user/photos/unstyled';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let params = new URLSearchParams();
        params.set('user_id', id+"");
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.get(photos, options)
        .toPromise()
        // .then(response => response.json()　as Object)
        .then(response => response as Object)
        .catch(this.handleError);
    }

    /**
     * Returns user's unstyled videos
     * @param id (user id)
     */
    getUnStyledVideos(id: number): Promise<any> {
        console.log(id);
        let videos = this.url + '/user/videos/unstyled';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let params = new URLSearchParams();
        params.set('user_id', id+"");
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.get(videos, options)
        .toPromise()
        // .then(response => response.json()　as Object)
        .then(response => response as Object)
        .catch(this.handleError);
    }
    
    /**
     * Returns the photos the user wants to display on their profile
     * @param id (user id)
     */
    getProfilePhotos(id: number): Promise<any> {
        console.log(id);
        let photos = this.url + '/user/photos/display';
        let headers = new Headers();
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
        console.log(id);
        let videos = this.url + '/user/videos/display';
        let headers = new Headers();
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
     * Gets the user's profile photo based on passed user id
     */
    getProfilePhoto(id: number): Promise<any> {
        let profilePicture = this.url + '/user/profile-picture';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let params = new URLSearchParams();
        params.set('user_id', id+"");
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.get(profilePicture, options)
        .toPromise()
        // .then(response => response.json()　as Object)
        .then(response => response as Object)
        .catch(this.handleError);
    }

    /**
     * Gets list of all filters
     * Must be user
     */
    getFilters(): Promise<any> {
        console.log("Performing GET of filters");
        // Pass in JWT for Express to verify if valid
        let jwt = sessionStorage.getItem('jwt');
        let filters = this.url + '/filters';
        let headers = new Headers();
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
        console.log("Performing GET of users with " + searchString);
        let search = this.url + '/user/search';
        let headers = new Headers();
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
        console.log("GETTING user info with id " + user_id);
        let getUser = this.url + '/user/info';
        let headers = new Headers();
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
     * Used for account information modification
     * Must be user
     */
    saveUserSettings(userId, firstName, lastName, email, password): Promise<any> {
        console.log("WEB: Saving user settings");
        let createUser = this.url + '/user/alter';
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        let body = new URLSearchParams();
        body.append("user_id", userId);
        body.append("first_name", firstName);
        body.append("last_name", lastName);
        body.append("email", email);
        body.append("password", password); // should this be encrypted?
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
     * Must be user
     * @param photo 
     * @param display 
     */
    setPhotoToDisplay(photo: any, display: String): Promise<any> {
        let setToDisplay = this.url + '/user/photos/set-display';
        let headers = new Headers();
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
        // .then(response => response.json()　as Object)
        .then(response => response as Object)
        .catch(this.handleError);
    }

    /**
     * Sets a photo to be displayed on user's profile
     * Must be user
     * @param video 
     * @param display 
     */
    setVideoToDisplay(video: any, display: String): Promise<any> {
        let setToDisplay = this.url + '/user/videos/set-display';
        let headers = new Headers();
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
     * Performs the filter upload
     * Must be paid user
     * @param file
     * @param id
     */
    uploadFilter(file: File, id: number): Promise<any> {
        console.log("WEB: Performing POST of filter");
        let uploadFilter = this.url + '/filter/upload';
        let headers = new Headers();
        // headers.append('Content-Type', 'image/jpeg');

        let formData: any = new FormData();
        formData.append("upload", file);
        formData.append("user_id", id);
        let jwt = sessionStorage.getItem('jwt');
        formData.append('jwt', jwt+"");
        console.log(file);

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
     */
    deletePhoto(user_id: number, photo_id: number): Promise<any> {
        console.log("WEB: Performing DELETE of photo");
        let deletePhoto = this.url + '/user/photos/delete';
        let headers = new Headers();
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
     */
    deleteVideo(user_id: number, video_id: number): Promise<any> {
        console.log("WEB: Performing DELETE of photo");
        let deletePhoto = this.url + '/user/videos/delete';
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let body = new URLSearchParams();
        body.append("user_id", ""+user_id);
        body.append("video_id", ""+video_id);
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
     * Performs a get on all system stats
     * Only admins
     */
    getSystemStats(): Promise<any> {
        console.log("Performing GET of system stats");
        let stats = this.url + '/system/stats';
        let headers = new Headers();
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

    getDiskSpaceUsed(): Promise<any> {
        console.log("Performing GET of system space used");
        let stats = this.url + '/system/stats/filesystem/spaceused';
        let headers = new Headers();
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

    getDBSpaceUsed(): Promise<any> {
        console.log("Performing GET of database space used");
        let stats = this.url + '/system/stats/db/spaceused';
        let headers = new Headers();
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

    getProcessingPhotos(): Promise<any> {
        console.log("Performing GET of photos being processed");
        let stats = this.url + '/system/stats/photos/processing';
        let headers = new Headers();
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

    getProcessingVideos(): Promise<any> {
        console.log("Performing GET of videos being processed");
        let stats = this.url + '/system/stats/videos/processing';
        let headers = new Headers();
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

    getFlaggedPhotos(): Promise<any> {
        console.log("Performing GET of flagged photos");
        let stats = this.url + '/system/stats/photos/flagged';
        let headers = new Headers();
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

    getFlaggedVideos(): Promise<any> {
        console.log("Performing GET of flagged videos");
        let stats = this.url + '/system/stats/videos/flagged';
        let headers = new Headers();
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

    getPastDayUploads(): Promise<any> {
        console.log("Performing GET of uploads in past day");
        let stats = this.url + '/system/stats/uploads/pastday';
        let headers = new Headers();
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

    getPastWeekUploads(): Promise<any> {
        console.log("Performing GET of uploads in past day");
        let stats = this.url + '/system/stats/uploads/pastweek';
        let headers = new Headers();
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

    getPastMonthUploads(): Promise<any> {
        console.log("Performing GET of uploads in past day");
        let stats = this.url + '/system/stats/uploads/pastmonth';
        let headers = new Headers();
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

    private handleError(error: any) {
        console.error('WEB: An error occurred', error); 
        return error;
		// return Promise.reject(error.message || error);
	}
}