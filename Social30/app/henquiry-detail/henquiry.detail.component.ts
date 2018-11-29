import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Item } from "../shared/models/item";
import { Page } from "tns-core-modules/ui/page";
import { getCategoryIconSource } from "../app.component";



@Component({
    moduleId: module.id,
    selector: "henq-detail",
    templateUrl: './henquiry.detail.component.html',
    styleUrls: ['./henquiry.detail.component.scss']
})
export class HenquiryDetailComponent {
    private _item: Item;


    id;
    idtype;

    constructor(private route: ActivatedRoute, private routerExtension: RouterExtensions, page: Page) {
        //page.actionBarHidden = true;
    }



    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.idtype = typeof this.id;
        let cat = this.id.slice(0,1);
        let sub = this.id.slice(1);
        console.log(cat);
        this._item = new Item(
            Date.now() + (24 * 60 * 1000),
            Date.now() + (24.5 * 60 * 1000),
            1,
            { category: 1, subcategory: 1 },
            { _id: '', firstname: '', surname: '', nickname: '' },
            9999,
            '');

        // console.log(this._item);
    }

    get item(): Item {
        return this._item;
    }

    public goBack() {
        this.routerExtension.back();
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }



}


