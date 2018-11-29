import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { Item } from "../models/item";
import { Config } from "../config";

@Injectable()
export class ItemService {
    baseUrl = Config.apiUrl + "henquiries";

    private items: Item[];

    constructor(private http: HttpClient) { }

    public getItems() {
        return this.http.get<Item[]>(this.baseUrl)
            .pipe(
                map(items => {
                    let itemList = [];
                    items.forEach((item) => {
                        itemList.push(
                            new Item(
                                item.startTime,
                                item.endTime,
                                item.amountAide,
                                item.category,
                                item.createdBy,
                                item.distance,
                                item._id));
                    });
                    this.items = itemList;
                    return itemList; 
                }),
                catchError(this.handleErrors('getItems'))
            );
    }
    
    public getItem(id: string) {
        if (this.items != undefined) {
            
            return this.items.find(data => data._id === id);
        } else {
            return this.getItems().subscribe(items => this.getItem(id));
        }
    }

    /*
    public getDummyItems(amount: Number) {
        let itemList = [];
        for (let i = 1; i <= amount; i++) {
            itemList.push(
                            new Item(1, i, "Brauche Hilfe " + i, 69118 + i , { _id: 1000 + i, email: "fakemail@lolz.com", nickname: "Dieter" + i} ,9 + i, 10 + i));
                }
                this.items = itemList;
                return itemList; 
            }

    public getDummyItem(id: string) {
        return this.items.find(data => data._id == id);
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
