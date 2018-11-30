import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { ItemBase } from "../shared/models/item";
import { Page } from "tns-core-modules/ui/page";
import { getCategoryIconSource } from "../app.component";
import { ItemService } from "../shared/services/item.service";




@Component({
    moduleId: module.id,
    selector: "henq-detail",
    templateUrl: './henquiry.detail.component.html',
    styleUrls: ['./henquiry.detail.component.scss']
})
export class HenquiryDetailComponent {
    private _item: ItemBase;
    

    id;
    idtype;

    setIcon = this.itemService.getCategoryIconName;

    constructor(private route: ActivatedRoute, private routerExtension: RouterExtensions, page: Page, private itemService: ItemService) {
        //page.actionBarHidden = true;
    }




    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.idtype = typeof this.id;
        let cat = this.id.slice(0, 1);
        let sub = this.id.slice(1);

        this._item = new ItemBase(
            Date.now() + (24 * 60 * 1000),
            1,
            9999);
    }

 
    get item(): ItemBase {
        return this._item;
    }

    public goBack() {
        this.routerExtension.back();
    }
}


