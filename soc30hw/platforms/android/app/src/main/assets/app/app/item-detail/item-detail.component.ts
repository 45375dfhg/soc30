import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// import * as application from "tns-core-modules/application";

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
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = +this.route.snapshot.params['id'];
        this.item = this.itemService.getItem(id);
        /*
        application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
            args.cancel = true;
            this.goBack();
        });
        */
    }

    goBack() {
        this.router.navigate([
            'navigation', {outlets: { itemsoutlet: ['items']}}
        ])
    }
}
