import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";

import { Observable, timer } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

import { ItemService } from "../shared/services/item.service";
import { AppSettingsService } from '../shared/services/appsettings.service';
import { CalendarService } from "../shared/services/calendar.service";
import { getCategoryIconSource } from "../app.component";


@Component({
    moduleId: module.id,
    selector: "chat",
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

    polledCalendar$: Observable<any>;

    public constructor(
        private calendarService: CalendarService, 
        private page: Page, 
        private itemService: ItemService,
        private appSet: AppSettingsService) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        if(!this.appSet.getUser('guest')) {
            console.log('user is not a guest')
            // this.receiveAndOrder();
        } else {
            console.log('user is a guest');
            // this.guestData(this.calendarService.getGuestItems);
        }
    }

    getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}
}