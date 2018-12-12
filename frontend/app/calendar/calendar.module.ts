import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { CalendarComponent } from "./calendar.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptUIListViewModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "calendar" },
            { path: "calendar", component: CalendarComponent },
        ]),
    ],
    declarations: [
        CalendarComponent,
    ],
    providers: [
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class CalendarModule { }