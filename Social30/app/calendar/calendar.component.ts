import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";

import { Item } from "../shared/models/item";
import { CalendarService } from "../shared/services/calendar.service";

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

	
    receiveAndOrder() {
        this.calendarService.getEntries().subscribe(
			result => {
				console.log(result);
			},
			error => console.log('receiveAndOrder failed')
		);
	}
	
}