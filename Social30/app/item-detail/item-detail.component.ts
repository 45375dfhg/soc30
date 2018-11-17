import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import * as application from "tns-core-modules/application";
import { AndroidApplication, AndroidActivityBackPressedEventData } from "tns-core-modules/application";
import { isAndroid } from "tns-core-modules/platform";

import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";

@Component({
    selector: "ns-details",
    moduleId: module.id,
    templateUrl: "./item-detail.component.html",
})
export class ItemDetailComponent implements OnInit {
    item: Item;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private routerExtension: RouterExtensions
    ) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.params['id'];
        this.item = this.itemService.getItem(id);
        /*
        if (!isAndroid) {
            return;
        }
        application.android.on(AndroidApplication.activityBackPressedEvent, (data: AndroidActivityBackPressedEventData) => {
            data.cancel = true; // prevents default back button behavior
            this.goBack();
        });
        */
    }

    /*
    goBack() {
        this.router.navigate([
            'navigation', { outlets: { itemsoutlet: ['items'] } }
        ])
    }
    */
    public goBack() {
        this.routerExtension.back();
    }

}
