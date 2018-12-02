import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RadListViewComponent } from "nativescript-ui-listview/angular";
import { RouterExtensions } from 'nativescript-angular/router';
import { getCategoryIconSource } from "../app.component";

import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";
import { AppSettingsService } from '../shared/services/appsettings.service';

// import * as application from "tns-core-modules/application";
// import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

import { isIOS, isAndroid } from "tns-core-modules/platform";
import { ListViewEventData } from "nativescript-ui-listview";

import { AuthenticationService} from '../shared/services/authentication.service';
import { DataService } from '../shared/services/data.service';

declare var UIView, NSMutableArray, NSIndexPath;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
    styleUrls:  ["./items.component.scss"],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent implements OnInit {

    items: Item[] = [];
    // @Input()
    // @ViewChild("myListView") listViewComponent: RadListViewComponent;
    message: { categories: boolean[], time: number ,distance: number }; // basically filter values
    
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
        private cd: ChangeDetectorRef,
        private page: Page,
        ) { 
            // subscribe to changes in the message (which is the badly named filter)
            this.data.currentMessage.subscribe(message => this.message = message) 
        }

    ngOnInit(): void {
        // checks whether the user is a guest or not
        if (!this.appSet.getUser('guest')) {
            this.receiveList();
        } else {
            this.items = this.itemService.getGuestItems(12);
        }
    }

    receiveList() {
        this.itemService.getItems().subscribe(result => {
            if (result) {
                let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
                this.items = result
                    .filter(entry => currentUser._id != entry.createdBy._id)
                    .filter(fdist => fdist.distance <= this.message.distance)
                    .filter(ftime => +this.formatTime(ftime.startTime, ftime.endTime) <= this.message.time)
                    // this filter needs to be properly alligned
                    // .filter(filtercat => this.message.categories[filtercat.category])
                    .sort((entry1, entry2) => {
                            let date1 = new Date(entry1.startTime).getTime();
                            let date2 = new Date(entry2.startTime).getTime();
                            return date1 - date2
                    });
                // this.cd.detectChanges();
            } else {
                console.log('Didnt get any items')
            }
        });
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
    
}

