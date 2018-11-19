import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";


import { getCategoryIconSource } from "../app.component";


import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";


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
        page.actionBarHidden = true;
     }

    ngOnInit(): void {
        this.receiveList();
    }

    receiveList() {
        this.itemService.getItems().subscribe(result => this.items = result);
    }

    navigateToDetails(id: number) {
        this.router.navigate([
            '../item', id
        ])
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }

}

