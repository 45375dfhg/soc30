import { Component } from "@angular/core";
import { RouterExtensions } from 'nativescript-angular/router';
import { Page } from "tns-core-modules/ui/page";
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
    moduleId: module.id,
    selector: "profile",
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

    public constructor(private authenticationService: AuthenticationService, private router: RouterExtensions, private page: Page) {
        this.page.enableSwipeBackNavigation = false;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(["/welcome"], { clearHistory: true });
    }
}