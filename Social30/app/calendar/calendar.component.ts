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

declare var UIView, NSMutableArray, NSIndexPath;


@Component({
	moduleId: module.id,
	selector: 'calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

	items: Item[] = []; // placeholder

    private entries = [];
    private dates: string[] = [];
    

    constructor(private calendarService: CalendarService, page: Page, private itemService: ItemService) {
        //page.actionBarHidden = true;
     }

    ngOnInit(): void {
		this.receiveAndOrder();
		this.items = this.itemService.getDummyItems(2); // placeholder
    }

    receiveAndOrder() {
        this.calendarService.getEntries().subscribe(
            result => { 
                // chaining the functions, using (result) as a initial value
                let output = _.flow([
                    this.groupEntries,
                    this.formatEntries, 
                    this.sortEntries, 
                    this.sortInnerEntries])
                (result);
                console.log(output);          
            },
            error => console.log(error)
        )
    }

    // groups the henquiries by their startTime (using date, month and year)
    groupEntries(input: Item[]) {
        return _.groupBy(input, entry => {
            let time = new Date(entry.startTime);
            return time.getDate() + '-' +  time.getMonth() + '-' + time.getFullYear();
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
            console.log(date1.key[0] > date2.key[0]);
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
        enum Months {JAN, FEB, MÄR, APR, MAI, JUN, JUL, AUG, SEP, OKT, NOV, DEZ};
        return input.map(date => 
            ({ key: Object.assign([], date.key, {1: Months[+date.key[1]]}), value: date.value
                .sort((henquiry1, henquiry2) => {
                    return +new Date(henquiry1.startTime) - +new Date(henquiry2.startTime);
                })
            })
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
            // UIView.animateWithDurationAnimations(0, () => {
                var indexPaths = NSMutableArray.new();
                indexPaths.addObject(NSIndexPath.indexPathForRowInSection(rowIndex, event.groupIndex));
                listView.ios.reloadItemsAtIndexPaths(indexPaths);
            // });
        }
        if (isAndroid) {
            listView.androidListView.getAdapter().notifyItemChanged(rowIndex);
        }
    }
	
}


 /*
        enum Months {JAN, FEB, MÄR, APR, MAI, JUN, JUL, AUG, SEP, OKT, NOV, DEZ};
        this.calendarService.getEntries().subscribe(
            result => {
                let groupedEntries = _.groupBy(result, entry => {
                        let time = new Date(entry.startTime);
                        return time.getDate() + '-' +  time.getMonth() + '-' + time.getFullYear();
                })
                let formattedEntries = Object.keys(groupedEntries).map(key => 
                    ({ key: key.split('-'), value: groupedEntries[key] }));
                let sortedEntries = formattedEntries.sort((date1, date2) => {
                    console.log(date1.key[0] > date2.key[0]);
                    return (date1.key[2] > date2.key[2]) ? 1 : ((date1.key[2] < date2.key[2]) ? -1 : 
                        ((date1.key[1] > date2.key[1]) ? 1 : ((date1.key[1] < date2.key[1]) ? -1 :
                        (date1.key[0] > date2.key[0]) ? 1 : ((date1.key[0] < date2.key[0]) ? -1 : 0))));
                })
                let sortedInnerEntries = sortedEntries.map(date => 
                    ({ key: Object.assign([], date.key, {1: Months[+date.key[1]]}), value: date.value
                        .sort((henquiry1, henquiry2) => {
                            return +new Date(henquiry1.startTime) - +new Date(henquiry2.startTime);
                        })
                    })
                )
                this.entries = sortedInnerEntries;
            },
            error => console.log(error)
        );
        */