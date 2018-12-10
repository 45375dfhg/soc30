import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";

import { Observable, timer, throwError, BehaviorSubject } from 'rxjs';
import { concatMap, map, switchMap, catchError } from 'rxjs/operators';

import { AppSettingsService } from '../shared/services/appsettings.service';
import { ItemService } from "../shared/services/item.service";



@Component({
    moduleId: module.id,
    selector: "rating",
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

    // sync
    private id: string;
    private raiting; 

    constructor(
        private route: ActivatedRoute,
        private routerExtension: RouterExtensions,
        private page: Page,
        private appSet: AppSettingsService,
        private itemService: ItemService) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        if (!this.appSet.getUser('guest')) {

        }
    }

    /*
    Gonna need a way to rate all aides and not just a single one
    but hard to derive all the aide ids by route information sharing
    */

    submitRating() {
        let role = this.id.slice(0,1);
        let henqId = this.id.slice(1);
        if (role === 'X') {
            this.itemService.rateItem(henqId, this.raiting);
        }
        if (role === 'Y') {
            this.itemService.rateFilerItem(henqId, this.raiting)
        }
    }

    public goBack() {
        this.routerExtension.back();
    }
}