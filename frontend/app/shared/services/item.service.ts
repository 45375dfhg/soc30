import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { isIOS, isAndroid } from "tns-core-modules/platform";
import { Item } from "../models/item";
import { Config } from "../config";

import { AppSettingsService } from './appsettings.service';

@Injectable()
export class ItemService {
    baseUrl = Config.apiUrl;

    private items: Item[];

    constructor(private http: HttpClient, private appSet: AppSettingsService) { }

    public getItems() {
        return this.http.get<Item[]>(this.baseUrl + "henquiries")
            .pipe(
                catchError(this.handleErrors('getItems'))
            );
    }

    public postItem(amount, start, end, cat) {
        // HttpParams is immutable so we need to concatinate
        // the .sets on creation
        let params = new HttpParams()
            .set('amountAide', amount)
            .set('startTime', start)
            .set('endTime', end)
            // needs to be stringify'd because otherwise we'd get [object object]
            .set('category', JSON.stringify(cat));

        console.log(params);

        return this.http.post<any>(this.baseUrl + "henquiries", params)
            .pipe(
                catchError(this.handleErrors('postItem'))
            );
    }

    public applyItem(id: string) {
        // HttpParams is immutable so we need to concatinate
        // the .sets on creation
        let params = new HttpParams()
            .set('henquiryId', id)

        return this.http.put<any>(this.baseUrl + "henquiries/apply", params)
            .pipe(
                catchError(this.handleErrors('applyItem'))
            );
    }

    public cancelItem(id: string) {
        let params = new HttpParams()
            .set('henquiryId', id)

        console.log('inside cancelItem')
        return this.http.put<any>(this.baseUrl + "henquiries/cancel", params)
            .pipe(
                catchError(this.handleErrors('cancelItem'))
            );
    }

    public acceptItem(id: string, amount) {
        let params = new HttpParams()
            .set('henquiryId', id)
            .set('applicants', amount);

        return this.http.put<any>(this.baseUrl + "henquiries/accept", params)
            .pipe(
                catchError(this.handleErrors('acceptItem'))
            );
    }

    public closeItem(id: string) {
        let params = new HttpParams()
            .set('henquiryId', id)

        console.log('inside closeItem')
        return this.http.put<any>(this.baseUrl + "henquiries/close", params)
            .pipe(
                catchError(this.handleErrors('closeItem'))
            );
    }

    public successItem(id: string) {
        let params = new HttpParams()
            .set('henquiryId', id)

        return this.http.put<any>(this.baseUrl + "henquiries/success", params)
            .pipe(
                catchError(this.handleErrors('successItem'))
            );
    }

    public rateItem(id: string, aideId: string, ratings) {
        let params = new HttpParams()
            .set('henquiryId', id)
            .set('aideId', aideId)
            // needs to be stringify'd because otherwise we'd get [object object]
            .set('ratings', JSON.stringify(ratings));

        return this.http.post<any>(this.baseUrl + "henquiries/rate", params)
            .pipe(
                catchError(this.handleErrors('rateItem'))
            );
    }

    public rateFilerItem(id: string, rating) {
        let params = new HttpParams()
            .set('henquiryId', id)
            // needs to be stringify'd because otherwise we'd get [object object]
            .set('ratings', JSON.stringify(rating));

        return this.http.post<any>(this.baseUrl + "henquiries/ratefiler", params)
            .pipe(
                catchError(this.handleErrors('rateFilerItem'))
            );
    }

    public getItem(id: string) {
        let params = new HttpParams()
            .set('henquiryId', id);

        return this.http.put<any>(this.baseUrl + "henquiries/specific", params)
            .pipe(
                catchError(this.handleErrors('getItem'))
            );
    }

