import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

import { Page } from 'tns-core-modules/ui/page';


@Component({
    moduleId: module.id,
    templateUrl: "./navigation.component.html",
})
export class NavigationComponent {

    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute,
        private page: Page) { 
            page.actionBar.navigationButton.visibility = 'collapse'
        }

    ngOnInit() {
        this.routerExtension.navigate([{
            outlets: {
                itemsoutlet: ["items"],
                calenderoutlet: ["calender"],
                henquiryoutlet: ["henquiry"]
            }
        }],
            { relativeTo: this.activeRoute });
    }

    backActivatedRoute() {
        this.routerExtension.back({ relativeTo: this.activeRoute });
    }

    back() {
        this.routerExtension.back();
    }
}
