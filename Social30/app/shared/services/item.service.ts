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

    public formatDuration(start,end) {
        let st = new Date(start);
        let en = new Date(end);
        let timeRaw = en.getTime() - st.getTime();
        let timeMinutes = Math.round((timeRaw / 1000 / 60));
        return "Dauer: " + timeMinutes + " Minuten";
    }
    
    public formatDistance(distance) {
        if (distance == 9999) {
            return "Das bin ich! Da wohne ich!"
        }
        return Math.round(distance) + "km von mir entfernt";
    }
    
    public formatStartTimeLong(start) {
        enum Days { Sonntag, Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag }
        enum Months { Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember };
        let time = new Date(start);
        let day = Days[time.getDay()];
        return "Am " + day + ", dem " + time.getDate() + ". " + Months[time.getMonth()];
    }

    public formatCategory(category, subcategory) {
        let result = [
                        ["Reparieren", "Umräumen", "Umziehen"],
                        ["Bügeln", "Einkaufen", "Handschuhe", "Kehren", "Müllrausbringen", "Schrubben", "Spühlen", "Sprühflasche", "Staubsaugen", "Wäsche aufhängen", "Wäsche waschen"],
                        ["Kochen", "Spazierengehen", "Brettspiele spielen", "Vorlesen"],
                        ["Blumengießen", "Blumen pflanzen", "Blumen eintopfen", "Gärtern", "Heckenschneiden", "Rechen", "Schlammschlacht"],
                        ["Gassigehen", "Käfigsäubern", "Tiere füttern"]
                    ];
        return result[category][subcategory];
    }

    public formatStartTime(start) {
        let time = new Date(start); 
        return time.getDate() + "." + (time.getMonth() + 1) + 
            ". um " + ((time.getHours() < 10) ? "0" + time.getHours(): time.getHours()) 
            + ":" + time.getMinutes() + " Uhr";
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

/*
enum Category {"Schwerer Haushalt", "Leichter Haushalt", "Gesellschaft", "Gartenarbeit", "Tiere"};
enum Schwer {Reparieren, Umräumen, Umziehen};
enum Leicht {Bügeln, Einkaufen, Handschuhe, Kehren, Müllrausbringen, Schrubben, Spühlen, Sprühflasche, Staubsaugen, "Wäsche aufhängen", "Wäsche waschen"};
enum Gesell {Kochen, Spazierengehen, "Brettspiele spielen", Vorlesen};
enum Garten {Blumengießen, "Blumen pflanzen", "Blumen eintopfen", Gärtern, Heckenschneiden, Rechen, Schlammschlacht};
enum Tiere {Gassigehen, Käfigsäubern, "Tiere füttern"};
*/

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