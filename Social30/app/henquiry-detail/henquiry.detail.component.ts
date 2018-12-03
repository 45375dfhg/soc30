import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { TimePicker } from "tns-core-modules/ui/time-picker";

import { getCategoryIconSource } from "../app.component";
import { ItemService } from "../shared/services/item.service";




@Component({
    moduleId: module.id,
    selector: "henq-detail",
    templateUrl: './henquiry.detail.component.html',
    styleUrls: ['./henquiry.detail.component.scss']
})
export class HenquiryDetailComponent {
    
    id;
    idtype;
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
    private category: {category:number, subcategory: number}

    constructor(private route: ActivatedRoute, private routerExtension: RouterExtensions, private page: Page, private itemService: ItemService) {
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
        this.id = this.route.snapshot.params['id'];
        this.idtype = typeof this.id;
        this.cat = this.id.slice(0, 1);
        this.sub = this.id.slice(1);
        console.log(this.cat + " " + this.sub)
        this.category.category = +this.cat;
        this.category.subcategory = +this.sub;
    }

    onPickerLoadedDate(args) {
        let datePicker = <DatePicker>args.object;

        let today = new Date();
        let future = new Date();
        
        // define max value
        future.setMonth(future.getMonth() + 3);

        // base values
        datePicker.year = today.getFullYear();;
        datePicker.month = today.getMonth();
        datePicker.day = today.getDate() + 1;
        
        // ranges
        datePicker.minDate = today;
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
        console.log("hour: " + this.hour);
        console.log("min: " + this.minute)
    }


    onTapMinute(duration) {
        this.duration = duration;
        console.log("duration: " + this.duration)
    }
    
    onTapAmount(amount) {
        this.amount = amount;
        console.log("amount: " + this.amount)
    }

    onDayChanged(args) {
        this.day = args.value;
        console.log("day: " + this.day)
    }

    onMonthChanged(args) {
        this.month = args.value;
        console.log("month: " + this.month)
    }

    onYearChanged(args) {
        this.year = args.value;
        console.log("year: " + this.year)
    }

    submitHenquiry() {
        let start = new Date();
        start.setFullYear(this.year);
        start.setMonth(this.month - 1);
        start.setDate(this.day);
        start.setHours(this.hour);
        start.setMinutes(this.minute);

        let end = new Date(start.getTime() + this.duration * 60000)
        // end.setMinutes(start.getMinutes() + this.duration)

        console.log(start);
        console.log(end);
        console.log(this.category)
        this.itemService.postItem(+this.amount,start,end,this.category);
    }

    public goBack() {
        this.routerExtension.back();
    }
}


