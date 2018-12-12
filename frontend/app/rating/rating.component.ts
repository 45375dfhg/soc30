import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { getCategoryIconSource } from "../app.component";

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
    private rating = [];
    private helper: string;
    private idx: number;
    private disabled = true;

    private categories = [false, false, false, false, false, false, false, false, false, false, false, false]

    constructor(
        private route: ActivatedRoute,
        private routerExtension: RouterExtensions,
        private page: Page,
        private appSet: AppSettingsService,
        private itemService: ItemService) {
        this.page.enableSwipeBackNavigation = false;
    }

    toggleCategory(id, args) {
        this.changeColorCategory(args);
        this.categories[id] = !this.categories[id];
        if(this.categories.find(a => a === true)){
            this.disabled = false;
        } else {
            this.disabled = true;
        }
        console.log(this.categories);
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.params['id'];
        if (!this.appSet.getUser('guest')) {
            if (this.id.indexOf('YZ') === -1) {
                this.idx = this.id.indexOf('XY');
                this.helper = this.id.slice(0, this.idx)
            } else {
                this.idx = this.id.indexOf('YZ');
                this.helper = this.id.slice(0, this.idx)
            }
        } else {
            console.log('how the fuck did the user get here?');
        }
    }

    createRatingArray() {
        this.categories.forEach((item, idx) => {
            if (item) {
                this.rating.push(idx)
            }
        })
    }

    changeColorCategory(args) {
		let btn = args.object; // tapped on object
		if (btn.className === "ratingItem") {
			btn.className = "ratingItemSelected";
		} else {
			btn.className = "ratingItem";
		}
	}

    submitRating() {
        console.log(this.id);
        let role = this.id.slice(this.idx, this.idx + 2);
        this.createRatingArray();
        if (role === 'XY') {
            let aideIdx = this.id.indexOf('QBD');
            let henqId = this.id.slice(this.idx + 2, aideIdx);
            let aideId = this.id.slice(aideIdx + 3);
            console.log(this.id)
            console.log(henqId)
            console.log(aideId)
            this.itemService.rateItem(henqId, aideId, this.rating).subscribe();
        }
        if (role === 'YZ') {
            let henqId = this.id.slice(this.idx + 2);
            this.itemService.rateFilerItem(henqId, this.rating).subscribe();
        }
        this.goBack();
    }

    public goBack() {
        this.routerExtension.back();
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }
}
