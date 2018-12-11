import { Component } from "@angular/core";
import * as application from "tns-core-modules/application";
import { isAndroid, isIOS } from "tns-core-modules/platform";
import { RouterExtensions } from "nativescript-angular/router";

//StatusbarColor
import { topmost } from 'tns-core-modules/ui/frame';

//Carousel

import { registerElement } from 'nativescript-angular/element-registry';
import { Carousel, CarouselItem } from 'nativescript-carousel';

registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);


import * as app from 'application';

declare var android;

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html",
})
export class AppComponent {

    public constructor(private router: RouterExtensions) { 
        if(isIOS){
            //topmost().ios.controller.navigationBar.barStyle = 1;
        } else {
            let decorrView = app.android.startActivity.getWindow().getDecorView();
            decorrView.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }
    }

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