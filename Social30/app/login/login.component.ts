import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { first} from 'rxjs/operators';
import { Page } from "tns-core-modules/ui/page";
import { Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

import { getCategoryIconSource } from "../app.component";
import { AuthenticationService } from '../shared/services/authentication.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
	moduleId: module.id,
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
	signUpForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private routerExtension: RouterExtensions,
		private authenticationService: AuthenticationService,
		private alertService: AlertService,
		private page: Page,
	) {
		page.actionBarHidden = true;
	}

	ngOnInit() {
		this.signUpForm = this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});

		// reset login status
		this.authenticationService.logout();

		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '../home';
	}

	getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}

	get f() { return this.signUpForm.controls; }

	onSubmit() {
		this.submitted = true;

		// form validation
		if (this.signUpForm.invalid) {
			return;
		}

		this.loading = true;
		this.authenticationService.login(this.f.email.value, this.f.password.value)
			.pipe(first())
			.subscribe(
				data => {
					this.router.navigate([this.returnUrl]);
				},
				error => {
					this.alertService.catchAndSelect(error);
					this.loading = false;
				});
	}

	public goBack() {
        this.routerExtension.back();
    }
}