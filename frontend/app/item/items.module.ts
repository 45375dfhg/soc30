import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ItemsComponent } from "./items.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { FilterItemsComponent } from "../filterItems/filterItems.component";

import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "items" },
            { path: "items", component: ItemsComponent },
            { path: "filterItems", component: FilterItemsComponent},
        ])
    ],
    declarations: [
        ItemsComponent,
        FilterItemsComponent
    ],
    providers: [
        // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ItemsModule { }