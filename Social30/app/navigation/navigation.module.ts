import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule, NSEmptyOutletComponent } from "nativescript-angular/router";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NavigationComponent } from "./navigation.component";

// interceptor
//import { TokenInterceptor } from '../shared/helper/token.interceptor';
// import { HTTP_INTERCEPTORS } from "@angular/common/http";

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
                        loadChildren: "./calender/calender.module#CalenderModule" },
                    {   path: "henquiry",
                        outlet: "henquiryoutlet",
                        component: NSEmptyOutletComponent,
                        loadChildren: "./henquiry/henquiry.module#HenquiryModule" },
                ]
            }
        ])
    ],
    declarations: [
        NavigationComponent,
    ],
    providers: [
        // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NavigationModule { }