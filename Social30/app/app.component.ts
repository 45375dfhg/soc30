import { Component } from "@angular/core";
import * as application from "tns-core-modules/application";
import { isAndroid } from "tns-core-modules/platform";
import { RouterExtensions } from "nativescript-angular/router";


@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html",
})
export class AppComponent {

    public constructor(private router: RouterExtensions) { }

    public ngOnInit(): void {
        if (!isAndroid) {
            return;
        }
        application.android.on(application.AndroidApplication.activityBackPressedEvent, (args: any) => {
            if (this.router.canGoBack()) {
                args.cancel = true;
            } else {
                args.cancel = false;
            }
        }); 
    }
}

export function getCategoryIconSource(icon: string): string {
    const iconPrefix = isAndroid ? "res://" : "res://category_icons/";
    console.log("YEEEEEET");
    return iconPrefix + icon;
}
