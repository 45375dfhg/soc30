import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule, NSEmptyOutletComponent } from "nativescript-angular/router";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { NavigationComponent } from "./navigation.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "navigation" },
            { path: "navigation", component: NavigationComponent, children: [
                    {   path: "items",
                        outlet: "itemsoutlet",
                        component: NSEmptyOutletComponent,
                        loadChildren: "./item/items.module#ItemsModule" },
                    {   path: "calender",
                        outlet: "calenderoutlet",
                        component: NSEmptyOutletComponent,
                        loadChildren: "./calender/calender.module#CalenderModule" }]
            }
        ])
    ],
    declarations: [
        NavigationComponent
    ],
    providers: [
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NavigationModule { }