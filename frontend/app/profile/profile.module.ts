import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";

import { ProfileComponent } from "./profile.component";
import { VerificationComponent } from '../verification/verification.component';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUIListViewModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "profile" },
            { path: "profile", component: ProfileComponent },
            { path: "verify", component: VerificationComponent }
        ])
    ],
    declarations: [
        ProfileComponent,
        VerificationComponent
    ],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ProfileModule { }