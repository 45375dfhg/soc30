import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as appSettings from "tns-core-modules/application-settings";
import { map } from 'rxjs/operators';

import { Config } from '../config';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    baseUrl = Config.apiUrl + "login";

    login(email: string, password: string) {
        return this.http.post<any>(this.baseUrl, { logemail: email, logpassword: password })
            .pipe(
                map(user => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                        appSettings.setString('currentUser', JSON.stringify(user));
                    }

                return user;
            }));
    }

    logout() {
        appSettings.remove('currentUser');
    }
}