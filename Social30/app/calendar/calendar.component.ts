import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";

import { CalendarService } from "../shared/services/calendar.service";
import { Item } from "../shared/models/item";
import { isIOS, isAndroid } from "tns-core-modules/platform";
import { ListViewEventData } from "nativescript-ui-listview";
// import { KeysPipe } from '../shared/pipes/keys.pipe';
// import * as appSettings from "tns-core-modules/application-settings";

import _ from "lodash";
import { ItemService } from "../shared/services/item.service";
import { AppSettingsService } from '../shared/services/appsettings.service';

declare var UIView, NSMutableArray, NSIndexPath;


@Component({
	moduleId: module.id,
	selector: 'calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

	items: Item[] = []; // placeholder

    private entries;
    private dates: string[] = [];
    

    constructor(
        private calendarService: CalendarService, 
        private page: Page, 
        private itemService: ItemService,
        private appSet: AppSettingsService) {
        //page.actionBarHidden = true;
    }

    ngOnInit(): void {
		 this.receiveAndOrder();
		//this.items = this.itemService.getDummyItems(2); // placeholder
    }

    receiveAndOrder() {
        this.calendarService.getEntries().subscribe(
            result => { 
                // chaining the functions, using (result) as a initial value
                // this needs to be redone but works for now
                // new try at the very bottom of this file
                let output = _.flow([
                    this.groupEntries,
                    this.formatEntries, 
                    this.sortEntries, 
                    this.sortInnerEntries,
                    this.groupbyMonth,
                    this.formatEntries,
                    this.sortbyStartWithCurrentMonth,
                    this.changeMonthNumToLiteral
                ])
                (result);  
                this.log(output); // edit out
                this.entries = output;  
    
            },
            error => console.log(error)
        )
    }

    // check whether the user who posted the henquiry is the same as
    // the current user 
    requestDirection(id: string) {
        let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
        return (currentUser._id === id) ? true : false;
    }

    // groups the henquiries by their startTime (using date, month and year)
    groupEntries(input: Item[]) {
        return _.groupBy(input, entry => {
            let time = new Date(entry.startTime);
            // since we are in the lodash namespace we cant easily access
            // any outside functions so we just write the function here
            let func = function(day: number) {
                enum Days {SO, MO, DI, MI, DO, FR, SA};
                return Days[day];
            }
            return time.getDate() + '-' +  time.getMonth() 
                + '-' + time.getFullYear() + '-' + func(time.getDay());
        })
    }

    // changes the object to {key: string[], value: Item}[]
    // each object represents a specific day
    // key consists of [day,month,year] while value contains the henquiries of said day
    formatEntries(input: _.Dictionary<Item>) {
        return Object.keys(input).map(key => 
            ({ key: key.split('-'), value: input[key] }));
    }

    // since in previous functions the order of entries wasn't ensured
    // we do this here by sorting the objects inside the array by comparing the content of 
    // each objects "key" array
    sortEntries(input: {key: string[]; value: Item[];}[]) {
        return input.sort((date1, date2) => {
            return (date1.key[2] > date2.key[2]) ? 1 : ((date1.key[2] < date2.key[2]) ? -1 : 
                ((date1.key[1] > date2.key[1]) ? 1 : ((date1.key[1] < date2.key[1]) ? -1 :
                (date1.key[0] > date2.key[0]) ? 1 : ((date1.key[0] < date2.key[0]) ? -1 : 0))));
        })
    }

    // same as in sortEntries - we didn't ensure the order of henquiries for each date
    // so what we do (in a somewhat slow and verbose way) is to reconstruct the object
    // by reassigning the key value (while switching the month value to its respective month enum value)
    // value is assigned to its old but sorted value
    // sorting happens by extracting the startTime of each enquiry, using the unary operator to convert
    // the value to a number
    sortInnerEntries(input: {key: string[]; value: Item[];}[]) {
        return input.map(date => 
            ({ key: date.key, value: date.value
                .sort((henquiry1, henquiry2) => {
                    return +new Date(henquiry1.startTime) - +new Date(henquiry2.startTime);
                })
            })
        )
    }

    groupbyMonth(input: {key: any[] & string[] & {1: string;};value: Item[];}[]) {
        return _.groupBy(input, entry => {
            return entry.key[1];
        })
    }

    sortbyStartWithCurrentMonth(input) {
        let currMonth = +new Date(Date.now()).getMonth();
        let tmp = input.sort((month1, month2) => {
            return +month1.key < +month2.key
        })
        return tmp.slice(currMonth)
            .concat(tmp.slice(0, currMonth)); 
    }

    changeMonthNumToLiteral(input) {
        enum Months {JANUAR, FEBRUAR, MÄRZ, APRIL, MAI, JUNI, JULI, AUGUST, SEPTEMBER, OKTOBER, NOVEMBER, DEZEMBER};
        // keyDay: Days[+month.key[3]], 
        // Object.assign([], month.value, {key: }
        return input.map(month => 
            ({ key: Months[+month.key[0]], value: month.value })
        )
    }

	templateSelector(item: any, index: number, items: any): string {
        return item.expanded ? "expanded" : "default";
    }

    onItemTap(event: ListViewEventData) {
        const listView = event.object,
            rowIndex = event.index,
            dataItem = event.view.bindingContext;

        dataItem.expanded = !dataItem.expanded;
        if (isIOS) {
            // Uncomment the lines below to avoid default animation
            UIView.animateWithDurationAnimations(0, () => {
                var indexPaths = NSMutableArray.new();
                indexPaths.addObject(NSIndexPath.indexPathForRowInSection(rowIndex, event.groupIndex));
                listView.ios.reloadItemsAtIndexPaths(indexPaths);
            });
        }
        if (isAndroid) {
            listView.androidListView.getAdapter().notifyItemChanged(rowIndex);
        }
    }

    log = function() {
        var context = "My Descriptive Logger Prefix:";
        return Function.prototype.bind.call(console.log, console, context);
    }();
}

/*
                let output = _.chain(result)
                    .groupBy(entry => {
                        let time = new Date(entry.startTime);
                        return time.getDate() + '-' +  time.getMonth() + '-' + time.getFullYear();
                    })
                    .toPairs()
                    .groupBy(entry => {
                        return entry[0].split('-')[1];
                    })
                    .toPairs()
                    .sortBy(entry => {
                        return 1;
                    })
                    .value()
                console.log(output);
*/