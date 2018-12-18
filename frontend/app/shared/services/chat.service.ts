import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Config } from "../config";


@Injectable()
export class ChatService {

    constructor(private http: HttpClient) { }

    public getChatsOverview() {
        return this.http.get<any>(Config.apiUrl + "messages/" + 'overview/').pipe(
            catchError(this.handleErrors('getChatsOverview'))
        );
    }

    public getSpecificChat(id: string) {
        let httpParams = new HttpParams()
            .set('messageId', id);

        return this.http.put<any>(Config.apiUrl + "messages/" + "specific/", httpParams).pipe(
            catchError(this.handleErrors('getSpecificChat'))
        );
    }

    public sendChatMessage(id: string, msg: string) {
        let httpParams = new HttpParams()
            .set('messageId', id)
            .set('message', msg);

        return this.http.post<any>(Config.apiUrl + "messages/" + 'specific/', httpParams).pipe(
            catchError(this.handleErrors('sendChatMessage'))
        );
    }

    private handleErrors(operation: string) {
        return (err: any) => {
            let errMsg = `error in ${operation}() retrieving ${Config.apiUrl + "messages/"}`;
            console.log(`${errMsg}:`, err);
            if (err instanceof HttpErrorResponse) {
                console.log(`Status: ${err.status}, ${err.statusText}`);
            }
            return Observable.throw(errMsg);
        }
    }
}