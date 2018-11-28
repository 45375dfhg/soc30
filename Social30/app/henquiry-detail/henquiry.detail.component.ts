import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import { Page } from "tns-core-modules/ui/page";
import { getCategoryIconSource } from "../app.component";
// import { FontStyles, PropertyEditor, RadDataForm } from "nativescript-ui-dataform";

@Component({
    moduleId: module.id,
    selector: "henq-detail",
    templateUrl: './henquiry.detail.component.html',
    styleUrls: ['./henquiry.detail.component.scss']
})
export class HenquiryDetailComponent {

    id;
    idtype;

    constructor(private route: ActivatedRoute, private routerExtension: RouterExtensions, page: Page) { 
        //page.actionBarHidden = true;
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        this.idtype = typeof this.id;
    }

    public goBack() {
        this.routerExtension.back();
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }

}

