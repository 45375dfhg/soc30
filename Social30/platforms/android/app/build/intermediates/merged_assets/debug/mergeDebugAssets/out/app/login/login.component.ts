import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { first, catchError } from 'rxjs/operators';
import { Page } from "tns-core-modules/ui/page";
import { Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

import { AuthenticationService } from '../shared/services/authentication.service';

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
		private authenticationService: AuthenticationService,
		page: Page,
		//private alertService: AlertService
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

	get f() { return this.signUpForm.controls; }

	 onSubmit() {
		this.submitted = true;

		 // stop here if form is invalid
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
					console.log(error);
				});	
	}
	/*
	 private handleErrors(operation: string) {
        return (err: any) => {
            let errMsg = `error in ${operation}()`;
            console.log(`${errMsg}:`, err);
            if (err instanceof HttpErrorResponse) {
                console.log(`Status: ${err.status}, ${err.statusText}`);
            }
            return Observable.throw(errMsg);
        }
	}
	*/
}