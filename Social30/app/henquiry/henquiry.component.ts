import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { Page } from "tns-core-modules/ui/page";

import { HenquiryModalComponent } from "../henquiry-modal/henquiry.modal";



@Component({
    moduleId: module.id,
    selector: "henq",
    templateUrl: './henquiry.component.html',
})
export class HenquiryComponent {
    
    public constructor(private modal: ModalDialogService, private vcRef: ViewContainerRef, page: Page) { 
        page.actionBarHidden = true;
    }

    public showModal() {
        let options = {
            context: {},
            fullscreen: true,
            viewContainerRef: this.vcRef
        };
        this.modal.showModal(HenquiryModalComponent, options).then(res => {
            console.log(res);
        });
    }
}