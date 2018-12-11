import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

// shared services etc
import { Config } from '../config';
import { AppSettingsService } from '../services/appsettings.service';

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient, private appSet: AppSettingsService) { }

    loginUrl = Config.apiUrl + "login";
    registerUrl = Config.apiUrl + "register";

    login(email: string, password: string) {
        
        // HttpParams is immutable so we need to concatinate
        // the .sets on creation
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Access-Control-Allow-Origin', '*');
        
        let params = new HttpParams()
            .set('logemail', email)
            .set('logpassword', password);

        // returns an Observable and thus this needs to be subscribed to 
        return this.http.post<any>(this.loginUrl, params, {headers: headers})
            .pipe(
                map(user => {
                    console.log('reached map(user)')
                    // login successful if there's a jwt token in the response
                    if (user && user.token && user._id) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                        this.appSet.setUser('currentUser', JSON.stringify(user));
                    }
                    return user;
                }));
    }

    logout() {
        this.appSet.removeUser('currentUser');
        this.appSet.removeUser('guest');
    }

    register(user) {
        let params = new HttpParams()
            .set('email', user.email)
            .set('password', user.password)
            .set('passwordConf', user.confPassword)
            .set('surname', user.surname)
            .set('firstname', user.firstname)
            .set('avatar', user.avatar)
            .set('postalcode', user.postalcode)
            .set('street', user.street)
            .set('city', user.city)
            .set('housenm', user.housenm);

        return this.http.post<any>(this.registerUrl, params)
            .pipe(
                map(user => {
                    console.log('reached register map')
                    if (user && user.token) {
                        this.appSet.setUser('currentUser', JSON.stringify(user));
                    }
                    return user;
                })
            );
    }
}