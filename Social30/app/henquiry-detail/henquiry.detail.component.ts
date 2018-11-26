import { Component, ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { Page } from "tns-core-modules/ui/page";
import { getCategoryIconSource } from "../app.component";
import { DatePicker } from "tns-core-modules/ui/date-picker";



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


    onPickerLoaded(args) {
        let datePicker = <DatePicker>args.object;

        datePicker.minDate = new Date();
        datePicker.maxDate = new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000));
    }

    onDateChanged(args) {
        console.log("Date New value: " + args.value);
        console.log("Date value: " + args.oldValue);
    }

    onDayChanged(args) {
        console.log("Day New value: " + args.value);
        console.log("Day Old value: " + args.oldValue);
    }

    onMonthChanged(args) {
        console.log("Month New value: " + args.value);
        console.log("Month Old value: " + args.oldValue);
    }

    onYearChanged(args) {
        console.log("Year New value: " + args.value);
        console.log("Year Old value: " + args.oldValue);
    }


}

