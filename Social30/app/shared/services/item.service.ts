import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { Item } from "../models/item";
import { Config } from "../config";


@Injectable()
export class ItemService {
    
    baseUrl = Config.apiUrl + "henquiries";

    constructor(private http: HttpClient) { }

    private items: Item[];

    getItems() {
        return this.http.get<Item[]>(this.baseUrl)
            .pipe(
                map(items => {
                    let itemList = [];
                    items.forEach((item) => {
                        itemList.push(
                            new Item(
                                item.amountAide,
                                item._id,
                                item.text,
                                item.postalcode,
                                item.createdBy,
                                item.startTime,
                                item.endTime));
                    });
                    this.items = itemList;
                    return itemList; 
                }),
                catchError(this.handleErrors)
            );
    }
    
    getItem(id: string) {
        if (this.items != undefined) {
            return this.items.find(data => data._id === id);
        } else {
            return this.getItems().subscribe(items => this.getItem(id));
        }
    }
    
    handleErrors(error: Response) {
        console.log('reaching');
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }

    /*
    private createRequestHeader() {
        let headers = new HttpHeaders({
            // ...
        })
    }
    */
}
