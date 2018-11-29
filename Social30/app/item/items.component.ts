import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { RouterExtensions } from 'nativescript-angular/router';
import { getCategoryIconSource } from "../app.component";

import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";
import { AppSettingsService } from '../shared/services/appsettings.service';

// import * as application from "tns-core-modules/application";
// import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

import { isIOS, isAndroid } from "tns-core-modules/platform";
import { ListViewEventData } from "nativescript-ui-listview";

import { AuthenticationService } from '../shared/services/authentication.service';

declare var UIView, NSMutableArray, NSIndexPath;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
    styleUrls:  ["./items.component.scss"]
})
export class ItemsComponent implements OnInit {

    items: Item[] = [];
    
    // imported this way to avoid angular namespace problems
    formatDuration = this.itemService.formatDuration;
    formatDistance = this.itemService.formatDistance;
    formatStartTime = this.itemService.formatStartTime;
    formatStartTimeLong = this.itemService.formatStartTimeLong;
    formatCategory = this.itemService.formatCategory;

    constructor(
        private itemService: ItemService, 
        private router: RouterExtensions, 
        private appSet: AppSettingsService,
        private authenticationService: AuthenticationService,
        private page: Page,
        ) {
            //page.actionBarHidden = true;
    }

    ngOnInit(): void {
        if(!this.appSet.getUser('guest')) {
            console.log('user is not a guest')
            this.receiveList();
        } else {
            console.log('user is a guest');
            // load dummy data
        }
    }

    receiveList() {
        this.itemService.getItems().subscribe(result => {
            if (result) {
                this.items = result;
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

