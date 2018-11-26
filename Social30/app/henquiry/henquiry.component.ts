import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { getCategoryIconSource } from "../app.component";
import { HenquiryModalComponent } from "../henquiry-modal/henquiry.modal";



@Component({
    moduleId: module.id,
    selector: "henq",
    templateUrl: './henquiry.component.html',
    styleUrls: ['./henquiry.component.scss']
})
export class HenquiryComponent {
    
    public constructor(private modal: ModalDialogService, private vcRef: ViewContainerRef, page: Page) { 
        //page.actionBarHidden = true;
    }


    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }


}