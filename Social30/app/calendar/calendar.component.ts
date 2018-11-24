import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";

import { CalendarService } from "../shared/services/calendar.service";
import { Item } from "../shared/models/item";

import { KeysPipe } from '../shared/pipes/keys.pipe';

import _ from "lodash";

@Component({
	moduleId: module.id,
	selector: 'calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {

	private entries = [];
	private dates: string[] = [];

    constructor(private calendarService: CalendarService, page: Page) {
        //page.actionBarHidden = true;
     }

    ngOnInit(): void {
		this.receiveAndOrder();
    }

	receiveAndOrder() {
        this.calendarService.getEntries().subscribe(
			result => {
				let sortedEntries = _(result)
					.groupBy(entry => {
						let time = new Date(entry.startTime);
						return time.getDate() + '-' +  time.getMonth() + '-' + time.getFullYear();
					})
					.forEach((henquiries, date) => {
						this.dates.push(date);
						this.entries.push(henquiries);
					})
			},
			error => console.log(error)
		);
	}
	
}
