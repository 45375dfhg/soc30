import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";

import { Observable, Subject, timer, throwError, from } from 'rxjs';
import { concatMap, map, merge, tap, take, switchMap, catchError } from 'rxjs/operators';

import { AppSettingsService } from '../shared/services/appsettings.service';
import { ChatService } from "../shared/services/chat.service";



@Component({
    moduleId: module.id,
    selector: "chat-detail",
    templateUrl: './chat.detail.component.html',
    styleUrls: ['./chat.detail.component.scss']
})
export class ChatDetailComponent implements OnInit {

    private id;

    // async
    // manualRefresh = new Subject();
    private polledMessageObj$: Observable<any>;
    private polledMessages$: Observable<any>;
    private polledAideId$: Observable<any>; 

    constructor(
        private chatService: ChatService,
        private route: ActivatedRoute,
        private routerExtension: RouterExtensions,
        private page: Page,
        private appSet: AppSettingsService) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        if (!this.appSet.getUser('guest')) {
            const msgObj$ = this.chatService.getSpecificChat(this.id);

            // polls the items from the stream above, maps them 
            this.polledMessageObj$ = timer(0, 500).pipe(
                concatMap(_ => msgObj$),
                map(res => {
                    this.polledMessages$ = res.messages;
                    this.polledAideId$ = res.aide._id;
                    return res;
                }),
                catchError(err => throwError(err))
            );
        }
    }

    userRole(id: number) {
        if (id > 2) {
            return "centerUser"
        }
        if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            if (id == 2) {
                if (currentUser._id == this.polledAideId$) {
                    return "leftUser";
                } else {
                    return "rightUser";
                }
            }
            if (id == 1) {
                if (currentUser._id == this.polledAideId$) {
                    return "rightUser";
                } else {
                    return "leftUser";
                }
            }
        } 
        /*
        if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            if (currentUser._id == this.polledAideId$) {
                if ()
            } else {
                
            }
        
        }
        */
    }

    public goBack() {
        this.routerExtension.back();
    }
}