    // creates dummy values for the guest access
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
                    { category: (i % 5), subcategory: (i % 4) },
                    {
                        id: "5bfbaf927f0ef567ba67bd20",
                        surname: "Musterman",
                        firstname: "Max",
                        nickname: "Das Beispiel",
                        avatar: (i % 6)
                    },
                    0.8 * (i + 1),
                    ''
                ));
        }
        this.items = itemList;
        return itemList;
    }

    // transforms the duration to terra
    public formatTerra(start, end) {
        let value = this.formatTime(start, end) / 30;
        return "Belohnung: " + value + " Terra";
    }

    public formatDuration(start, end) {
        let timeMinutes = this.formatTime(start, end);
        return "Dauer: " + timeMinutes + " Minuten";
    }

    // transforms end and start point to a duration in minutes
    public formatTime(start, end) {
        let st = new Date(start).getTime(), en = new Date(end).getTime();
        return Math.round(((en - st) / 1000 / 60))
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

    // no usage as of now (18-12-01)
    public formatStartTimeLong(start) {
        enum Days { Sonntag, Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag }
        enum Months { Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember };
        let time = new Date(start);
        let day = Days[time.getDay()];
        return "Am " + day + ", dem " + time.getDate() + ". " + Months[time.getMonth()];
    }

    // formats the start time
    // first checks whether the date is today (see: https://stackoverflow.com/a/8215631)
    // then checks for tomrrow 
    // (.getMonth() returns a value of 0 to 11 that's where the +1 comes from)
    public formatStartTime(start) {
        let time = new Date(start), today = new Date(), tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        let mth = time.getMonth(), day = time.getDate(), hour = time.getHours(), min = time.getMinutes();
        if (time.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0)) {
            return "Heute" + " um " + ((hour < 10) ? "0" + hour : hour) + ":" + ((min < 10) ? "0" + min : min) + " Uhr";
        }
        // reset the time value which got mutated by setHours and so on
        time = new Date(start)
        if (time.setHours(0, 0, 0, 0) == tomorrow.setHours(0, 0, 0, 0)) {
            return "Morgen" + " um " + ((hour < 10) ? "0" + hour : hour) + ":" + ((min < 10) ? "0" + min : min) + " Uhr";
        }
        // reset the time value which got mutated by setHours and so on
        time = new Date(start);
        return ((day < 10) ? "0" + day : day) + "." + (((mth + 1) < 10) ? "0" + (mth + 1) : (mth + 1))
            + ". um " + ((hour < 10) ? "0" + hour : hour) + ":" + ((min < 10) ? "0" + min : min) + " Uhr";
    }

    formatStartTimeToDate(start) {
        let time = new Date(start);
        enum Months { Januar, Februar, März, April, Mai, Juni, Juli, August, September, Oktober, November, Dezember };
        // return time.getDate() + '. ' +  Months[time.getMonth()];
        return time.getDate() + '.' + (time.getMonth() + 1);
    }

    formatStartTimeToDateDecimal(start) {
        let time = new Date(start);
        let mth = time.getMonth(), day = time.getDate();
        return ((day < 10) ? "0" + day : day) + "." + (((mth + 1) < 10) ? "0" + (mth + 1) : (mth + 1));
    }

    getName(item) {
        if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            if (item.filer._id == currentUser._id) {
                return item.aide.firstname + ' ' + item.aide.surname.slice(0, 1) + '.'
            } else {
                return item.filer.firstname + ' ' + item.filer.surname.slice(0, 1) + '.'
            }
        }
    }

    // formats the subcategory, creatorId and aide[] to a string which shows the direction of help
    // used by the calendar
    public formatCategoryByUser(cat, creator, aide) {
        let result = this.getSubs();
        // currentUser exists to avoid conflicts with guest modus
        if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            let stranger = '';
            // check whether the henquiry createdBy._id is the same as the currentUsers._id
            // if identical its the currentUser who requested help
            if (currentUser._id == creator._id) {
                // aide[] exists and contains more than one person to help
                if (typeof aide != 'undefined' && aide.length > 0) {
                    stranger = aide[0].firstname;
                    if (aide.length == 1) {
                        // result[cat.category][cat.subcategory] + ": " +
                        return stranger + " kommt vorbei!"
                    } else {
                        if (aide.length == 2) {
                            return stranger + "und eine weitere Person kommt vorbei!"
                        }
                        return stranger + "und " + (aide.length - 1) + " weitere Personen kommen vorbei!"
                    }
                } else {
                    // no aides just yet
                    // result[cat.category][cat.subcategory] + ": 
                    return "Wir suchen noch jemanden für dich!"
                }
            } else {
                // you have a date with a stranger
                // result[cat.category][cat.subcategory] + ": " + 
                return "Ich helfe " + creator.firstname + " aus!";
            }
        }
    }

    /*
        // formats the subcategory, creatorId and aide[] to a string which shows the direction of help
    // used by the calendar
    public formatCategoryByUser(cat, filerId, aideId) {
        let result = this.getSubs();
        // currentUser exists to avoid conflicts with guest modus
        if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            let stranger = '';
            if (currentUser._id == filerId) {
                stranger = 
            } else {

            }
        }
    }
    */

    public formatLocation(creator) {
        if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            if (currentUser._id == creator._id) {
                return "Bei dir Zuhause"
            } else {
                if (creator.address && creator.address.street) {
                    return creator.address.street + ' ' + creator.address.housenm + " in " + creator.address.city;
                } else {
                    return "Fehler"
                }
            }
        }
    }

    // returns subcategory html string
    public formatCategory(category, subcategory) {
        let result = this.getSubs();
        return result[category][subcategory];
    }

    // returns category html string array
    public getSubElements(category) {
        let result = this.getSubs();
        return result[category];
    }

    // returns subcategory icon string 
    public getCategoryIconName(category, subcategory) {
        let result = this.getSubStrings();
        const iconPrefix = isAndroid ? "res://" : "res://";
        return iconPrefix + result[category][subcategory];
    }

    getAvatar(num: number) {
        const iconPrefix = isAndroid ? "res://" : "res://";
        let result = this.getAvatarStrings();
        return iconPrefix + result[num];
    }

    public getAvatarStrings() {
        return ["woman01", "woman02", "woman03", "man01", "man02", "man03"];
    }

    // printable strings for html
    public getSubs() {
        return [
            ["Reparieren", "Umräumen", "Umziehen"],
            ["Bügeln", "Einkaufen", "Handschuhe", "Kehren", "Müll rausbringen", "Schrubben", "Spülen", "Reinigen", "Staubsaugen", "Wäsche aufhängen", "Wäsche waschen"],
            ["Kochen", "Spazieren gehen", "Brettspiele spielen", "Vorlesen", "Gesellschaft"],
            ["Blumen gießen", "Blumen pflanzen", "Blumen eintopfen", "Gärtnern", "Hecken schneiden", "Rechen"],
            ["Gassi gehen", "Käfig säubern", "Tiere füttern"]
        ];
    }

    // strings that represent pictures
    public getSubStrings() {
        return [
            ["reparieren", "umraeumen", "umziehen"],
            ["buegeln", "einkaufen", "handschuhe", "kehren", "muellrausbringen", "schwamm", "seife", "spruehflasche", "staubsaugen", "waescheaufhaengen", "waeschewaschen"],
            ["kochen", "spazierengehen", "spielespielen", "vorlesen", "gesellschaft"],
            ["blumengiessen", "blumenpflanzen", "blumentopf", "gaertnern", "heckenschneiden", "rechen"],
            ["gassigehen", "kaefigsaeubern", "tierefuettern"]
        ];
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
