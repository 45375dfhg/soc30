import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";


@Component({
    moduleId: module.id,
    templateUrl: "./navigation.component.html",
})
export class NavigationComponent {

    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute) { }

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
