import { Component, OnInit } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
import { getCategoryIconSource } from "../app.component";

import { Observable, Subject, timer } from 'rxjs';
import { concatMap, map, merge } from 'rxjs/operators';

import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";
import { AppSettingsService } from '../shared/services/appsettings.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { DataService } from '../shared/services/data.service';

import { Button } from 'tns-core-modules/ui/button'
import { isIOS, isAndroid } from "tns-core-modules/platform";
import { alert } from "tns-core-modules/ui/dialogs";
import { ListViewEventData } from "nativescript-ui-listview";

declare var UIView, NSMutableArray, NSIndexPath;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
    styleUrls: ["./items.component.scss"],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent implements OnInit {

    // sync 
    items: Item[] = [];
    message: { categories: boolean[], time: number, distance: number }; // basically filter values
    guest: Boolean = false;

    // async
    manualRefresh = new Subject();
    polledItems$: Observable<any>;

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

    constructor(
        private itemService: ItemService,
        private router: RouterExtensions,
        private appSet: AppSettingsService,
        private authenticationService: AuthenticationService,
        private data: DataService,
        private page: Page,
    ) {
        // subscribe to changes in the message (which is the badly named filter)
        this.data.currentMessage.subscribe(message => this.message = message)
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        // checks whether the user is a guest or not
        if (!this.appSet.getUser('guest')) {
            const items$ = this.itemService.getItems();

            this.polledItems$ = timer(0, 100000).pipe(
                merge(this.manualRefresh),
                concatMap(_ => items$),
                map(res => {
                    let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
                    return res
                        .filter(entry => currentUser._id != entry.createdBy._id)
                        .filter(fdist => fdist.distance <= this.message.distance)
                        .filter(ftime => +this.formatTime(ftime.startTime, ftime.endTime) <= this.message.time)
                        .filter(filtercat => this.message.categories[filtercat.category.category])
                        .sort((entry1, entry2) => {
                            let date1 = new Date(entry1.startTime).getTime();
                            let date2 = new Date(entry2.startTime).getTime();
                            return date1 - date2
                        });
                }
                )
            );
        } else {
            this.guest = true;
            this.items = this.itemService.getGuestItems(12);
        }
    }

    onClick(id, event) {
        if (!this.appSet.getUser('guest')) {
            this.applyTo(id);
        } else {
            alert({
                title: "Du bist ein Gast ",
                message: "und der gute Herr Mustermann ist gar nicht echt.",
                okButtonText: "Achso"
            })
        }
        this.onChangeCssClassButtonTap(event);
    }

    // https://stackoverflow.com/a/40665664
    onChangeCssClassButtonTap(args) {
        var button = args.object as Button;
        button.className = "greyButton";
        button.isEnabled = false;
    }


    applyTo(id) {
        this.itemService.applyItem(id).subscribe(
            res => console.log('suc'),
            err => {
                if (err instanceof HttpErrorResponse) {
                    console.log(`Status: ${err.status}, ${err.statusText}`);
                }
            });
    }

    refreshDataClick() {
        if (!this.appSet.getUser('guest')) {
            this.manualRefresh.next('');
        }
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(["/welcome"], { clearHistory: true });
    }

    templateSelector(item: any, index: number, items: any): string {
        return item.expanded ? "expanded" : "default";
    }

    onItemTap(event: ListViewEventData) {
        const listView = event.object,
            rowIndex = event.index,
            dataItem = event.view.bindingContext;

        dataItem.expanded = !dataItem.expanded;
        if (isIOS) {
            // Uncomment the lines below to avoid default animation
            UIView.animateWithDurationAnimations(0, () => {
                var indexPaths = NSMutableArray.new();
                indexPaths.addObject(NSIndexPath.indexPathForRowInSection(rowIndex, event.groupIndex));
                listView.ios.reloadItemsAtIndexPaths(indexPaths);
            });
        }
        if (isAndroid) {
            listView.androidListView.getAdapter().notifyItemChanged(rowIndex);
        }
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }

    /*
    receiveList() {
        this.itemService.getItems().subscribe(result => {
            if (result) {
                let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
                this.items = result
                    .filter(entry => currentUser._id != entry.createdBy._id)
                    .filter(fdist => fdist.distance <= this.message.distance)
                    .filter(ftime =https://stackoverflow.com/a/40756855> +this.formatTime(ftime.startTime, ftime.endTime) <= this.message.time)
                    .filter(filterchttps://stackoverflow.com/a/40756855at => this.message.categories[filtercat.category.category])
                    .sort((entry1, https://stackoverflow.com/a/40756855entry2) => {
                        let date1 = new Date(entry1.startTime).getTime();
                        let date2 = new Date(entry2.startTime).getTime();
                        return date1 - date2
                    });
            } else {
                console.log('Didnt get any items')
            }
        });
    }
    */

}

