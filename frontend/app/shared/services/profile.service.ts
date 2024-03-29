import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Config } from "../config";


@Injectable()
export class ProfileService {

    constructor(private http: HttpClient) { }

    public getProfile(id: string) {
        let httpParams = new HttpParams()
            .set('userId', id)

        return this.http.put<any>(Config.apiUrl + "profile/", httpParams)
            .pipe(
                catchError(this.handleErrors('getProfile'))
            );
    }

    verifyProfile(user) {
        let httpParams = new HttpParams()
            .set('code', user.code)
            .set('email', user.email);

        return this.http.put<any>(Config.apiUrl + 'profile/verify', httpParams)
            .pipe(
                catchError(this.handleErrors('verifyProfile'))
            );
    }

    /*
    public changeProfile(id: string) {
        let httpParams = new HttpParams()
            .set('userId', id)

        return this.http.get<any>(this.baseUrl + "profile/", { params: httpParams })
            .pipe(
                catchError(this.handleErrors('successItem'))
            );
    }
    */

    private handleErrors(operation: string) {
        return (err: any) => {
            let errMsg = `error in ${operation}() retrieving ${Config.apiUrl}`;
            console.log(`${errMsg}:`, err);
            if (err instanceof HttpErrorResponse) {
                console.log(`Status: ${err.status}, ${err.statusText}`);
            }
            return Observable.throw(errMsg);
        }
    }
}