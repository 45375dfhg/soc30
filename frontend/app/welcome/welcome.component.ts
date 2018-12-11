import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Carousel, IndicatorAnimation } from 'nativescript-carousel';
import { getCategoryIconSource } from "../app.component";
import { Page } from "tns-core-modules/ui/page";

import { AppSettingsService } from '../shared/services/appsettings.service';

import { AuthenticationService } from '../shared/services/authentication.service';
import { Config } from '../shared/config';

@Component({
	moduleId: module.id,
	selector: 'welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss']

})

export class WelcomeComponent implements OnInit {
	@ViewChild('carousel') carouselRef: ElementRef;
	
	// sync
	private ip: string;
	
	constructor(
		private page: Page, 
		private appSet: AppSettingsService,
		private authenticationService: AuthenticationService) {
		page.actionBarHidden = true;
		this.page.enableSwipeBackNavigation = false;
		this.ip = Config.apiUrl;
	}

	ngOnInit() { }

	changeIp() {
		Config.apiUrl = this.ip;
	}

	onTapGuest() {
		// reset login status - clean before prod
		this.authenticationService.logout();
		// register user as guest
		this.appSet.setUser('guest', 'true');
	}

	getCategoryIconSource(icon: string): string {
		return getCategoryIconSource(icon);
	}

}