import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { Page } from "tns-core-modules/ui/page";

import { Observable, timer, throwError } from 'rxjs';
import { concatMap, map, catchError, tap } from 'rxjs/operators';

import { Button } from 'tns-core-modules/ui/button'

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
    formatStartTimeToDate = this.itemService.formatStartTimeToDate;
    formatStartTimeToDateDecimal = this.itemService.formatStartTimeToDateDecimal;
    getName = this.itemService.getName;
    getSubStrings = this.itemService.getSubStrings;
    getSubs = this.itemService.getSubs;
    getAvatar = this.itemService.getAvatar;
    getAvatarStrings = this.itemService.getAvatarStrings;
    setIcon = this.itemService.getCategoryIconName;

    public constructor(
        private chatService: ChatService,
        private page: Page,
        private router: Router,
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
                tap(res => console.log('tick')),
                map(res => res),
                catchError(err => throwError(err))
            );
        }
    }

    statusToAvatar(item) {
        if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            if (item.filer._id == currentUser._id) {
                return this.getAvatar(item.aide.avatar);
            } else {
                return this.getAvatar(item.filer.avatar);
            }
        }
    }

    // checks the reading status
    readStatus(item) {
        if (item.readFiler == null) {
            if (!item.readAide) {
                return "Eine neue Nachricht"
            } else {
                return "Alles gelesen"
            }
        } else {
            if (!item.readFiler) {
                return "Eine neue Nachricht"
            } else {
                return "Alles gelesen"
            }
        }
    }

    // https://stackoverflow.com/a/40665664
    onChangeCssClassButtonTap(args) {
        var button = args.object as Button;
        button.className = "icon deactivated";
        button.isEnabled = false;
    }

    // just pass the whole item.henquiry object
    userIsFiler(henquiry) {
        if ((henquiry.aide == null) || (henquiry.aide.length < 1)) {
            return false;
        } else {
            return true;
        }
    }

    cancelPossible(henquiry): boolean {
        if (this.aideCanCancelHenquiry(henquiry) || this.filerCanCloseHenquiry(henquiry)) {
            return true;
        } else {
            return false;
        }
    }

    cancelTap(args, henquiry) {
        this.onChangeCssClassButtonTap(args);
        if (this.aideCanCancelHenquiry(henquiry)) {
            console.log('reached cancelItem')
            this.itemService.cancelItem(henquiry._id).subscribe();
        } else {
            console.log('reached closeItem')
            this.itemService.closeItem(henquiry._id).subscribe();
        }
    }

    acceptPossible(henquiry): boolean {
        if (this.filerCanAcceptHenquiry(henquiry) || this.filerCanSuccessHenquiry(henquiry)) {
            return true;
        } else {
            return false;
        }
    }

    acceptTap(args, henquiry) {
        this.onChangeCssClassButtonTap(args);
        if (this.filerCanAcceptHenquiry(henquiry)) {
            let aide = henquiry.aide._id;
            this.itemService.acceptItem(henquiry._id, aide).subscribe();
        } else {
            this.itemService.successItem(henquiry._id).subscribe();
        }
    }

    userCanRate(henquiry) {
        if (henquiry.happened) {
            return true;
        } else {
            return false;
        }
    }

    rateTap(args, henquiry) {
        this.onChangeCssClassButtonTap(args);
        if (this.userIsFiler(henquiry)) {
            this.router.navigate([['../rating', 'X' + henquiry._id]])
        } else {
            this.router.navigate([['../rating', 'Y' + henquiry._id]])
        }
    }

    // REST/henquiries/cancel
    aideCanCancelHenquiry(henquiry) {
        if (this.userIsFiler(henquiry)) {
            return false;
        } else {
            return true;
        }
    }

    // REST/henquiries/accept
    filerCanAcceptHenquiry(henquiry) {
        if (this.userIsFiler(henquiry)) {
            if (henquiry.potentialAide == null) {
                return false;
            } else {
                if (henquiry.potentialAide.indexOf(henquiry.aide._id) == -1) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return false;
        }
    }

    // REST/henquiries/close
    filerCanCloseHenquiry(henquiry) {
        if (this.userIsFiler(henquiry)) {
            if ((henquiry.aide == null) || (henquiry.aide.length < 1)) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    // REST/henquiries/success
    filerCanSuccessHenquiry(henquiry) {
        if (this.userIsFiler(henquiry)) {
            let time = new Date(henquiry.endTime);
            if (Date.now() > time.getTime()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }
}
