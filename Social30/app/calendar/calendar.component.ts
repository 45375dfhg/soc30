import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";

import { Item } from "../shared/models/item";
import { CalendarService } from "../shared/services/calendar.service";

import _ from "lodash";

@Component({
	moduleId: module.id,
	selector: 'calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

	entries: Item[] = [];

    constructor(private calendarService: CalendarService, page: Page) {
        //page.actionBarHidden = true;
     }

    ngOnInit(): void {
        this.receiveAndOrder();
    }

	// this needs to be changed to date
	// but otherwise works just fine 
    receiveAndOrder() {
        this.calendarService.getEntries().subscribe(
			result => {
				let tmp = _.groupBy(result, function(entry) {
					return entry.amountAide;
				});
				console.log(tmp);
			},
			error => console.log('receiveAndOrder failed')
		);
	}
	
}