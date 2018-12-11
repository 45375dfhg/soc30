import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "tns-core-modules/ui/page";

import { ProfileService } from '../shared/services/profile.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { AppSettingsService } from '../shared/services/appsettings.service';
import { getCategoryIconSource } from "../app.component";
import { ItemService } from '../shared/services/item.service'

import _ from "lodash";


@Component({
    moduleId: module.id,
    selector: "profile",
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    getAvatar = this.itemService.getAvatar;
    getAvatarStrings = this.itemService.getAvatarStrings;

    // sync
    private profile;
    private ratingsFiler;
    private icon1;
    private icon2;
    private icon3;
    private guest: boolean = false;
    private registerDate;
    private status: number;

    public constructor(
        private authenticationService: AuthenticationService,
        private profileService: ProfileService,
        private appSet: AppSettingsService,
        private router: RouterExtensions, private page: Page,
        private itemService: ItemService) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        if (this.appSet.getUser('currentUser')) {
            this.loadProfile();
        } else {
            this.guest = true;
        }
    }

    loadProfile() {
        let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
        let id = currentUser._id;
        this.profileService.getProfile(id).subscribe(
            res => {
                console.log(res.ratings);
                this.ratingsFiler = this.getIdxOfThreeHighestProperties(res.ratings);
                this.icon1 = this.ratingsFiler[0];
                this.icon2 = this.ratingsFiler[1];
                this.icon3 = this.ratingsFiler[2];
                let tmp = new Date(res.registerDate);
                this.registerDate = tmp.getFullYear();
                this.status = res.invite.level;
                this.profile = res;
            });
    }

    getIdxOfThreeHighestProperties(arr) {
        let tmp = [];
        for (let i = 0; i < 3; i++) {
            let max = _.max(arr);
            let idx = arr.indexOf(max);
            tmp.push(arr.indexOf(max));
            arr[idx] = null;
        }
        console.log(tmp);
        return tmp;
    }

    verifyable() {
        if (this.status === 3) {
            return true;
        }
        return false;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(["/welcome"], { clearHistory: true });
    }

    getPropertyIconSource(idx: number): string {
        enum Properties {stark, sonnenschein, sauber, puenktlich, lustig, lieb, hoeren, gruenerdaumen, glashalbvoll, gespraechig, geschickt, tierlieb}
        return this.getCategoryIconSource(Properties[idx]);
    }

    getPropertyString(idx: number): string {
        enum Properties {Stark, Sonnenschein, Sauber, Pünktlich, Lustig, Lieb, 'Guter Zuhörer', 'Grüner Daumen', 'Glas Halbvoll', Gesprächig, Geschickt, Tierlieb}
        return Properties[idx];
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }
}