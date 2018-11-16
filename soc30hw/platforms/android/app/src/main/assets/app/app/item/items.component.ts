import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";
import { map } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})
export class ItemsComponent implements OnInit {

    items: Item[] = [];

    // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
    // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
    constructor(private itemService: ItemService, private router: Router) { }

    ngOnInit(): void {
        this.receiveList();
    }

    receiveList() {
        this.itemService.getItems().subscribe(result => this.items = result);
    }

    navigateToDetails(id: number) {
        this.router.navigate([
            '/navigation', { outlets: { itemsoutlet: ['items', id] } }
        ])
    }
}