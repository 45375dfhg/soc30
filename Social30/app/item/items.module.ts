import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { ItemsComponent } from "./items.component";
import { ItemDetailComponent } from "../item-detail/item-detail.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { FilterItemsComponent } from "../filterItems/filterItems.component";

import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

// interceptor
// import { TokenInterceptor } from '../shared/helper/token.interceptor';
// import { HTTP_INTERCEPTORS } from "@angular/common/http";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "items" },
            { path: "items", component: ItemsComponent },
            { path: "filteItems", component: FilterItemsComponent},
            { path: "item/:id", component: ItemDetailComponent},
        ])
    ],
    declarations: [
        ItemsComponent,
        ItemDetailComponent,
        FilterItemsComponent
    ],
    providers: [
        // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ItemsModule { }