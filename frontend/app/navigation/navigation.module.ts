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
            {
                path: "navigation", component: NavigationComponent, children: [
                    {
                        path: "items",
                        outlet: "itemsoutlet",
                        component: NSEmptyOutletComponent,
                        loadChildren: "./item/items.module#ItemsModule"
                    },
                    {
                        path: "calendar",
                        outlet: "calendaroutlet",
                        component: NSEmptyOutletComponent,
                        loadChildren: "./calendar/calendar.module#CalendarModule"
                    },
                    {
                        path: "henquiry",
                        outlet: "henquiryoutlet",
                        component: NSEmptyOutletComponent,
                        loadChildren: "./henquiry/henquiry.module#HenquiryModule"
                    },
                    {
                        path: "chat",
                        outlet: "chatoutlet",
                        component: NSEmptyOutletComponent,
                        loadChildren: "./chat/chat.module#ChatModule"
                    },
                    {
                        path: "profile",
                        outlet: "profileoutlet",
                        component: NSEmptyOutletComponent,
                        loadChildren: "./profile/profile.module#ProfileModule"
                    },
                ]
            }
        ])
    ],
    declarations: [
        NavigationComponent,
    ],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NavigationModule { }