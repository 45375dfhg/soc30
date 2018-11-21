import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";

import { getCategoryIconSource } from "../app.component";

import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";

import * as application from "tns-core-modules/application";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";


@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
    styleUrls:  ["./items.component.scss"]
})
export class ItemsComponent implements OnInit {

    items= new ObservableArray([
        { "id": 1, "name": "Item 1", "description": "This is item description.", "title": "This is item Title", "text": "This is item Text",  "image": "This is item Image", "selected": false },
        { "id": 2, "name": "Item 2", "description": "This is item description.", "title": "This is item Title", "text": "This is item Text",  "image": "This is item Image", "selected": false },
        { "id": 3, "name": "Item 3", "description": "This is item description.", "title": "This is item Title", "text": "This is item Text",  "image": "This is item Image", "selected": false },
        { "id": 4, "name": "Item 4", "description": "This is item description.", "title": "This is item Title", "text": "This is item Text",  "image": "This is item Image", "selected": false },
        { "id": 5, "name": "Item 5", "description": "This is item description.", "title": "This is item Title", "text": "This is item Text",  "image": "This is item Image", "selected": false },
        { "id": 6, "name": "Item 6", "description": "This is item description.", "title": "This is item Title", "text": "This is item Text",  "image": "This is item Image", "selected": false },
        { "id": 7, "name": "Item 7", "description": "This is item description.", "title": "This is item Title", "text": "This is item Text",  "image": "This is item Image", "selected": false },
        { "id": 8, "name": "Item 8", "description": "This is item description.", "title": "This is item Title", "text": "This is item Text",  "image": "This is item Image", "selected": false },
        { "id": 9, "name": "Item 9", "description": "This is item description.", "title": "This is item Title", "text": "This is item Text",  "image": "This is item Image", "selected": false },
        { "id": 10, "name": "Item 10", "description": "This is item description.", "title": "This is item Title", "text": "This is item Text",  "image": "This is item Image" , "selected": false},
    ]);

    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    constructor(private itemService: ItemService, private router: Router, page: Page) {
        //page.actionBarHidden = true;
     }

    ngOnInit(): void {
        //this.items = this.itemService.getDummyItems(10);
        //this.receiveList();
    }

    receiveList() {
        this.itemService.getItems().subscribe(result => this.items = result);
    }
   
    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }

}

