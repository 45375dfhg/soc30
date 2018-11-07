import {Component, ViewChild, ElementRef, OnInit, AfterViewInit} from "@angular/core";
import { isAndroid } from "tns-core-modules/platform";
import { TabView } from "ui/tab-view";
import { SwipeGestureEventData, SwipeDirection } from "ui/gestures";


@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

    @ViewChild("tabview") tabview!: ElementRef<TabView>;

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    getIconSource(icon: string): string {
        const iconPrefix = isAndroid ? "res://" : "res://tabIcons/";

        return iconPrefix + icon;
    }

    onSwipe(event: SwipeGestureEventData) {
        var selectIdx: number = this.tabview.nativeElement.selectedIndex;
        var dir: SwipeDirection = event.direction;
        switch (selectIdx) {
            case 0: 
                if (dir === SwipeDirection.left) {
                    this.tabview.nativeElement.selectedIndex = 1;
                }
                break;
            case 1:
                if (dir === SwipeDirection.left) {
                    this.tabview.nativeElement.selectedIndex = 3;
                } else {
                    this.tabview.nativeElement.selectedIndex = 0;
                }
                break;
            case 2:
                break;
            case 3:
                if (dir === SwipeDirection.left) {
                    this.tabview.nativeElement.selectedIndex = 4;
                } else {
                    this.tabview.nativeElement.selectedIndex = 1;
                }
                break;
            case 4:
                if (dir === SwipeDirection.left) {
                    this.tabview.nativeElement.selectedIndex = 0;
                } else {
                    this.tabview.nativeElement.selectedIndex = 3;
                }
                break;
        }
      }
}
