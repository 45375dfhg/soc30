import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { isIOS, isAndroid } from "tns-core-modules/platform";
import { Item } from "../models/item";
import { Config } from "../config";

import { AppSettingsService } from './appsettings.service';

@Injectable()
export class ItemService {
    baseUrl = Config.apiUrl + "henquiries";

    private items: Item[];

    constructor(private http: HttpClient, private appSet: AppSettingsService) { }

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
        this.items = itemList;
        return itemList; 
    }
    
    // needs to be combined with formatDuration in some way
    public formatTerra(start, end) {
        let st = new Date(start);
        let en = new Date(end);
        let timeRaw = en.getTime() - st.getTime();
        let timeMinutes = Math.round((timeRaw / 1000 / 60));
        let value = timeMinutes / 30;
        return "Belohnung: " + value + " Terra";
    }

    // get duration of event by substration the start from end
    // converts the raw duration to rounded minutes
    public formatDuration(start, end) {
        let st = new Date(start);
        let en = new Date(end);
        let timeRaw = en.getTime() - st.getTime();
        let timeMinutes = Math.round((timeRaw / 1000 / 60));
        return "Dauer: " + timeMinutes + " Minuten";
    }

    // formats the distance to a displayable string
    // if distance < 1 aka < 1km the value is rounded and converted to hundred meters
    // otherwise return value string with a km value
    public formatDistance(distance) {
        if (distance == 9999) {
            return "Das bin ich! Da wohne ich!"
        }
        if (distance < 1) {
            return Math.floor(Math.round(distance * 10)) * 100 + "m von mir entfernt"
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

    // formats the start time
    // adds azero before the day / hour if the return value of the corresponding function
    // returns a single digit number
    // needs to be cleaned up too (just add some "lets" to avoid repeating function calls)
    public formatStartTime(start) {
        let time = new Date(start);
        return ((time.getDate() < 10) ? "0" + time.getDate() : time.getDate()) + "." 
                + (((time.getMonth() + 1) < 10) ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1)) 
                + ". um " + ((time.getHours() < 10) ? "0" + time.getHours() : time.getHours())
                + ":" + ((time.getMinutes() < 10) ? "0" + time.getMinutes() : time.getMinutes()) + " Uhr";
    }

    public formatCategoryByUser(cat, sub, creator, aide) {
        let result = [
            ["Reparieren", "Umräumen", "Umziehen"],
            ["Bügeln", "Einkaufen", "Handschuhe", "Kehren", "Müllrausbringen", "Schrubben", "Spühlen", "Sprühflasche", "Staubsaugen", "Wäsche aufhängen", "Wäsche waschen"],
            ["Kochen", "Spazierengehen", "Brettspiele spielen", "Vorlesen", "Gesellschaft"],
            ["Blumengießen", "Blumen pflanzen", "Blumen eintopfen", "Gärtern", "Heckenschneiden", "Rechen"],
            ["Gassigehen", "Käfigsäubern", "Tiere füttern"]
        ];
        if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            let stranger = '';
            console.log(currentUser._id)
            console.log(creator._id)
            if (currentUser._id == creator._id) {
                if (typeof aide == 'undefined' || aide.length == 0) {
                    return result[cat][sub] + ": Wir suchen noch jemanden für dich!"
                } else {
                    stranger = aide[0].firstname;
                    if (aide.length == 1) {
                        return result[cat][sub] + ": " + stranger + " kommt vorbei!"
                    } else {
                        return result[cat][sub] + ": " + stranger 
                            + "und " + (aide.length - 1) + " weitere Person kommt vorbei!"
                    }
                }
            } else {
                return result[cat][sub] + ": " + "Ich helfe " + creator.firstname + " aus!";
            }
        }
        
    }

    public formatCategory(category, subcategory) {
        let result = [
            ["Reparieren", "Umräumen", "Umziehen"],
            ["Bügeln", "Einkaufen", "Handschuhe", "Kehren", "Müllrausbringen", "Schrubben", "Spühlen", "Sprühflasche", "Staubsaugen", "Wäsche aufhängen", "Wäsche waschen"],
            ["Kochen", "Spazierengehen", "Brettspiele spielen", "Vorlesen", "Gesellschaft"],
            ["Blumengießen", "Blumen pflanzen", "Blumen eintopfen", "Gärtern", "Heckenschneiden", "Rechen"],
            ["Gassigehen", "Käfigsäubern", "Tiere füttern"]
        ];
        return result[category][subcategory];
    }

    public getSubElements(category) {
        let result = [
            ["Reparieren", "Umräumen", "Umziehen"],
            ["Bügeln", "Einkaufen", "Handschuhe", "Kehren", "Müllrausbringen", "Schrubben", "Spühlen", "Sprühflasche", "Staubsaugen", "Wäsche aufhängen", "Wäsche waschen"],
            ["Kochen", "Spazierengehen", "Brettspiele spielen", "Vorlesen", "Gesellschaft"],
            ["Blumengießen", "Blumen pflanzen", "Blumen eintopfen", "Gärtern", "Heckenschneiden", "Rechen"],
            ["Gassigehen", "Käfigsäubern", "Tiere füttern"]
        ];
        return result[category];
    }


    public getCategoryIconName(category, subcategory) {
        let result = [
            ["reparieren", "umraeumen", "umziehen"],
            ["buegeln", "einkaufen", "handschuhe", "kehren", "muellrausbringen", "schwamm", "seife", "sprhflasche", "staubsaugen", "waescheaufhaengen", "waeschewaschen"],
            ["kochen", "spazierengehen", "spielespielen", "vorlesen", "gesellschaft"],
            ["blumengieen", "blumenpflanzen", "blumentopf", "grtnern", "heckenschneiden", "rechen"],
            ["gassigehen", "kaefigsaeubern", "tierefuettern"]
        ];
        const iconPrefix = isAndroid ? "res://" : "res://";
        return iconPrefix + result[category][subcategory];
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