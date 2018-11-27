import { Component } from "@angular/core";
import * as application from "tns-core-modules/application";
import { isAndroid, isIOS } from "tns-core-modules/platform";
import { RouterExtensions } from "nativescript-angular/router";

//StatusbarColor
import { topmost } from 'tns-core-modules/ui/frame';

//Carousel
/*
import { registerElement } from 'nativescript-angular/element-registry';
import { Carousel, CarouselItem } from 'nativescript-carousel';

registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);
*/


@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html",
})
export class AppComponent {

<<<<<<< HEAD
    public constructor(private router: RouterExtensions) { }
=======
    public constructor(private router: RouterExtensions) {

    }
>>>>>>> 1ade35f12abf6a8beda061a7e6095365951fcad1

    public ngOnInit(): void {
        if (isAndroid) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
                args.cancel = true;
            });
        }
        if (isIOS) {
            topmost().ios.controller.navigationBar.barStyle = 1;
        }
    }
}

export function getCategoryIconSource(icon: string): string {
    const iconPrefix = isAndroid ? "res://" : "res://";
    return iconPrefix + icon;
}