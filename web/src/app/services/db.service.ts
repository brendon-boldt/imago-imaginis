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
    constructor(private http: Http){}

    /**
     * Log a user in based on email and password
     * Will get a JWT in return
     * @param email 
     * @param password 
     */
    login(email, password): Promise<any> {
        console.log(email + " " + password);
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
    createUser(firstName, lastName, email, password) {
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
     * @param file 
     */
    uploadPhoto(file: File, style: Object): Promise<any> {
        console.log("WEB: Performing POST of photo");
        let upload = this.url + '/upload';
        let headers = new Headers();
        // headers.append('Content-Type', 'image/jpeg');

        let formData: any = new FormData();
        formData.append("upload", file);
        console.log("WEB: File that will be uploaded with filter id " + style['filter_id'] + ":");
        console.log(file);

        let params = new URLSearchParams();
        params.set('filter_id', style['filter_id']);
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.post(upload, formData, options)
        .toPromise()
        .then(response => response.json().data　as Object)
        .catch(this.handleError);
    }

    /**
     * Returns photos specified by type
     * @param type (styled, profile, display)
     */
    getPhotos(type: String) {

    }

    /**
     * Gets list of all filters
     */
    getFilters(): Promise<any> {
        console.log("Performing GET of filters");
        let filters = this.url + '/filters';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let params = new URLSearchParams();
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
    searchUsers(searchString) {
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
        let login = this.url + '/user/get';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let params = new URLSearchParams();
        params.set('user_id', user_id);
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.get(login, options)
        .toPromise()
        .then(response => response.json() as Object)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
		console.error('WEB: An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}
}