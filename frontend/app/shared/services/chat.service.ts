import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Config } from "../config";


@Injectable()
export class ChatService {

    baseUrl = Config.apiUrl + "messages/";

    constructor(private http: HttpClient) { }

    public getChatsOverview() {
        return this.http.get<any>(this.baseUrl + 'overview/').pipe(
            catchError(this.handleErrors('getChatsOverview'))
        );
    }

    public getSpecificChat(id: string) {
        let httpParams = new HttpParams()
            .set('messageId', id);

        return this.http.put<any>(this.baseUrl + "specific/", httpParams).pipe(
            catchError(this.handleErrors('getSpecificChat'))
        );
    }

    public sendChatMessage(id: string, msg: string) {
        let httpParams = new HttpParams()
            .set('messageId', id)
            .set('message', msg);

        return this.http.post<any>(this.baseUrl + 'specific/', httpParams).pipe(
            catchError(this.handleErrors('sendChatMessage'))
        );
    }

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