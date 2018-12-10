import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "tns-core-modules/ui/page";

import { ProfileService } from '../shared/services/profile.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { AppSettingsService } from '../shared/services/appsettings.service';
import { getCategoryIconSource } from "../app.component";


@Component({
    moduleId: module.id,
    selector: "profile",
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    // sync
    private profile;
    private rating; // received as aide
    private ratings; // received as

    public constructor(
        private authenticationService: AuthenticationService,
        private profileService: ProfileService,
        private appSet: AppSettingsService,
        private router: RouterExtensions, private page: Page) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        if (this.appSet.getUser('currentUser')) {
            this.loadProfile();
        } else {
            // dummy data
        }
    }

    loadProfile() {
        let currentUser = JSON.parse(this.appSet.getUser('currentUser'));
        let id = currentUser._id;
        this.profileService.getProfile(id).subscribe(
            res => {
                console.log(res);
                this.profile = res;
            });
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(["/welcome"], { clearHistory: true });
    }

    getCategoryIconSource(icon: string): string {
        return getCategoryIconSource(icon);
    }
}