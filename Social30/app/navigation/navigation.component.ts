import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";

import * as application from "tns-core-modules/application";


@Component({
    moduleId: module.id,
    templateUrl: "./navigation.component.html",
    styleUrls:  ["./navigation.component.scss"]
})
export class NavigationComponent {

    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute,
        page: Page) {
            page.actionBarHidden = true;
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
        application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
            args.cancel = true;
        });
        
    }

    /*
    backActivatedRoute() {
        this.routerExtension.back({ relativeTo: this.activeRoute });
    }

    back() {
        this.routerExtension.back();
    }
    */
}
