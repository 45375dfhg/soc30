import { Component, OnInit } from '@angular/core';
import { isIOS, isAndroid } from "tns-core-modules/platform";
import { Page } from "tns-core-modules/ui/page";
import { RadListViewComponent } from "nativescript-ui-listview/angular";
import { ListViewEventData } from "nativescript-ui-listview";

import { ItemService } from "../shared/services/item.service";
import { AppSettingsService } from '../shared/services/appsettings.service';
import { CalendarService } from "../shared/services/calendar.service";
import { Item } from "../shared/models/item";

import _ from "lodash";


declare var UIView, NSMutableArray, NSIndexPath;


@Component({
	moduleId: module.id,
	selector: 'calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

    private entries;
    private dates: string[] = [];
    
    // imported this way to avoid angular namespace problems
    // cant use imported service functions inside html
    formatDuration = this.itemService.formatDuration;
    formatDistance = this.itemService.formatDistance;
    formatStartTime = this.itemService.formatStartTime;
    formatStartTimeLong = this.itemService.formatStartTimeLong;
    formatCategory = this.itemService.formatCategory;
    formatCategoryByUser = this.itemService.formatCategoryByUser;
    formatTerra = this.itemService.formatTerra;
    formatTime = this.itemService.formatTime;
    formatLocation = this.itemService.formatLocation;
    getSubStrings = this.itemService.getSubStrings;
    getSubs = this.itemService.getSubs;
    setIcon = this.itemService.getCategoryIconName;

    constructor(
        private calendarService: CalendarService, 
        private page: Page, 
        private itemService: ItemService,
        private appSet: AppSettingsService) { }

    ngOnInit(): void {
        if(!this.appSet.getUser('guest')) {
            console.log('user is not a guest')
            this.receiveAndOrder();
        } else {
            console.log('user is a guest');
            // load dummy data
        }
    }

    // complete restructuring of the backend results to allow angular to 
    // itterate as efficiently as possible inside the template
    receiveAndOrder() {
        this.calendarService.getEntries().subscribe(
            result => { 
                // chaining the functions, using (result) as a initial value
                // this needs to be redone but works for now
                // technically a job for the backend but might scale badly
                // so its getting outsourced to frontend
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
                // console.log(output);
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

    // first sorts months by their natural order
    // then finds the index of the current months equal value
    // afterwards rearrganges the array as that 
    // everything after the and including the current month starts
    sortbyStartWithCurrentMonth(input) {
        let currMonth = +new Date(Date.now()).getMonth();
        let tmp = input.sort((month1, month2) => {
            return +month1.key > +month2.key
        })
        let tmpIdx = tmp.findIndex(month => {
            return +month.key === currMonth;
        })
        return tmp.slice(tmpIdx)
            .concat(tmp.slice(0, tmpIdx)); 
    }

    changeMonthNumToLiteral(input) {
        enum Months {JANUAR, FEBRUAR, MÄRZ, APRIL, MAI, JUNI, JULI, AUGUST, SEPTEMBER, OKTOBER, NOVEMBER, DEZEMBER};
        return input.map(month => 
            ({ key: Months[+month.key[0]], value: month.value })
        )
    }

	templateSelector(item: any, index: number, items: any): string {
        // expands the first element by default while the rest ain't
        if (index == 0) {
            return item.expanded ? "default" : "expanded";
        }
        return item.expanded ? "expanded" : "default";   
    }

    // expand functionality
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
}