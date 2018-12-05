import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";
import { Page, isAndroid } from "tns-core-modules/ui/page";

import * as application from "tns-core-modules/application";


@Component({
    moduleId: module.id,
    templateUrl: "./navigation.component.html",
    styleUrls: ["./navigation.component.scss"]
})
export class NavigationComponent {

    homeTab: any;
    calendarTab: any;
    createTab: any;
    chatTab: any;
    profileTab: any;

    constructor(
        private routerExtension: RouterExtensions,
        private activeRoute: ActivatedRoute,
        private page: Page) {
        page.actionBarHidden = true;
        this.page.enableSwipeBackNavigation = false;
        this.homeTab = { iconSource: this.getIconSource("homehalf") };
        this.calendarTab = { iconSource: this.getIconSource("calenderhalf") };
        this.createTab = { iconSource: this.getIconSource("add") };
        this.chatTab = { iconSource: this.getIconSource("messageshalf") };
        this.profileTab = { iconSource: this.getIconSource("profilhalf") };
    }

    ngOnInit() {
        this.routerExtension.navigate([{
            outlets: {
                itemsoutlet: ["items"],
                calendaroutlet: ["calendar"],
                henquiryoutlet: ["henquiry"],
                chatoutlet: ["chat"],
                profileoutlet: ["profile"]
            }
        }],
            { relativeTo: this.activeRoute });
        if (isAndroid) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
                args.cancel = true;
            });
        }
    }
    // https://github.com/NativeScript/NativeScript/issues/3911#issuecomment-419023299
    // workaround to have dynamic icons
    tabViewIndexChange(args) {
        const index = args.newIndex;
        this.homeTab = { iconSource: this.getIconSource(index === 0 ? "homefull" : "homehalf") };
        this.calendarTab = { iconSource: this.getIconSource(index === 1 ? "calenderfull" : "calenderhalf") };
        this.createTab = { iconSource: this.getIconSource(index === 2 ? "add" : "add") };
        this.chatTab = { iconSource: this.getIconSource(index === 3 ? "messagesfull" : "messageshalf") };
        this.profileTab = { iconSource: this.getIconSource(index === 4 ? "profilefull" : "profilhalf") };
 
    }

    getIconSource(icon: string): string {
        const iconPrefix = isAndroid ? "res://" : "res://";
        return iconPrefix + icon;
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
