import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page";

import { Observable, timer, throwError } from 'rxjs';
import { concatMap, map, catchError } from 'rxjs/operators';

import { AppSettingsService } from '../shared/services/appsettings.service';
import { ChatService } from "../shared/services/chat.service";
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
    private entries;
    private guest: boolean = false;

    public constructor(
        private chatService: ChatService,
        private page: Page,
        private appSet: AppSettingsService) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        if (!this.appSet.getUser('guest')) {
            // the stream
            const chatOverview$ = this.chatService.getChatsOverview();

            // polling every 10s, concatMap subscribes to the stream
            this.polledChatOverview$ = timer(0, 10000).pipe(
                concatMap(_ => chatOverview$),
                map(res => {
                    this.entries = res
                    return res
                }),
                catchError(err => throwError(err))
            );
        } else {
            this.guest = true;
        }
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }
}