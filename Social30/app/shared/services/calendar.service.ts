import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map, groupBy, mergeMap, toArray, concatMap, mergeAll } from "rxjs/operators";

import { Item } from "../models/item";
import { Config } from "../config";
import { forEach } from "@angular/router/src/utils/collection";

@Injectable()
export class CalendarService {
    baseUrl = Config.apiUrl + "calendar";

    private entries;

    constructor(private http: HttpClient) { }

    public getEntries() {
        return this.http.get<Item>(this.baseUrl)
            .pipe(
                groupBy(henquiry => henquiry.amountAide),
                mergeMap(group => group.pipe(toArray())),
                mergeAll()
                )
                // henquiry.(new Date(henquiry.startTime)).getDate()),
                // catchError(this.handleErrors('getItems'));
    }

    /*
    public getItem(id: string) {
        if (this.items != undefined) {
            
            return this.items.find(data => data._id === id);
        } else {
            return this.getItems().subscribe(items => this.getItem(id));
        }
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