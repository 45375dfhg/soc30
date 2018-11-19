import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Item } from "../models/item";
import { Config } from "../config";


@Injectable()
export class ItemService {
    
    baseUrl = Config.apiUrl + "henquiries";

    constructor(private http: HttpClient) { }

    private items: Item[];

    getItems() {
        // let headers = this.createRequestHeader();
        // /henquiries/
        console.log(this.baseUrl)
        return this.http.get<Item[]>(this.baseUrl).subscribe(data => console.log(data));
            
        /*.pipe(
                map(items => {
                    let itemList = [];
                    items.forEach((item) => {
                        itemList.push(
                            new Item(
                                item._id,
                                item.text, 
                                item.amountAide,
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
        */
    }

    getItem(id: string) {
        if (this.items != undefined) {
            return this.items.find(data => data._id === id);
        } else {
            return this.getItems().subscribe(items => this.getItem(id));
        }
        // return this.http.get<Item>(`${Config.apiUrl}/henquiries/${id}`)
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
    /*
    private items = new Array<Item>(
        { id: 1, name: "Ter Stegen", role: "Goalkeeper" },
        { id: 3, name: "Piqué", role: "Defender" },
        { id: 4, name: "I. Rakitic", role: "Midfielder" },
        { id: 5, name: "Sergio", role: "Midfielder" },
        { id: 6, name: "Denis Suárez", role: "Midfielder" },
        { id: 7, name: "Arda", role: "Midfielder" },
        { id: 8, name: "A. Iniesta", role: "Midfielder" },
        { id: 9, name: "Suárez", role: "Forward" },
        { id: 10, name: "Messi", role: "Forward" },
        { id: 11, name: "Neymar", role: "Forward" },
        { id: 12, name: "Rafinha", role: "Midfielder" },
        { id: 13, name: "Cillessen", role: "Goalkeeper" },
        { id: 14, name: "Mascherano", role: "Defender" },
        { id: 17, name: "Paco Alcácer", role: "Forward" },
        { id: 18, name: "Jordi Alba", role: "Defender" },
        { id: 19, name: "Digne", role: "Defender" },
        { id: 20, name: "Sergi Roberto", role: "Midfielder" },
        { id: 21, name: "André Gomes", role: "Midfielder" },
        { id: 22, name: "Aleix Vidal", role: "Midfielder" },
        { id: 23, name: "Umtiti", role: "Defender" },
        { id: 24, name: "Mathieu", role: "Defender" },
        { id: 25, name: "Masip", role: "Goalkeeper" },
    );
    
    getItems(): Item[] {
        return this.items;
    }

    getItem(id: number): Item {
        return this.items.filter(item => item.id === id)[0];
    }
    */
}


