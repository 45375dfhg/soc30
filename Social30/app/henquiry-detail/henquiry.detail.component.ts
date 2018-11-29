import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Item } from "../shared/models/item";
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
    id;
    idtype;

    subNames: String[];

    setIcon = this.itemService.getCategoryIconName;

    constructor(private route: ActivatedRoute, private routerExtension: RouterExtensions, page: Page, private itemService: ItemService) {
        //page.actionBarHidden = true;
    }


    getCategoryIconSource(icon: string): string {
        console.log(icon);
        //return this.itemService.getCategoryIconName();
        return "j";

    }



    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.idtype = typeof this.id;
        let cat = this.id.slice(0,1);
        let sub = this.id.slice(1);


        this.subNames = this.itemService.getSubElements(cat);
        console.log(this.subNames);

    

        


        // console.log(this._item);
    }


    public goBack() {
        this.routerExtension.back();
    }
}


