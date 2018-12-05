import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";

import { Observable, timer } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { ItemService } from "../shared/services/item.service";
import { Item } from "../shared/models/item";
import { AppSettingsService } from '../shared/services/appsettings.service';
import { CalendarService } from "../shared/services/calendar.service";
import { getCategoryIconSource } from "../app.component";


@Component({
    moduleId: module.id,
    selector: "chat",
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    private polledCalendar$: Observable<Item[]>;
    private entries;

    public constructor(
        private calendarService: CalendarService, 
        private page: Page, 
        private itemService: ItemService,
        private appSet: AppSettingsService) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        if(!this.appSet.getUser('guest')) {
            // the stream
            const calendar$ = this.calendarService.getEntries();
            
            // polling every 10s, concatMap subscribes to the stream
            this.polledCalendar$ = timer(0, 10000).pipe(
                concatMap(_ => calendar$),
                map(res => {
                    // console.log('tick');
                    return this.entries = res})
            );
        } else {
            //  
        }
    }

    getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}
}