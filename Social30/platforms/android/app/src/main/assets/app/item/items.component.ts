import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";

import { getCategoryIconSource } from "../app.component";

import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";

import * as application from "tns-core-modules/application";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";


import { isIOS, isAndroid } from "platform";
import { ListViewEventData } from "nativescript-ui-listview";
declare var UIView, NSMutableArray, NSIndexPath;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
    styleUrls:  ["./items.component.scss"]
})
export class ItemsComponent implements OnInit {

    items: Item[] = [];

    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    constructor(private itemService: ItemService, private router: Router, page: Page) {
        //page.actionBarHidden = true;
     }

    ngOnInit(): void {
        //this.items = this.itemService.getDummyItems(10);
        this.receiveList();
    }

    receiveList() {
        this.itemService.getItems().subscribe(result => this.items = result);
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

