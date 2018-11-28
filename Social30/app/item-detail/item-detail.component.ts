import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import { Item } from "../shared/models/item";
import { ItemService } from "../shared/services/item.service";

@Component({
    selector: "ns-details",
    moduleId: module.id,
    templateUrl: "./item-detail.component.html",
    styleUrls:  ["./items-detail.component.scss"]
})
export class ItemDetailComponent implements OnInit {
    item: Item;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private routerExtension: RouterExtensions
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        //this.item = this.itemService.getItem(id);
        this.item = this.itemService.getDummyItem(id);
    }

    public goBack() {
        this.routerExtension.back();
    }

    /*
    goBack() {
        this.router.navigate([
            'navigation', { outlets: { itemsoutlet: ['items'] } }
        ])
    }
    */

}
