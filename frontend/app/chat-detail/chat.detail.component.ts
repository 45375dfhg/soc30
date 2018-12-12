import { Component, OnInit, ViewChild, ElementRef  } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";

import { Observable, timer, throwError, BehaviorSubject } from 'rxjs';
import { concatMap, map, switchMap, catchError } from 'rxjs/operators';

import { AppSettingsService } from '../shared/services/appsettings.service';
import { ChatService } from "../shared/services/chat.service";



@Component({
    moduleId: module.id,
    selector: "chat-detail",
    templateUrl: './chat.detail.component.html',
    styleUrls: ['./chat.detail.component.scss']
})
export class ChatDetailComponent implements OnInit {

    @ViewChild("ScrollList") scrollList:ElementRef;

    // sync
    private id: string;
    private msg: string = '';

    // async
    private load$ = new BehaviorSubject('');
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
            this.polledMessageObj$ = this.load$.pipe(
                switchMap(_ => timer(0, 10000).pipe(
                    concatMap(_ => msgObj$),
                    map(res => {
                        this.polledMessages$ = res.messages;
                        this.polledAideId$ = res.aide._id;
                        return res;
                    }),
                    catchError(err => throwError(err))
                ))
            )
        }
    }

    ngAfterViewInit(){
        setTimeout(() => {
            this.scrollList.nativeElement.scrollToVerticalOffset(this.scrollList.nativeElement.scrollableHeight, false)
        }, 200);
    }

    // resets the timer of the polling
    refreshDataClick() {
        this.load$.next('');
    }

    sendMessage(msg: string) {
        console.log(msg);
        if (msg.replace(/\s/g,'').length < 1) {
            return
        }
        this.chatService.sendChatMessage(this.id, msg).subscribe(
            res => {
                this.msg = '';
                this.refreshDataClick();
            }
        );
        setTimeout(() => {
            this.scrollList.nativeElement.scrollToVerticalOffset(this.scrollList.nativeElement.scrollableHeight, false)
        }, 300);
    }

    cleanString(msg: string) {
        return this.msg.toString();
    }

    // derive the css class of a text by using the message id,
    // the currentUser._id and the polledAideId 
    userRole(id: number) {
        // system message
        if (id > 2) {
            return "center"
        }
        // user message
        if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            // message from filer
            if (id == 2) {
                if (currentUser._id == this.polledAideId$) {
                    // current user is the aide so the message comes from the other party
                    return "left";
                } else {
                    return "right";
                }
            }
            // message from aide
            if (id == 1) {
                if (currentUser._id == this.polledAideId$) {
                    // current user is the aide so its the users message
                    return "right";
                } else {
                    return "left";
                }
            }
        }
    }

    public goBack() {
        this.routerExtension.back();
    }
}

/*
          timer(0, 10000).pipe(
                merge(this.manualRefresh),
                concatMap(_ => msgObj$),
                map(res => {
                    this.polledMessages$ = res.messages;
                    this.polledAideId$ = res.aide._id;
                    return res;
                }),
                catchError(err => throwError(err))
            );
        }
        */