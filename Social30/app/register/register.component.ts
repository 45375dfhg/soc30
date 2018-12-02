import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { first } from 'rxjs/operators';

import { getCategoryIconSource } from "../app.component";
import { AuthenticationService } from '../shared/services/authentication.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
	moduleId: module.id,
	selector: 'register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;


    currentPage: Number = 0;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private routerExtension: RouterExtensions,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private page: Page,
    ) { 
        page.actionBarHidden = true;
    }


    switchStatus (newPage: number) {
        this.currentPage = newPage;
    }





    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            email: ['', [
                    Validators.required, 
                    Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            password: ['', Validators.required],
            confPassword: ['', Validators.required],
            surname: ['', Validators.required],
            firstname: ['', Validators.required],
            nickname: ['', Validators.required],
        }, { validator: this.pwMatchValidator });

         // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '../home';
        
        // reset login status
		this.authenticationService.logout();
    }

    // https://stackoverflow.com/a/44449802
    pwMatchValidator(frm: FormGroup) {
        return frm.get('password').value === frm.get('confPassword').value
           ? null : {'mismatch': true};
    }

    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.catchAndSelect(error);
                    this.loading = false;
                }
            );
    }

    public goBack() {
        this.routerExtension.back();
    }

    getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}
}