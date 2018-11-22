import { Component } from "@angular/core";
import * as application from "tns-core-modules/application";
import { isAndroid, isIOS } from "tns-core-modules/platform";
import { RouterExtensions } from "nativescript-angular/router";

//StatusbarColor
import { topmost } from 'tns-core-modules/ui/frame';

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html",
})
export class AppComponent {

    public constructor(private router: RouterExtensions) { 
        
    }

    public ngOnInit(): void {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
            args.cancel = true;
        });
        if (isIOS){
            topmost().ios.controller.navigationBar.barStyle = 1;
        }
    }
}

export function getCategoryIconSource(icon: string): string {
    const iconPrefix = isAndroid ? "res://" : "res://category_icons/";
    return iconPrefix + icon;
}