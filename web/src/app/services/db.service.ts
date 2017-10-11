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
    url = `http://localhost:8000`;
    constructor(private http: Http){}
    /**
     * Performs a GET from the users table
     */
    // getAparREST(): Promise<any>{
        
    // }
    getUserREST(username, password): Promise<any>{
        console.log(username + " " + password);
        console.log("Performing GET of users");
        let login = this.url + '/login';
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let params = new URLSearchParams();
        params.set('username', username);
        params.set('password', password);
        let options = new RequestOptions({headers: headers, search: params});
        return this.http.get(login, options)
        .toPromise()
        .then(response => response.json()　as Object)
        .catch(this.handleError);
    }


    private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}
}