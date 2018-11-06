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
        if (this.tabview.nativeElement.selectedIndex === 2 && event.direction === SwipeDirection.left){
          this.tabview.nativeElement.selectedIndex = 3;
        } else if(this.tabview.nativeElement.selectedIndex === 3 && event.direction === SwipeDirection.right){
          this.tabview.nativeElement.selectedIndex = 2;
        }
      }
    
}
