import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { CalenderComponent } from "./calender.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "calender" },
            { path: "calender", component: CalenderComponent },
        ])
    ],
    declarations: [
        CalenderComponent,
    ],
    providers: [
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class CalenderModule { }