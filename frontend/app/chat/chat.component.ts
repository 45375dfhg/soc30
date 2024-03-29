import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from '@angular/router';
import { Page } from "tns-core-modules/ui/page";

import { Observable, timer, throwError, BehaviorSubject } from 'rxjs';
import { concatMap, map, catchError, switchMap, tap } from 'rxjs/operators';

import { Button } from 'tns-core-modules/ui/button';
import * as dialogs from "tns-core-modules/ui/dialogs";

import { AppSettingsService } from '../shared/services/appsettings.service';
import { ChatService } from "../shared/services/chat.service";
import { ItemService } from '../shared/services/item.service'
import { getCategoryIconSource } from "../app.component";
import { RouterExtensions } from "nativescript-angular/router";


@Component({
    moduleId: module.id,
    selector: "chat",
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

    // async
    private polledChatOverview$: Observable<any>;
    private load$ = new BehaviorSubject('');

    // sync
    // private entries;
    private guest: boolean = false;
    private ex: boolean = true;
    private newMessage: boolean = false;

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
            const chatOverview$ = this.chatService.getChatsOverview();

            // polls the items from the stream above, maps them 
            this.polledChatOverview$ = this.load$.pipe(
                switchMap(_ => timer(0, 10000).pipe(
                    concatMap(_ => chatOverview$),
                    map(res => {
                        if (res.length === 0) {
                            this.ex = false;
                        }
                        return res;
                    }),
                    catchError(err => throwError(err))
                ))
            )
        }
    }

    // resets the timer of the polling
    refreshDataClick() {
        this.load$.next('');
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
                this.newMessage = true;
                return "Eine neue Nachricht."
            } else {
                this.newMessage = false;
                return "Alles gelesen."
            }
        } else {
            if (!item.readFiler) {
                this.newMessage = true;
                return "Eine neue Nachricht."
            } else {
                this.newMessage = false;
                return "Alles gelesen."
            }
        }
    }

    applyStatus(item) {
        if (this.userIsFiler(item)) {
            if (this.filerCanAcceptHenquiry(item)) {
                return 'Möchtest du ' + item.aide.firstname + ' annehmen?';
            }
            if (this.filerCanCloseHenquiry(item)) {
                return 'Den Termin festmachen?'
            }
            if (this.filerCanSuccessHenquiry(item)) {
                return 'Hat der Termin stattgefunden?'
            }
            if (this.userCanRate(item)) {
                return 'Du kannst ' + item.aide.firstname + ' bewerten!'
            }
        } else {
            if (this.aideCanCancelHenquiry(item)) {
                return 'Möchtest du absagen?'
            }
            if (!this.aideCanCancelHenquiry(item) && !this.userCanRate(item)) {
                return "Dein Gegenüber braucht noch."
            }
            if (this.userCanRate(item)) {
                return 'Du kannst ' + item.filer.firstname + ' bewerten!'
            }
        }
    }

    // https://stackoverflow.com/a/40665664
    onChangeCssClassButtonTap(args) {
        var button = args.object as Button;
        if (button.className == "icon deactivated") {
            button.className = "icon chatButtons"
        } else {
            button.className = "icon deactivated";
        }
        button.isEnabled = !button.isEnabled;
    }

    // just pass the whole item.henquiry object
    userIsFiler(item) {
        if (this.appSet.getUser('currentUser')) {
            let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
            if (item.henquiry.createdBy == currentUser._id) {
                return true;
            } else {
                return false;
            }
        }
    }

    cancelPossible(item): boolean {
        // if (this.aideCanCancelHenquiry(item) || this.filerCanCloseHenquiry(item)) {
        if (this.aideCanCancelHenquiry(item)) {
            return true;
        } else {
            return false;
        }
    }

    cancelTap(args, item) {
        this.onChangeCssClassButtonTap(args);
        if (this.aideCanCancelHenquiry(item)) {
            dialogs.confirm({
                title: "Bestätigung",
                message: "Wirklich absagen?",
                okButtonText: "Ja",
                cancelButtonText: "Nein",
            }).then(r => {
                if (r) {
                    this.itemService.cancelItem(item.henquiry._id).subscribe(
                        res => this.refreshDataClick()
                    );
                } else {
                    this.onChangeCssClassButtonTap(args);
                }
            });
        }
    }

    acceptPossible(item): boolean {
        if (this.filerCanAcceptHenquiry(item) || this.filerCanSuccessHenquiry(item) ||
            (this.filerCanCloseHenquiry(item))) {
            return true;
        } else {
            return false;
        }
    }

    // needs some better logic
    acceptTap(args, item) {
        this.onChangeCssClassButtonTap(args);
        if (this.filerCanAcceptHenquiry(item)) {
            let aide = item.aide._id;
            dialogs.confirm({
                title: "Bestätigung",
                message: "Diesen Helfer auswählen?",
                okButtonText: "Ja",
                cancelButtonText: "Nein",
            }).then(r => {
                if (r) {
                    this.onChangeCssClassButtonTap(args);
                    this.itemService.acceptItem(item.henquiry._id, aide).subscribe(
                        res => this.refreshDataClick());
                } else {
                    this.onChangeCssClassButtonTap(args);
                }
            })
            return;
        }
        if (this.filerCanCloseHenquiry(item)) {
            dialogs.confirm({
                title: "Bestätigung",
                message: "Den Termin finalisieren?",
                okButtonText: "Ja",
                cancelButtonText: "Noch nicht",
            }).then(r => {
                if (r) {
                    this.itemService.closeItem(item.henquiry._id).subscribe(
                        res => this.refreshDataClick()
                    );
                } else {
                    this.onChangeCssClassButtonTap(args);
                }
            });
            return;
        }
        if (this.filerCanSuccessHenquiry(item)) {
            dialogs.confirm({
                title: "Bestätigung",
                message: "Der Termin war erfolreich?",
                okButtonText: "Ja",
                cancelButtonText: "Leider nein",
            }).then(r => {
                if (r) {
                    this.itemService.successItem(item.henquiry._id).subscribe(
                        res => this.refreshDataClick()
                    );
                } else {
                    this.onChangeCssClassButtonTap(args);
                }
            })
            return;
        }
    }

    userCanRate(item): boolean {
        if (item.henquiry.happened) {
            return true;
        } else {
            return false;
        }
    }

    rateTap(args, item) {
        this.onChangeCssClassButtonTap(args);
    }

    roleForIdString(item) {
        if (this.userIsFiler(item)) {
            return item.aide.firstname + 'XY';
        } else {
            return item.filer.firstname + 'YZ';
        }
    }


    // REST/henquiries/cancel
    aideCanCancelHenquiry(item) {
        if (this.userIsFiler(item)) {
            return false;
        } else {
            if (item.henquiry.closed || item.henquiry.happened || item.henquiry.removed) {
                return false;
            } else {
                return true;
            }
        }
    }

    // REST/henquiries/accept
    filerCanAcceptHenquiry(item) {
        if (this.userIsFiler(item)) {
            if (item.henquiry.potentialAide == null) {
                return false;
            } else {
                if ((item.henquiry.closed === false) && (item.henquiry.happened === false) && (item.henquiry.removed === false)) {
                    if (item.henquiry.potentialAide.indexOf(item.aide._id) === -1) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }


    // REST/henquiries/close
    filerCanCloseHenquiry(item) {
        if (this.userIsFiler(item)) {
            if (!item.henquiry.happened) {
                if (item.henquiry.closed === false) {
                    if ((item.henquiry.aide == null) || (item.henquiry.aide.length < 1)) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }

    }


    /*
    let time = new Date(item.henquiry.endTime);
    if (Date.now() > time.getTime()) {
        return true;
    } else {
        return false;
    }
    */
    // uncomment to add a timer logic
    // REST/henquiries/success
    filerCanSuccessHenquiry(item) {
        if (this.userIsFiler(item)) {
            if (item.henquiry.happened) {
                return false;
            } else {
                if (item.henquiry.closed) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }

}
