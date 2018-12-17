import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { Item } from "../models/item";
import { Config } from "../config";


@Injectable()
export class CalendarService {

    private entries;

    constructor(private http: HttpClient) { }

    public getEntries() {
        return this.http.get<Item[]>(Config.apiUrl + 'calendar')
            .pipe(
                map(entries => {
                    let entryList: Item[] = [];
                    entries.forEach((entry) => {
                        entryList.push(entry)
                    });
                    this.entries = entryList;
                    return entryList; 
                }),
                catchError(this.handleErrors('getEntries'))
            );
    }

    // creates dummy values for the guest access
    // needs to be adjusted to the format!
    public getGuestItems(n: number) {
        let itemList = [];
        let date = Date.now();
        for (let i = 0; i < n; i++) {
            itemList.push(
                new Item(
                    new Date(date + (1000 * 60 * 30 * (i + 1))),
                    new Date(date + ((1000 * 60 * 30 * (i + 1)) 
                        + (1000 * 60 * 30 * (((i + 1) % 6) + 1)))),
                    1,
                    {category: (i % 5), subcategory: (i % 4)},
                    {
                        id: "5bfbaf927f0ef567ba67bd20",
                        surname: "Musterman",
                        firstname: "Max",
                        nickname: "Das Beispiel"
                    },
                    0.8 * (i + 1),
                    ''
                ));
            }
        this.entries = itemList;
        return itemList; 
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
            let errMsg = `error in ${operation}() retrieving ${Config.apiUrl + 'calendar'}`;
            console.log(`${errMsg}:`, err);
            if (err instanceof HttpErrorResponse) {
                console.log(`Status: ${err.status}, ${err.statusText}`);
            }
            return Observable.throw(errMsg);
        }
    }
}