import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";

import { CalendarService } from "../shared/services/calendar.service";
import { Item } from "../shared/models/item";
import { isIOS, isAndroid } from "tns-core-modules/platform";
import { ListViewEventData } from "nativescript-ui-listview";
import { KeysPipe } from '../shared/pipes/keys.pipe';
import * as appSettings from "tns-core-modules/application-settings";
declare var UIView, NSMutableArray, NSIndexPath;


import _ from "lodash";





import { ItemService } from "../shared/services/item.service";

@Component({
	moduleId: module.id,
	selector: 'calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {


	items: Item[] = [];




	private entries = [];
	private dates: string[] = [];

    constructor(private calendarService: CalendarService, page: Page, private itemService: ItemService) {
        //page.actionBarHidden = true;
     }

    ngOnInit(): void {
		//this.receiveAndOrder();

		this.items = this.itemService.getDummyItems(2);
    }

receiveAndOrder() {
       this.calendarService.getEntries().subscribe(
            result => {
                let sortedEntries = _.groupBy(result, entry => {
                        let time = new Date(entry.startTime);
                        return time.getDate() + '-' +  time.getMonth() + '-' + time.getFullYear();
                })
                this.entries = Object.keys(sortedEntries).map(key => ({ key, value: sortedEntries[key] }));
            },
            error => console.log(error)
        );
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
