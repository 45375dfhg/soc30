import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { DatePicker } from "tns-core-modules/ui/date-picker";
import { TimePicker } from "tns-core-modules/ui/time-picker";
import * as ModalPicker from 'nativescript-modal-datetimepicker';

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

    currentPage: Number = 0;

    formatDuration = this.itemService.formatDuration;
    formatDistance = this.itemService.formatDistance;
    formatStartTime = this.itemService.formatStartTime;
    formatStartTimeLong = this.itemService.formatStartTimeLong;
    formatCategory = this.itemService.formatCategory;
    formatCategoryByUser = this.itemService.formatCategoryByUser;
    formatTerra = this.itemService.formatTerra;
    formatTime = this.itemService.formatTime;
    formatLocation = this.itemService.formatLocation;
    getSubStrings = this.itemService.getSubStrings;
    getSubs = this.itemService.getSubs;
    setIcon = this.itemService.getCategoryIconName;

    private today = new Date();
    private year: number;
    private yearDisplay: string;
    private month: number;
    private monthDisplay: string;
    private day: number;
    private dayDisplay: string; 
    private hour: number;
    private hourDisplay: string;
    private minute: number;
    private minuteDisplay: string;
    private duration: number;
    private amount: number;
    private category: { category: number, subcategory: number }
    private startTime: Date;


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
        this.hour = this.today.getHours();
        this.minute = this.today.getMinutes();
        this.dayDisplay = (this.today.getDate() + 1).toString();
        this.monthDisplay = this.today.getMonth().toString();
        this.yearDisplay = this.today.getFullYear().toString();
        this.hourDisplay = this.today.getHours().toString();
        this.minuteDisplay = this.today.getMinutes().toString();
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

    switchStatus(newPage: number) {
        this.currentPage = newPage;
    }

    getCategoryName(category: number) {
        switch (category) {
            case 0: {
                return "Schwerer Haushalt";
            }
            case 1: {
                return "Leichter Haushalt";
            }
            case 2: {
                return "Gesellschaft";
            }
            case 3: {
                return "Gartenarbeit";
            }
            case 4: {
                return "Tiere";
            }
        }
    }

    durationUp(){
        if (this.duration >= 120) {
            this.duration = 30;
        } else {
            this.duration += 30;
        }
    }

    personUp(){
        if (this.amount >= 4) {
            this.amount = 1;
        } else {
            this.amount += 1;
        }
    }

    getSubCategoryName(category: number, subcategory: number) {
        let names = this.getSubs();
        return names[category][subcategory];
    }

    pickDate() {
        const picker = new ModalPicker.ModalDatetimepicker();
        picker.pickDate({
            title: 'An welchem Tag brauchst du die Hilfe?',
            theme: 'none',
            minDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            maxDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
            is24HourView: true
        }).then((result) => {
            this.day = result.day;
            this.month = result.month - 1;
            this.year = result.year;
            this.dayDisplay = (result.day < 10) ?  "0" + result.day : result.day.toString();
            this.monthDisplay = (result.month < 10) ? "0" + result.month : result.month.toString();
            this.yearDisplay = result.year.toString();
        }).catch((error) => {
            console.log('Error: ' + error);
        });
    }

    pickTime() {
        const picker = new ModalPicker.ModalDatetimepicker();
        picker.pickTime({
            title: 'Um wie viel Uhr brauchst du die Hilfe?',
            theme: 'none',
            minDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            maxDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
            startingHour: 8,
            is24HourView: true
        }).then((result) => {
            this.hour = result.hour;
            this.hourDisplay = (result.hour < 10) ? "0" + result.hour : result.hour.toString();
            this.minute = result.minute
            this.minuteDisplay = (result.minute < 10) ? "0" + result.minute : result.minute.toString();
        }).catch((error) => {
            console.log('Error: ' + error);
        });
    }

    onTapMinute(duration) {
        this.duration = duration;
    }


    onTapAmount(amount) {
        this.amount = amount;
    }

    submitHenquiry() {
        if (!this.appSet.getUser('guest')) {
            // overly verbose but it works
            let start = new Date();
            start.setFullYear(this.year);
            start.setMonth(this.month);
            start.setDate(this.day);
            start.setHours(this.hour + 1);
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

