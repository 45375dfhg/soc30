import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { getCategoryIconSource } from "../app.component";
import { FontStyles, PropertyEditor, RadDataForm } from "nativescript-ui-dataform";



@Component({
    moduleId: module.id,
    selector: "henq-detail",
    templateUrl: './henquiry.detail.component.html',
    styleUrls: ['./henquiry.detail.component.scss']
})
export class HenquiryDetailComponent {


    public constructor(page: Page) { 
        //page.actionBarHidden = true;
    }


    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }





}

