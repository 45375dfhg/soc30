import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";

import { getCategoryIconSource } from "../app.component";

import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";

// import * as application from "tns-core-modules/application";
// import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";

import { isIOS, isAndroid } from "tns-core-modules/platform";
import { ListViewEventData } from "nativescript-ui-listview";

import * as appSettings from "tns-core-modules/application-settings";
declare var UIView, NSMutableArray, NSIndexPath;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
    styleUrls:  ["./items.component.scss"]
})
export class ItemsComponent implements OnInit {

    items: Item[] = [];

    constructor(private itemService: ItemService, private router: Router, page: Page) {
        //page.actionBarHidden = true;
     }

    ngOnInit(): void {
        // console.log('currentuserItem: ', appSettings.getString('currentUser'));
        // console.log('currentUser.tokenItem ', JSON.parse(appSettings.getString('currentUser')).token);
        //this.items = this.itemService.getDummyItems(10);
        this.receiveList();
        
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
   
    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
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
            // UIView.animateWithDurationAnimations(0, () => {
                var indexPaths = NSMutableArray.new();
                indexPaths.addObject(NSIndexPath.indexPathForRowInSection(rowIndex, event.groupIndex));
                listView.ios.reloadItemsAtIndexPaths(indexPaths);
            // });
        }
        if (isAndroid) {
            listView.androidListView.getAdapter().notifyItemChanged(rowIndex);
        }
    }

}

