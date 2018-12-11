import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Config } from "../config";


@Injectable()
export class ProfileService {

    baseUrl = Config.apiUrl;

    constructor(private http: HttpClient) { }

    public getProfile(id: string) {
        let httpParams = new HttpParams()
            .set('userId', id)

        return this.http.put<any>(this.baseUrl + "profile/", httpParams)
            .pipe(
                catchError(this.handleErrors('getProfile'))
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
            let errMsg = `error in ${operation}() retrieving ${this.baseUrl}`;
            console.log(`${errMsg}:`, err);
            if (err instanceof HttpErrorResponse) {
                console.log(`Status: ${err.status}, ${err.statusText}`);
            }
            return Observable.throw(errMsg);
        }
    }
}