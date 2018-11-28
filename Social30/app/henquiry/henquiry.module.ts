import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HenquiryComponent } from "./henquiry.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { ModalDialogService } from "nativescript-angular/modal-dialog";
import { HenquiryModalComponent } from '../henquiry-modal/henquiry.modal';
import { HenquiryDetailComponent } from '../henquiry-detail/henquiry.detail.component';


@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forChild([
            { path: "", redirectTo: "henquiry" },
            { path: "henquiry", component: HenquiryComponent },
            { path: "henquiry/:id", component: HenquiryDetailComponent},
        ])
    ],
    entryComponents: [
        HenquiryModalComponent
    ],
    declarations: [
        HenquiryComponent,
        HenquiryModalComponent,
        HenquiryDetailComponent
    ],
    providers: [
        ModalDialogService,
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class HenquiryModule { }