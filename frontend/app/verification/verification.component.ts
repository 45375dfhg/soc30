import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";

import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Page } from "tns-core-modules/ui/page";

import { first } from 'rxjs/operators';

import { ProfileService } from '../shared/services/profile.service';
import { AppSettingsService } from '../shared/services/appsettings.service';

@Component({
    moduleId: module.id,
    selector: "verification",
    templateUrl: './verification.component.html',
    styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

    private verificationForm: FormGroup;
    private submitted: boolean = false;
    private loading: boolean = false;

    private returnUrl;

    public constructor(
        private profileService: ProfileService,
        private appSet: AppSettingsService,
        private route: ActivatedRoute,
        private routerExtension: RouterExtensions,
        private formBuilder: FormBuilder,
        private page: Page) {
        this.page.enableSwipeBackNavigation = false;
    }

    ngOnInit(): void {
        if (this.appSet.getUser('currentUser')) {
            this.verificationForm = this.formBuilder.group({
                code: ['', Validators.required],
                email: ['', [
                    Validators.required,
                    Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]]
            })
            // get return url from route parameters or default to '/'
            this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '../home';
        }
    }

    get f() { return this.verificationForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.verificationForm.invalid) {
            return;
        }

        this.loading = true;

        this.profileService.verifyProfile(this.verificationForm.value)
            .pipe(first())
            .subscribe(
                data => this.goBack());

    }


    public goBack() {
        this.routerExtension.back();
    }
}