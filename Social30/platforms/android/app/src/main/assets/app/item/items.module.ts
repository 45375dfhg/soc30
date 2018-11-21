import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ItemsComponent } from "./items.component";
import { ItemDetailComponent } from "../item-detail/item-detail.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "items" },
            { path: "items", component: ItemsComponent },
            { path: "item/:id", component: ItemDetailComponent},
        ])
    ],
    declarations: [
        ItemsComponent,
        ItemDetailComponent,
    ],
    providers: [
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ItemsModule { }