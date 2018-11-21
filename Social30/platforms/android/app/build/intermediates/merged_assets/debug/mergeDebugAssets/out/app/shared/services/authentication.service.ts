import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as appSettings from "tns-core-modules/application-settings";
import { map } from 'rxjs/operators';

import { Config } from '../config';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    loginUrl = Config.apiUrl + "login";

    login(email: string, password: string) {
        /*
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json; charset=utf-8');
        */

        // HttpParams is immutable so we need to concatinate
        // the .sets on creation
        let params = new HttpParams()
            .set('logemail', email)
            .set('logpassword', password);

        // returns an Obserable and thus needs to be subscribed to otherwise
        // this aint gonna work
        return this.http.post<any>(this.loginUrl, params)
            .pipe(
                map(user => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                        appSettings.setString('currentUser', JSON.stringify(user));
                        console.log(appSettings.getString('currentUser'));
                        console.log(JSON.parse(appSettings.getString('currentUser')).token);
                    }

                return user;
            }));
    }

    logout() {
        appSettings.remove('currentUser');
    }
}