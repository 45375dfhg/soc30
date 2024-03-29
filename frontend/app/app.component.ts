import { Component } from "@angular/core";
import * as application from "tns-core-modules/application";
import { isAndroid, isIOS, device } from "tns-core-modules/platform";
import { RouterExtensions } from "nativescript-angular/router";

//StatusbarColor
import { topmost } from 'tns-core-modules/ui/frame';

//Carousel
import { registerElement } from 'nativescript-angular/element-registry';
import { Carousel, CarouselItem } from 'nativescript-carousel';

registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);

declare var android;

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html",
})
export class AppComponent {

    public constructor(
        private routerExtension: RouterExtensions) { 
        if(isIOS){
            //topmost().ios.controller.navigationBar.barStyle = 1;
        } else {
            let decorrView = application.android.startActivity.getWindow().getDecorView();
            if (device.sdkVersion >= "23") {
                decorrView.setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
            }
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