import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { TimePicker } from "tns-core-modules/ui/time-picker";

import { getCategoryIconSource } from "../app.component";
import { ItemService } from "../shared/services/item.service";
import { AppSettingsService } from '../shared/services/appsettings.service';


@Component({
    moduleId: module.id,
    selector: "henq-detail",
    templateUrl: './henquiry.detail.component.html',
    styleUrls: ['./henquiry.detail.component.scss']
})
export class HenquiryDetailComponent implements OnInit {

    id;
    cat;
    sub;

    setIcon = this.itemService.getCategoryIconName;

    private today = new Date();
    private year: number;
    private month: number;
    private day: number;
    private hour: number;
    private minute: number;
    private duration: number;
    private amount: number;
    private category: { category: number, subcategory: number }

    constructor(
        private route: ActivatedRoute,
        private routerExtension: RouterExtensions,
        private page: Page,
        private itemService: ItemService,
        private appSet: AppSettingsService) {
        
        this.page.enableSwipeBackNavigation = false;
        this.day = this.today.getDate() + 1;
        this.month = this.today.getMonth();
        this.year = this.today.getFullYear();
        this.duration = 30; // placeholder
        this.amount = 1;
        this.category = {
            category: 0,
            subcategory: 0
        }
    }

    ngOnInit(): void {
        // get the category object by slicing the routing id
        this.id = this.route.snapshot.params['id'];
        this.cat = this.id.slice(0, 1);
        this.sub = this.id.slice(1);

        this.category.category = +this.cat;
        this.category.subcategory = +this.sub;
    }

    onPickerLoadedDate(args) {
        let datePicker = <DatePicker>args.object;

        let today = new Date();
        let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        let future = new Date();

        // define max value
        future.setMonth(future.getMonth() + 3);

        // base values
        datePicker.year = today.getFullYear();;
        datePicker.month = today.getMonth();
        datePicker.day = today.getDate() + 1;

        // ranges
        datePicker.minDate = tomorrow;
        datePicker.maxDate = future;
    }

    // maybe fix minute interval?
    onPickerLoadedTime(args) {
        let timePicker = <TimePicker>args.object;
        let now = new Date();

        timePicker.minuteInterval = 15;
        timePicker.hour = now.getHours();
        timePicker.minute = 0;
    }

    onTimeChanged(args) {
        let time = new Date(args.value);
        this.hour = time.getHours(), this.minute = time.getMinutes();
    }


    onTapMinute(duration) {
        this.duration = duration;
    }

    onTapAmount(amount) {
        this.amount = amount;
    }

    onDayChanged(args) {
        this.day = args.value;
    }

    onMonthChanged(args) {
        this.month = args.value;
    }

    onYearChanged(args) {
        this.year = args.value;
    }

    submitHenquiry() {
        if (!this.appSet.getUser('guest')) {
            // overly verbose but it works
            let start = new Date();
            start.setFullYear(this.year);
            start.setMonth(this.month - 1);
            start.setDate(this.day);
            start.setHours(this.hour - 1); // hotfix
            start.setMinutes(this.minute);

            // adds the duration in minutes to the start time 
            let end = new Date(start.getTime() + this.duration * 60000)
            
            // console.log(this.category)
            this.itemService.postItem(+this.amount, start, end, this.category).subscribe(
                res => this.routerExtension.backToPreviousPage(), // needs to be changed to a better target
                err => {
                    if (err instanceof HttpErrorResponse) {
                        console.log(`Status: ${err.status}, ${err.statusText}, ${err}`);
                    }
                });
        } else {
            alert({
                title: "Du bist ein Gast ",
                message: "und musst dich einloggen, um Hilfe anzufragen.",
                okButtonText: "Achso"
            })
        }
    }

    public goBack() {
        this.routerExtension.back();
    }
}

// routerExtension.navigate(["/home"], { clearHistory: true })

