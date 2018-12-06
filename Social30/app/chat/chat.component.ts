import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";

import { Observable, timer, throwError } from 'rxjs';
import { concatMap, map, catchError } from 'rxjs/operators';

import { AppSettingsService } from '../shared/services/appsettings.service';
import { ChatService } from "../shared/services/chat.service";
import { ItemService } from '../shared/services/item.service'
import { getCategoryIconSource } from "../app.component";


@Component({
    moduleId: module.id,
    selector: "chat",
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    // async
    private polledChatOverview$: Observable<any>;

    // sync
    // private entries;
    private guest: boolean = false;

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

    public constructor(
        private chatService: ChatService,
        private page: Page,
        private appSet: AppSettingsService,
        private itemService: ItemService) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        if (!this.appSet.getUser('guest')) {
            // the stream
            const chatOverview$ = this.chatService.getChatsOverview();

            // polling every 10s, concatMap subscribes to the stream
            this.polledChatOverview$ = timer(0, 10000).pipe(
                concatMap(_ => chatOverview$),
                map(res => res),
                catchError(err => throwError(err))
            );
        } 
    }

    // checks the reading status
    truthValue(filer, aide) {
        // check for undefined or null
        if (filer == null) {
            if (aide) {
                return "Eine neue Nachricht"
            } else {
                return "Alles gelesen"
            }
        } else {
            if (filer) {
                return "Eine neue Nachricht"
            } else {
                return "Alles gelesen"
            }
        }
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }
}